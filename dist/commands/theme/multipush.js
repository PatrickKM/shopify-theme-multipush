"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const child_process_1 = require("child_process");
const fs = __importStar(require("fs"));
const toml = __importStar(require("toml"));
const path = __importStar(require("path"));
const cli_progress_1 = __importDefault(require("cli-progress"));
class ThemeMultiPush extends core_1.Command {
    static description = "Push to multiple Shopify theme environments using a wildcard";
    static flags = {
        env: core_1.Flags.string({
            char: "e",
            description: 'Environment wildcard (e.g., "production_*")',
            required: true,
        }),
        path: core_1.Flags.string({
            char: "p",
            description: "Override the path to your compiled theme directory (optional)",
        }),
        "dry-run": core_1.Flags.boolean({
            char: "d",
            description: "Simulate the process without actually pushing any files",
            default: false,
        }),
        async: core_1.Flags.boolean({
            char: "a",
            description: "Run pushes concurrently with custom progress bars",
            default: false,
        }),
        "allow-live": core_1.Flags.boolean({
            description: "Allow pushing to a live theme without confirmation prompts",
            default: false,
        }),
        "batch-size": core_1.Flags.integer({
            description: "Number of themes to process concurrently in async mode",
            default: 10,
        }),
    };
    async run() {
        const { flags } = await this.parse(ThemeMultiPush);
        const envPattern = flags.env;
        const isDryRun = flags["dry-run"];
        const isAsync = flags.async;
        const allowLive = flags["allow-live"];
        const batchSize = flags["batch-size"];
        const MAX_RETRIES = 3;
        // We will store all failed pushes here to print an Error Summary at the end!
        const failedPushes = [];
        if (isDryRun) {
            this.log("\n========================================");
            this.log(" 🧪 RUNNING IN DRY-RUN MODE ");
            this.log("========================================");
        }
        const configPath = path.join(process.cwd(), "shopify.theme.toml");
        if (!fs.existsSync(configPath)) {
            this.error(`shopify.theme.toml not found at root (${configPath}). Are you in the right directory?`);
        }
        const configFile = fs.readFileSync(configPath, "utf-8");
        const config = toml.parse(configFile);
        const allEnvironments = Object.keys(config.environments || {});
        const regexPattern = new RegExp("^" + envPattern.replace(/\*/g, ".*") + "$");
        const matchingEnvs = allEnvironments.filter((env) => regexPattern.test(env));
        if (matchingEnvs.length === 0) {
            this.error(`No environments found matching "${envPattern}" in your shopify.theme.toml`);
        }
        this.log(`\nFound ${matchingEnvs.length} matching environments...`);
        const globalTomlPath = config.path;
        const buildArgs = (env, resolvedPath) => {
            const args = ["theme", "push", "-e", env];
            if (resolvedPath !== ".")
                args.push("--path", resolvedPath);
            if (allowLive)
                args.push("--allow-live");
            return args;
        };
        if (isDryRun) {
            // --- DRY RUN LOGIC ---
            for (const env of matchingEnvs) {
                const envTomlPath = config.environments[env]?.path;
                const resolvedPath = flags.path || envTomlPath || globalTomlPath || ".";
                const args = buildArgs(env, resolvedPath);
                this.log(`\n[DRY RUN] Would push to: ${env}`);
                this.log(`[DRY RUN] Command: shopify ${args.join(" ")}`);
            }
            this.log("\n🧪 Dry run completed. No files were modified.");
        }
        else if (isAsync) {
            // --- ASYNC (CONCURRENT BATCH) LOGIC ---
            this.log(`\n🚀 Starting CONCURRENT pushes to ${matchingEnvs.length} environments...\n`);
            for (let i = 0; i < matchingEnvs.length; i += batchSize) {
                const batchEnvs = matchingEnvs.slice(i, i + batchSize);
                const currentBatchNum = Math.floor(i / batchSize) + 1;
                const totalBatches = Math.ceil(matchingEnvs.length / batchSize);
                if (totalBatches > 1) {
                    this.log(`\n📦 Processing Batch ${currentBatchNum} of ${totalBatches} (${batchEnvs.length} themes)...`);
                }
                const multibar = new cli_progress_1.default.MultiBar({
                    clearOnComplete: false,
                    hideCursor: true,
                    barsize: 10,
                    format: " {bar} | {percentage}% | {env} | {status}",
                }, cli_progress_1.default.Presets.shades_classic);
                const pushPromises = batchEnvs.map((env) => {
                    const envTomlPath = config.environments[env]?.path;
                    const resolvedPath = flags.path || envTomlPath || globalTomlPath || ".";
                    const args = buildArgs(env, resolvedPath);
                    const bar = multibar.create(100, 0, {
                        env: env.padEnd(20),
                        status: "Starting...",
                    });
                    const executeAsyncPush = (attempt) => {
                        return new Promise((resolve) => {
                            if (attempt > 1) {
                                bar.update(0, { status: `Retrying (Attempt ${attempt}/${MAX_RETRIES})...` });
                            }
                            const child = (0, child_process_1.spawn)("shopify", args, { shell: true });
                            let fullOutput = "";
                            const handleOutput = (data) => {
                                const output = data.toString();
                                fullOutput += output; // Memorize output for potential error reporting
                                const percentMatch = output.match(/(\d+)%/);
                                const fractionMatch = output.match(/(\d+)\/(\d+)/);
                                if (percentMatch) {
                                    const percent = parseInt(percentMatch[1], 10);
                                    bar.update(percent, { status: `Uploading ${percent}%` });
                                }
                                else if (fractionMatch) {
                                    const current = parseInt(fractionMatch[1], 10);
                                    const total = parseInt(fractionMatch[2], 10);
                                    if (total > 0) {
                                        const percent = Math.round((current / total) * 100);
                                        bar.update(percent, { status: `Uploading ${current}/${total}` });
                                    }
                                }
                                else if (output.toLowerCase().includes("error") && !output.toLowerCase().includes("throttled")) {
                                    bar.update(100, { status: "Error detected!" });
                                }
                            };
                            child.stdout.on("data", handleOutput);
                            child.stderr.on("data", handleOutput);
                            child.on("close", (code) => {
                                if (code === 0) {
                                    bar.update(100, { status: "✅ Done!" });
                                    resolve();
                                }
                                else {
                                    if (fullOutput.toLowerCase().includes("throttled")) {
                                        if (attempt < MAX_RETRIES) {
                                            bar.update(100, { status: "⏳ Throttled! Waiting 30s..." });
                                            setTimeout(() => resolve(executeAsyncPush(attempt + 1)), 30000);
                                        }
                                        else {
                                            bar.update(100, { status: `❌ Failed (${MAX_RETRIES} Retries)` });
                                            failedPushes.push({ env, error: fullOutput }); // Save error
                                            resolve();
                                        }
                                    }
                                    else {
                                        bar.update(100, { status: "❌ Failed!" });
                                        failedPushes.push({ env, error: fullOutput }); // Save error
                                        resolve();
                                    }
                                }
                            });
                        });
                    };
                    return executeAsyncPush(1);
                });
                await Promise.all(pushPromises);
                multibar.stop();
            }
        }
        else {
            // --- SYNC (SEQUENTIAL) LOGIC ---
            for (const env of matchingEnvs) {
                const envTomlPath = config.environments[env]?.path;
                const resolvedPath = flags.path || envTomlPath || globalTomlPath || ".";
                const args = buildArgs(env, resolvedPath);
                const executeSyncPush = (attempt) => {
                    return new Promise((resolve) => {
                        if (attempt > 1) {
                            this.log(`\n⏳ Retrying ${env} (Attempt ${attempt}/${MAX_RETRIES})...`);
                        }
                        else {
                            this.log(`\n========================================`);
                            this.log(`🚀 Pushing to environment: ${env}`);
                            this.log(`========================================\n`);
                        }
                        const child = (0, child_process_1.spawn)("shopify", args, { shell: true });
                        let fullOutput = "";
                        child.stdout.on("data", (data) => {
                            fullOutput += data.toString();
                            process.stdout.write(data);
                        });
                        child.stderr.on("data", (data) => {
                            fullOutput += data.toString();
                            process.stderr.write(data);
                        });
                        child.on("close", (code) => {
                            if (code === 0) {
                                this.log(`\n✅ Successfully pushed to ${env}`);
                                resolve();
                            }
                            else {
                                if (fullOutput.toLowerCase().includes("throttled")) {
                                    if (attempt < MAX_RETRIES) {
                                        this.warn(`\n⏳ Throttled by Shopify! Waiting 30 seconds before retrying...`);
                                        setTimeout(() => resolve(executeSyncPush(attempt + 1)), 30000);
                                    }
                                    else {
                                        this.warn(`\n❌ Failed to push to ${env} after ${MAX_RETRIES} attempts.`);
                                        failedPushes.push({ env, error: fullOutput }); // Save error
                                        resolve();
                                    }
                                }
                                else {
                                    this.warn(`\n❌ Failed to push to ${env}. Moving to next environment...`);
                                    failedPushes.push({ env, error: fullOutput }); // Save error
                                    resolve();
                                }
                            }
                        });
                    });
                };
                await executeSyncPush(1);
            }
        }
        // 4. PRINT FINAL SUMMARY
        if (!isDryRun) {
            if (failedPushes.length > 0) {
                this.log("\n\n========================================");
                this.log(" 🚨 ERROR SUMMARY REPORT");
                this.log("========================================");
                this.log(`The following ${failedPushes.length} environment(s) failed to push:\n`);
                for (const failure of failedPushes) {
                    this.log(`❌ Environment: ${failure.env}`);
                    this.log("----------------------------------------");
                    // Print the exact background text, trimming off excess whitespace
                    this.log(failure.error.trim() || "No explicit error output was caught from the CLI.");
                    this.log("\n");
                }
            }
            else {
                this.log("\n🎉 All pushes completed successfully without any errors!");
            }
        }
    }
}
exports.default = ThemeMultiPush;
