#Requires -Version 5.1
<#
.SYNOPSIS
    Set up skills and companion CLI for AI coding tools (Windows).
.DESCRIPTION
    PowerShell equivalent of install.sh. Builds the CLI, compiles skills, and
    copies compiled output to IDE-specific directories.
.EXAMPLE
    .\install.ps1                # Auto-detect installed tools
    .\install.ps1 -All           # Install for all five tools
    .\install.ps1 -Claude -Cursor
    .\install.ps1 -Uninstall
#>
[CmdletBinding()]
param(
    [switch]$Claude,
    [switch]$Cursor,
    [switch]$Windsurf,
    [switch]$OpenCode,
    [switch]$Codex,
    [switch]$All,
    [switch]$SkillsOnly,
    [switch]$Uninstall,
    [switch]$CompileOnly
)

$ErrorActionPreference = "Stop"

# ===========================================================================
# CONFIGURE: Change these values for your project
# ===========================================================================

$ProjectName    = "tech-demo-director"
$CliBinName     = "demo-director"
$ManagedMarker  = "managed_by: tech-demo-director"
$Skills         = @("tech-demo-director")

# ===========================================================================
# End configuration
# ===========================================================================

$SkillDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# --- Target directories ---
$Home_ = $env:USERPROFILE
$ClaudeSkillsDir   = Join-Path $Home_ ".claude/skills"
$CursorRulesDir    = Join-Path $Home_ ".cursor/rules"
$CursorSkillsDir   = Join-Path $Home_ ".cursor/skills"
$WindsurfRulesDir  = Join-Path $Home_ ".windsurf/rules"
$WindsurfSkillsDir = Join-Path $Home_ ".codeium/windsurf/skills"
$OpenCodeAgentsDir = Join-Path $Home_ ".config/opencode/agents"
$CodexHomeDir      = if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $Home_ ".codex" }
$CodexSkillsDir    = Join-Path $CodexHomeDir "skills"
$CompiledDir       = Join-Path $SkillDir "compiled"

# --- Stale file cleanup (marker-based) ---

function Remove-ManagedFiles {
    param([string]$Dir)
    if (-not (Test-Path $Dir)) { return }
    Get-ChildItem -Path $Dir -Recurse -File | ForEach-Object {
        $content = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue
        if ($content -and $content.Contains($ManagedMarker)) {
            Remove-Item $_.FullName -Force
            $parent = Split-Path $_.FullName -Parent
            if ($parent -ne $Dir -and (Get-ChildItem $parent -ErrorAction SilentlyContinue).Count -eq 0) {
                Remove-Item $parent -Force -ErrorAction SilentlyContinue
            }
            Write-Host "    Removed: $($_.FullName)"
        }
    }
}

# --- Install functions (copy from compiled/ output) ---

function Install-Claude {
    param([string]$SkillName)
    $src = Join-Path $CompiledDir "claude/$SkillName/SKILL.md"
    $destDir = Join-Path $ClaudeSkillsDir $SkillName
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
    Copy-Item $src (Join-Path $destDir "SKILL.md") -Force
    Write-Host "    Claude:   $(Join-Path $destDir 'SKILL.md')"
}

function Install-Cursor {
    param([string]$SkillName)
    $src1 = Join-Path $CompiledDir "cursor/rules/$SkillName.mdc"
    New-Item -ItemType Directory -Path $CursorRulesDir -Force | Out-Null
    Copy-Item $src1 (Join-Path $CursorRulesDir "$SkillName.mdc") -Force
    Write-Host "    Cursor (rule):  $(Join-Path $CursorRulesDir "$SkillName.mdc")"

    $src2 = Join-Path $CompiledDir "cursor/skills/$SkillName/SKILL.md"
    $destDir = Join-Path $CursorSkillsDir $SkillName
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
    Copy-Item $src2 (Join-Path $destDir "SKILL.md") -Force
    Write-Host "    Cursor (skill): $(Join-Path $destDir 'SKILL.md')"
}

