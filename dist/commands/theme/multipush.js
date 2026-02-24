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
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const child_process_1 = require("child_process");
const util = __importStar(require("util"));
const fs = __importStar(require("fs"));
const toml = __importStar(require("toml"));
const path = __importStar(require("path"));
// Convert the callback-based 'exec' into a modern Promise for async support
const execAsync = util.promisify(child_process_1.exec);
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
            description: "Run pushes concurrently (Warning: may hit Shopify API rate limits)",
            default: false,
        }),
    };
    async run() {
        const { flags } = await this.parse(ThemeMultiPush);
        const envPattern = flags.env;
        const isDryRun = flags["dry-run"];
        const isAsync = flags.async;
        if (isDryRun) {
            this.log("\n========================================");
            this.log(" 🧪 RUNNING IN DRY-RUN MODE ");
            this.log("========================================");
        }
        // 1. Read the config strictly from the ROOT directory
        const configPath = path.join(process.cwd(), "shopify.theme.toml");
        if (!fs.existsSync(configPath)) {
            this.error(`shopify.theme.toml not found at root (${configPath}).`);
        }
        const configFile = fs.readFileSync(configPath, "utf-8");
        const config = toml.parse(configFile);
        const allEnvironments = Object.keys(config.environments || {});
        // 2. Match the wildcard against the root config environments
        const regexPattern = new RegExp("^" + envPattern.replace(/\*/g, ".*") + "$");
        const matchingEnvs = allEnvironments.filter((env) => regexPattern.test(env));
        if (matchingEnvs.length === 0) {
            this.error(`No environments found matching "${envPattern}" in your shopify.theme.toml`);
        }
        this.log(`\nFound ${matchingEnvs.length} matching environments...`);
        const globalTomlPath = config.path;
        // 3. Execution Logic
        if (isDryRun) {
            // --- DRY RUN LOGIC ---
            for (const env of matchingEnvs) {
                const envTomlPath = config.environments[env]?.path;
                const resolvedPath = flags.path || envTomlPath || globalTomlPath || ".";
                const pathArg = resolvedPath !== "." ? `--path ${resolvedPath}` : "";
                const command = `shopify theme push -e ${env} ${pathArg}`.trim();
                this.log(`\n[DRY RUN] Would push to: ${env}`);
                this.log(`[DRY RUN] Path resolved to: ${resolvedPath}`);
                this.log(`[DRY RUN] Command: ${command}`);
            }
            this.log("\n🧪 Dry run completed. No files were modified.");
        }
        else if (isAsync) {
            // --- ASYNC (CONCURRENT) LOGIC ---
            this.log(`\n🚀 Starting CONCURRENT pushes to ${matchingEnvs.length} environments...`);
            this.log(`(Native progress bars are hidden in async mode to prevent terminal UI glitches. Please wait...)`);
            const pushPromises = matchingEnvs.map(async (env) => {
                const envTomlPath = config.environments[env]?.path;
                const resolvedPath = flags.path || envTomlPath || globalTomlPath || ".";
                const pathArg = resolvedPath !== "." ? `--path ${resolvedPath}` : "";
                const command = `shopify theme push -e ${env} ${pathArg}`.trim();
                try {
                    // No stdio: 'inherit' here, so it runs silently in the background
                    await execAsync(command);
                    this.log(`✅ [${env}] Successfully pushed!`);
                }
                catch (error) {
                    this.warn(`❌ [${env}] Failed to push.`);
                }
            });
            // Wait for all promises to resolve at the same time
            await Promise.all(pushPromises);
            this.log("\n🎉 All concurrent pushes completed!");
        }
        else {
            // --- SYNC (SEQUENTIAL) LOGIC ---
            for (const env of matchingEnvs) {
                const envTomlPath = config.environments[env]?.path;
                const resolvedPath = flags.path || envTomlPath || globalTomlPath || ".";
                const pathArg = resolvedPath !== "." ? `--path ${resolvedPath}` : "";
                const command = `shopify theme push -e ${env} ${pathArg}`.trim();
                this.log(`\n========================================`);
                this.log(`🚀 Pushing to environment: ${env}`);
                this.log(`========================================\n`);
                try {
                    // Uses stdio: 'inherit' to show standard Shopify progress bars
                    (0, child_process_1.execSync)(command, { stdio: "inherit" });
                    this.log(`\n✅ Successfully pushed to ${env}`);
                }
                catch (error) {
                    this.warn(`\n❌ Failed to push to ${env}. Moving to the next environment...`);
                }
            }
            this.log("\n🎉 All sequential pushes completed!");
        }
    }
}
exports.default = ThemeMultiPush;
