# One-line installer for TechDemoDirector
# Usage: irm https://barretts.github.io/TechDemoDirector/install.ps1 | iex
# Or with flags: & ([scriptblock]::Create((irm https://barretts.github.io/TechDemoDirector/install.ps1))) -All

$ErrorActionPreference = "Stop"

$repo = "https://github.com/barretts/TechDemoDirector.git"
$tmpDir = Join-Path ([System.IO.Path]::GetTempPath()) "TechDemoDirector-$(Get-Random)"

Write-Host "==> TechDemoDirector one-line installer"
Write-Host "    Cloning to temporary directory..."
Write-Host ""

try {
    & git clone --depth 1 $repo $tmpDir 2>&1 | Select-Object -Last 1
    Push-Location $tmpDir
    & .\install.ps1 @args
} finally {
    Pop-Location -ErrorAction SilentlyContinue
    if (Test-Path $tmpDir) {
        Remove-Item -Recurse -Force $tmpDir
    }
}