function Install-Windsurf_ {
    param([string]$SkillName)
    $src1 = Join-Path $CompiledDir "windsurf/rules/$SkillName.md"
    New-Item -ItemType Directory -Path $WindsurfRulesDir -Force | Out-Null
    Copy-Item $src1 (Join-Path $WindsurfRulesDir "$SkillName.md") -Force
    Write-Host "    Windsurf (rule):  $(Join-Path $WindsurfRulesDir "$SkillName.md")"

    $src2 = Join-Path $CompiledDir "windsurf/skills/$SkillName/SKILL.md"
    $destDir = Join-Path $WindsurfSkillsDir $SkillName
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
    Copy-Item $src2 (Join-Path $destDir "SKILL.md") -Force
    Write-Host "    Windsurf (skill): $(Join-Path $destDir 'SKILL.md')"
}

function Install-OpenCode_ {
    param([string]$SkillName)
    $src = Join-Path $CompiledDir "opencode/$SkillName.md"
    New-Item -ItemType Directory -Path $OpenCodeAgentsDir -Force | Out-Null
    Copy-Item $src (Join-Path $OpenCodeAgentsDir "$SkillName.md") -Force
    Write-Host "    OpenCode: $(Join-Path $OpenCodeAgentsDir "$SkillName.md")"
}

function Install-Codex_ {
    param([string]$SkillName)
    $src = Join-Path $CompiledDir "codex/$SkillName/SKILL.md"
    $destDir = Join-Path $CodexSkillsDir $SkillName
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
    Copy-Item $src (Join-Path $destDir "SKILL.md") -Force
    Write-Host "    Codex:    $(Join-Path $destDir 'SKILL.md')"
}

# --- Uninstall ---

function Uninstall-Claude   { foreach ($s in $Skills) { Remove-Item (Join-Path $ClaudeSkillsDir $s) -Recurse -Force -ErrorAction SilentlyContinue }; Write-Host "    Claude:   removed" }
function Uninstall-Cursor   { foreach ($s in $Skills) { Remove-Item (Join-Path $CursorRulesDir "$s.mdc") -Force -ErrorAction SilentlyContinue; Remove-Item (Join-Path $CursorSkillsDir $s) -Recurse -Force -ErrorAction SilentlyContinue }; Write-Host "    Cursor:   removed" }
function Uninstall-Windsurf { foreach ($s in $Skills) { Remove-Item (Join-Path $WindsurfRulesDir "$s.md") -Force -ErrorAction SilentlyContinue; Remove-Item (Join-Path $WindsurfSkillsDir $s) -Recurse -Force -ErrorAction SilentlyContinue }; Write-Host "    Windsurf: removed" }
function Uninstall-OpenCode { foreach ($s in $Skills) { Remove-Item (Join-Path $OpenCodeAgentsDir "$s.md") -Force -ErrorAction SilentlyContinue }; Write-Host "    OpenCode: removed" }
function Uninstall-Codex    { foreach ($s in $Skills) { Remove-Item (Join-Path $CodexSkillsDir $s) -Recurse -Force -ErrorAction SilentlyContinue }; Write-Host "    Codex:    removed" }

# --- Auto-detection ---

function Get-DetectedEditors {
    $detected = @()
    if (Test-Path (Join-Path $Home_ ".claude"))                          { $detected += "claude" }
    if (Test-Path (Join-Path $Home_ ".cursor"))                          { $detected += "cursor" }
    if ((Test-Path (Join-Path $Home_ ".windsurf")) -or
        (Test-Path (Join-Path $Home_ ".codeium/windsurf")))              { $detected += "windsurf" }
    if ((Test-Path (Join-Path $Home_ ".config/opencode")) -or
        (Test-Path (Join-Path $Home_ ".opencode")))                      { $detected += "opencode" }
    if ($env:CODEX_HOME -or (Test-Path $CodexHomeDir))                   { $detected += "codex" }
    return $detected
}

# --- Resolve targets ---

$Targets = @()
if ($All)      { $Targets = @("claude", "cursor", "windsurf", "opencode", "codex") }
if ($Claude)   { $Targets += "claude" }
if ($Cursor)   { $Targets += "cursor" }
if ($Windsurf) { $Targets += "windsurf" }
if ($OpenCode) { $Targets += "opencode" }
if ($Codex)    { $Targets += "codex" }

# --- Compile-only path ---

