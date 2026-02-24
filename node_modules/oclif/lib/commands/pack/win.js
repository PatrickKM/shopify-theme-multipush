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
const fs_extra_1 = require("fs-extra");
const node_child_process_1 = require("node:child_process");
const node_fs_1 = require("node:fs");
const promises_1 = require("node:fs/promises");
const node_path_1 = __importDefault(require("node:path"));
const node_util_1 = require("node:util");
const Tarballs = __importStar(require("../../tarballs"));
const upload_util_1 = require("../../upload-util");
const exec = (0, node_util_1.promisify)(node_child_process_1.exec);
const scripts = {
    /* eslint-disable no-useless-escape */
    cmd: (config, additionalCLI, nodeOptions) => `@echo off
setlocal enableextensions

set ${additionalCLI ? `${additionalCLI.toUpperCase()}_BINPATH` : config.scopedEnvVarKey('BINPATH')}=%~dp0\\${additionalCLI ?? config.bin}.cmd
if exist "%LOCALAPPDATA%\\${config.dirname}\\client\\bin\\${additionalCLI ?? config.bin}.cmd" (
  "%LOCALAPPDATA%\\${config.dirname}\\client\\bin\\${additionalCLI ?? config.bin}.cmd" %*
) else (
  "%~dp0\\..\\client\\bin\\node.exe" ${`${nodeOptions?.join(' ')} `}"%~dp0\\..\\client\\${additionalCLI ? `${additionalCLI}\\bin\\run` : String.raw `bin\run`}" %*
)
`,
    nsis: ({ arch, config, customization, defenderOptional, hideDefenderOption, }) => `!include MUI2.nsh

!define Version '${config.version.split('-')[0]}'
Name "${config.name}"
CRCCheck On
InstallDirRegKey HKCU "Software\\${config.name}" ""

!insertmacro MUI_PAGE_COMPONENTS
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

!insertmacro MUI_LANGUAGE "English"

OutFile "installer.exe"
VIProductVersion "\${VERSION}.0"
VIAddVersionKey /LANG=\${LANG_ENGLISH} "ProductName" "${config.name}"
VIAddVersionKey /LANG=\${LANG_ENGLISH} "Comments" "${config.pjson.homepage}"
VIAddVersionKey /LANG=\${LANG_ENGLISH} "CompanyName" "${config.scopedEnvVar('AUTHOR') || config.pjson.author}"
VIAddVersionKey /LANG=\${LANG_ENGLISH} "LegalCopyright" "${new Date().getFullYear()}"
VIAddVersionKey /LANG=\${LANG_ENGLISH} "FileDescription" "${config.pjson.description}"
VIAddVersionKey /LANG=\${LANG_ENGLISH} "FileVersion" "\${VERSION}.0"
VIAddVersionKey /LANG=\${LANG_ENGLISH} "ProductVersion" "\${VERSION}.0"

InstallDir "\$PROGRAMFILES${arch === 'x64' ? '64' : ''}\\${config.dirname}"

${customization}

Section "${config.name} CLI \${VERSION}"
  SetOutPath $INSTDIR
  File /r bin
  File /r client

  ; Use explicit System32/Sysnative path to cmd.exe for security
  StrCpy $0 "$WINDIR\\System32\\cmd.exe"  ; Try System32 first
  IfFileExists "$0" path_is_safe
    StrCpy $0 "$WINDIR\\Sysnative\\cmd.exe"  ; Try Sysnative for WOW64
    IfFileExists "$0" path_is_safe
      MessageBox MB_OK|MB_ICONSTOP "Error: Could not find system cmd.exe. Installation cannot continue."
      Abort
      
  path_is_safe:

  WriteRegStr HKCU "Software\\${config.dirname}" "" $INSTDIR
  WriteUninstaller "$INSTDIR\\Uninstall.exe"
  WriteRegStr HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\${config.dirname}" \\
                   "DisplayName" "${config.name}"
  WriteRegStr HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\${config.dirname}" \\
                   "DisplayVersion" "\${VERSION}"
  WriteRegStr HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\${config.dirname}" \\
                   "UninstallString" "$\\"$INSTDIR\\uninstall.exe$\\""
  WriteRegStr HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\${config.dirname}" \\
                   "Publisher" "${config.scopedEnvVar('AUTHOR') || config.pjson.author}"
SectionEnd

Section "Set PATH to ${config.name}"
  Push "$INSTDIR\\bin"
  Call AddToPath
SectionEnd

Section ${defenderOptional ? '/o ' : ''}"${hideDefenderOption ? '-' : ''}Add %LOCALAPPDATA%\\${config.dirname} to Windows Defender exclusions (highly recommended for performance!)"
  ExecWait '"$0" /C powershell -ExecutionPolicy Bypass -Command "$\\"& {Add-MpPreference -ExclusionPath $\\"$LOCALAPPDATA\\${config.dirname}$\\"}$\\"" -FFFeatureOff SW_HIDE'
SectionEnd

Section "Uninstall"
  Delete "$INSTDIR\\Uninstall.exe"
  RMDir /r "$INSTDIR"
  RMDir /r "$LOCALAPPDATA\\${config.dirname}"
  DeleteRegKey /ifempty HKCU "Software\\${config.dirname}"
  DeleteRegKey HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\${config.dirname}"
SectionEnd

!define Environ 'HKCU "Environment"'
Function AddToPath
  Exch $0
  Push $1
  Push $2
  Push $3
  Push $4

  ; NSIS ReadRegStr returns empty string on string overflow
  ; Native calls are used here to check actual length of PATH

  ; $4 = RegOpenKey(HKEY_CURRENT_USER, "Environment", &$3)
  System::Call "advapi32::RegOpenKey(i 0x80000001, t'Environment', *i.r3) i.r4"
  IntCmp $4 0 0 done done
  ; $4 = RegQueryValueEx($3, "PATH", (DWORD*)0, (DWORD*)0, &$1, ($2=NSIS_MAX_STRLEN, &$2))
  ; RegCloseKey($3)
  System::Call "advapi32::RegQueryValueEx(i $3, t'PATH', i 0, i 0, t.r1, *i \${NSIS_MAX_STRLEN} r2) i.r4"
  System::Call "advapi32::RegCloseKey(i $3)"

  IntCmp $4 234 0 +4 +4 ; $4 == ERROR_MORE_DATA
    DetailPrint "AddToPath: original length $2 > \${NSIS_MAX_STRLEN}"
    MessageBox MB_OK "PATH not updated, original length $2 > \${NSIS_MAX_STRLEN}"
    Goto done

  IntCmp $4 0 +5 ; $4 != NO_ERROR
    IntCmp $4 2 +3 ; $4 != ERROR_FILE_NOT_FOUND
      DetailPrint "AddToPath: unexpected error code $4"
      Goto done
    StrCpy $1 ""

  ; Check if already in PATH
  Push "$1;"
  Push "$0;"
  Call StrStr
  Pop $2
  StrCmp $2 "" 0 done
  Push "$1;"
  Push "$0\\;"
  Call StrStr
  Pop $2
  StrCmp $2 "" 0 done

  ; Prevent NSIS string overflow
  StrLen $2 $0
  StrLen $3 $1
  IntOp $2 $2 + $3
  IntOp $2 $2 + 2 ; $2 = strlen(dir) + strlen(PATH) + sizeof(";")
  IntCmp $2 \${NSIS_MAX_STRLEN} +4 +4 0
    DetailPrint "AddToPath: new length $2 > \${NSIS_MAX_STRLEN}"
    MessageBox MB_OK "PATH not updated, new length $2 > \${NSIS_MAX_STRLEN}."
    Goto done

  ; Append dir to PATH
  DetailPrint "Add to PATH: $0"
  StrCpy $2 $1 1 -1
  StrCmp $2 ";" 0 +2
    StrCpy $1 $1 -1 ; remove trailing ';'
  StrCmp $1 "" +2   ; no leading ';'
    StrCpy $0 "$1;$0"
  WriteRegExpandStr \${Environ} "PATH" $0
  SendMessage \${HWND_BROADCAST} \${WM_WININICHANGE} 0 "STR:Environment" /TIMEOUT=5000

done:
  Pop $4
  Pop $3
  Pop $2
  Pop $1
  Pop $0
FunctionEnd

; StrStr - find substring in a string
;
; Usage:
;   Push "this is some string"
;   Push "some"
;   Call StrStr
;   Pop $0 ; "some string"

Function StrStr
  Exch $R1 ; $R1=substring, stack=[old$R1,string,...]
  Exch     ;                stack=[string,old$R1,...]
  Exch $R2 ; $R2=string,    stack=[old$R2,old$R1,...]
  Push $R3
  Push $R4
  Push $R5
  StrLen $R3 $R1
  StrCpy $R4 0
  ; $R1=substring, $R2=string, $R3=strlen(substring)
  ; $R4=count, $R5=tmp
  loop:
    StrCpy $R5 $R2 $R3 $R4
    StrCmp $R5 $R1 done
    StrCmp $R5 "" done
    IntOp $R4 $R4 + 1
    Goto loop
done:
  StrCpy $R1 $R2 "" $R4
  Pop $R5
  Pop $R4
  Pop $R3
  Pop $R2
  Exch $R1 ; $R1=old$R1, stack=[result,...]
FunctionEnd
`,
    sh: (config) => `#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\\\,/,g')")

"$basedir/../client/bin/${config.bin}.cmd" "$@"
ret=$?
exit $ret
`,
    /* eslint-enable no-useless-escape */
};
class PackWin extends core_1.Command {
    static description = `You need to have 7zip, nsis (makensis), and grep installed on your machine in order to run this command.

This command will produce unsigned installers unless you supply WINDOWS_SIGNING_PASS (prefixed with the name of your executable, e.g. OCLIF_WINDOWS_SIGNING_PASS) in the environment and have set the windows.name and windows.keypath properties in your package.json's oclif property.

Add a pretarball script to your package.json if you need to run any scripts before the tarball is created.`;
    static flags = {
        'additional-cli': core_1.Flags.string({
            description: `An Oclif CLI other than the one listed in config.bin that should be made available to the user
the CLI should already exist in a directory named after the CLI that is the root of the tarball produced by "oclif pack:tarballs".`,
            hidden: true,
        }),
        'defender-exclusion': core_1.Flags.option({
            options: ['checked', 'unchecked', 'hidden'],
        })({
            default: 'checked',
            description: 'There is no way to set a hidden checkbox with "true" as a default...the user can always allow full security',
            summary: `Set to "checked" or "unchecked" to set the default value for the checkbox.  Set to "hidden" to hide the option (will let defender do its thing).`,
        }),
        'prune-lockfiles': core_1.Flags.boolean({ description: 'remove lockfiles in the tarball.', exclusive: ['tarball'] }),
        root: core_1.Flags.string({
            char: 'r',
            default: '.',
            description: 'Path to oclif CLI root.',
            required: true,
        }),
        sha: core_1.Flags.string({
            description: '7-digit short git commit SHA (defaults to current checked out commit).',
            required: false,
        }),
        tarball: core_1.Flags.string({
            char: 't',
            description: 'Optionally specify a path to a tarball already generated by NPM.',
            exclusive: ['prune-lockfiles'],
            required: false,
        }),
        targets: core_1.Flags.string({
            description: 'Comma-separated targets to pack (e.g.: win32-x64,win32-x86,win32-arm64).',
        }),
    };
    static summary = 'Create windows installer from oclif CLI';
    async run() {
        await this.checkForNSIS();
        const { flags } = await this.parse(PackWin);
        const buildConfig = await Tarballs.buildConfig(flags.root, { sha: flags?.sha, targets: flags?.targets?.split(',') });
        const { config } = buildConfig;
        const nsisCustomization = config.nsisCustomization ? (0, node_fs_1.readFileSync)(config.nsisCustomization, 'utf8') : '';
        const arches = buildConfig.targets.filter((t) => t.platform === 'win32').map((t) => t.arch);
        await Tarballs.build(buildConfig, {
            pack: false,
            parallel: true,
            platform: 'win32',
            pruneLockfiles: flags['prune-lockfiles'],
            tarball: flags.tarball,
        });
        await Promise.all(arches.map(async (arch) => {
            const installerBase = node_path_1.default.join(buildConfig.tmp, `windows-${arch}-installer`);
            await (0, promises_1.rm)(installerBase, { force: true, recursive: true });
            await (0, promises_1.mkdir)(node_path_1.default.join(installerBase, 'bin'), { recursive: true });
            await Promise.all([
                (0, promises_1.writeFile)(node_path_1.default.join(installerBase, 'bin', `${config.bin}.cmd`), scripts.cmd(config, undefined, buildConfig.nodeOptions)),
                (0, promises_1.writeFile)(node_path_1.default.join(installerBase, 'bin', `${config.bin}`), scripts.sh(config)),
                (0, promises_1.writeFile)(node_path_1.default.join(installerBase, `${config.bin}.nsi`), scripts.nsis({
                    arch,
                    config,
                    customization: nsisCustomization,
                    // hiding it also unchecks it
                    defenderOptional: flags['defender-exclusion'] === 'hidden' || flags['defender-exclusion'] === 'unchecked',
                    hideDefenderOption: flags['defender-exclusion'] === 'hidden',
                })),
                ...(config.binAliases
                    ? config.binAliases.flatMap((alias) => 
                    // write duplicate files for windows aliases
                    // this avoids mklink which can require admin privileges which not everyone has
                    [
                        (0, promises_1.writeFile)(node_path_1.default.join(installerBase, 'bin', `${alias}.cmd`), scripts.cmd(config)),
                        (0, promises_1.writeFile)(node_path_1.default.join(installerBase, 'bin', `${alias}`), scripts.sh(config)),
                    ])
                    : []),
                ...(flags['additional-cli']
                    ? [
                        (0, promises_1.writeFile)(node_path_1.default.join(installerBase, 'bin', `${flags['additional-cli']}.cmd`), scripts.cmd(config, flags['additional-cli'])),
                        (0, promises_1.writeFile)(node_path_1.default.join(installerBase, 'bin', `${flags['additional-cli']}`), scripts.sh({ bin: flags['additional-cli'] })),
                    ]
                    : []),
            ]);
            await (0, fs_extra_1.move)(buildConfig.workspace({ arch, platform: 'win32' }), node_path_1.default.join(installerBase, 'client'));
            await exec(`makensis "${installerBase}/${config.bin}.nsi" | grep -v "\\[compress\\]" | grep -v "^File: Descending to"`);
            const templateKey = (0, upload_util_1.templateShortKey)('win32', {
                arch,
                bin: config.bin,
                sha: buildConfig.gitSha,
                version: config.version,
            });
            const o = buildConfig.dist(`win32/${templateKey}`);
            await (0, fs_extra_1.move)(node_path_1.default.join(installerBase, 'installer.exe'), o);
            const { windows } = config.pjson.oclif;
            if (windows && windows.name && windows.keypath) {
                await signWindows(o, arch, config, windows);
            }
            else
                this.debug('Skipping windows exe signing');
            this.log(`built ${o}`);
        }));
    }
    async checkForNSIS() {
        try {
            await exec('makensis');
        }
        catch (error) {
            const { code } = error;
            if (code === 1)
                return;
            if (code === 127)
                this.error('install makensis');
            else
                throw error;
        }
    }
}
exports.default = PackWin;
async function signWindows(o, arch, config, windows) {
    if (!windows) {
        throw new Error('windows not set in oclif configuration');
    }
    const buildLocationUnsigned = o.replace(`${arch}.exe`, `${arch}-unsigned.exe`);
    await (0, fs_extra_1.move)(o, buildLocationUnsigned);
    const pass = config.scopedEnvVar('WINDOWS_SIGNING_PASS');
    if (!pass) {
        throw new Error(`${config.scopedEnvVarKey('WINDOWS_SIGNING_PASS')} not set in the environment`);
    }
    const args = [
        '-pkcs12',
        windows.keypath,
        '-pass',
        `"${pass}"`,
        '-n',
        `"${windows.name}"`,
        '-i',
        windows.homepage || config.pjson.homepage,
        '-t',
        'http://timestamp.digicert.com',
        '-h',
        'sha512',
        '-in',
        buildLocationUnsigned,
        '-out',
        o,
    ];
    await exec(`osslsigncode sign ${args.join(' ')}`);
}