if ($CompileOnly) {
    Write-Host "==> Delegating to compile.mjs..."
    & node (Join-Path $SkillDir "skill/build/compile.mjs")
    exit $LASTEXITCODE
}

# Auto-detect if no targets specified
if ($Targets.Count -eq 0) {
    $Targets = Get-DetectedEditors
}

if ($Targets.Count -eq 0) {
    Write-Host "ERROR: No supported tools detected. Use -Claude, -Cursor, -Windsurf, -OpenCode, or -Codex." -ForegroundColor Red
    exit 1
}

# --- Uninstall path ---

if ($Uninstall) {
    Write-Host "==> Uninstalling $ProjectName"
    Write-Host "    Targets: $($Targets -join ' ')"
    Write-Host ""
    foreach ($target in $Targets) {
        & "Uninstall-$($target.Substring(0,1).ToUpper() + $target.Substring(1) -replace 'code','Code')"
    }
    Write-Host "--> Removing $CliBinName CLI..."
    npm unlink $ProjectName 2>$null
    Write-Host ""
    Write-Host "==> Done. Skills and CLI removed."
    exit 0
}

# --- Install path ---

Write-Host "==> $ProjectName setup"
Write-Host "    Project: $SkillDir"
Write-Host "    Targets: $($Targets -join ' ')"
Write-Host ""

if (-not $SkillsOnly) {
    Write-Host "--> Installing dependencies..."
    Push-Location $SkillDir
    try {
        & npm install
        if ($LASTEXITCODE -ne 0) { throw "npm install failed" }

        Write-Host "--> Cleaning previous build..."
        if (Test-Path (Join-Path $SkillDir "dist")) {
            Remove-Item (Join-Path $SkillDir "dist") -Recurse -Force
        }

        Write-Host "--> Building TypeScript..."
        & npm run build
        if ($LASTEXITCODE -ne 0) { throw "npm run build failed" }

        Write-Host "--> Compiling skills..."
        & npm run compile
        if ($LASTEXITCODE -ne 0) { throw "npm run compile failed" }

        Write-Host "--> Installing $CliBinName CLI globally..."
        & npm link
        if ($LASTEXITCODE -ne 0) { throw "npm link failed" }

        $npmBin = & npm prefix -g
        $cliPath = Join-Path $npmBin "$CliBinName.cmd"
        if (Test-Path $cliPath) {
            Write-Host "    ${CliBinName}: $cliPath"
            $ver = & $CliBinName --version 2>$null
            Write-Host "    version:  $ver"
        } else {
            $cliPath2 = Join-Path $npmBin "node_modules/.bin/$CliBinName.cmd"
            if (Test-Path $cliPath2) {
                Write-Host "    ${CliBinName}: $cliPath2"
            } else {
                Write-Host "    WARNING: $CliBinName not found after npm link." -ForegroundColor Yellow
            }
        }
    } finally {
        Pop-Location
    }
}

Write-Host "--> Cleaning stale $ProjectName files..."
foreach ($target in $Targets) {
    switch ($target) {
        "claude"   { Remove-ManagedFiles $ClaudeSkillsDir }
        "cursor"   { Remove-ManagedFiles $CursorRulesDir; Remove-ManagedFiles $CursorSkillsDir }
        "windsurf" { Remove-ManagedFiles $WindsurfRulesDir; Remove-ManagedFiles $WindsurfSkillsDir }
        "opencode" { Remove-ManagedFiles $OpenCodeAgentsDir }
        "codex"    { Remove-ManagedFiles $CodexSkillsDir }
    }
}

Write-Host "--> Installing skills..."
foreach ($skill in $Skills) {
    Write-Host "  ${skill}:"
    foreach ($target in $Targets) {
        switch ($target) {
            "claude"   { Install-Claude   $skill }
            "cursor"   { Install-Cursor   $skill }
            "windsurf" { Install-Windsurf_ $skill }
            "opencode" { Install-OpenCode_ $skill }
            "codex"    { Install-Codex_   $skill }
        }
    }
}

Write-Host ""
Write-Host "==> Done."
Write-Host ""
Write-Host "Skills installed for: $($Targets -join ' ')"
Write-Host "CLI available as: $CliBinName"
