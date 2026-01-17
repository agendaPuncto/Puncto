# Stripe CLI Installation Script for Windows
# This script downloads and installs Stripe CLI automatically

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Stripe CLI Installation Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$installPath = "$env:USERPROFILE\stripe-cli"
# Get latest release download URL
$latestReleaseUrl = "https://api.github.com/repos/stripe/stripe-cli/releases/latest"
$tempZip = "$env:TEMP\stripe-cli.zip"

Write-Host "Installation directory: $installPath" -ForegroundColor Yellow
Write-Host ""

# Step 1: Create installation directory
Write-Host "[1/4] Creating installation directory..." -ForegroundColor Green
if (Test-Path $installPath) {
    Write-Host "  Directory already exists. Removing old installation..." -ForegroundColor Yellow
    Remove-Item -Path $installPath -Recurse -Force
}
New-Item -ItemType Directory -Path $installPath -Force | Out-Null
Write-Host "  [OK] Directory created" -ForegroundColor Green
Write-Host ""

# Step 2: Download Stripe CLI
Write-Host "[2/4] Downloading Stripe CLI from GitHub..." -ForegroundColor Green
try {
    Write-Host "  Getting latest release information..." -ForegroundColor Gray
    $releaseInfo = Invoke-RestMethod -Uri $latestReleaseUrl -UseBasicParsing
    $downloadUrl = ($releaseInfo.assets | Where-Object { $_.name -like "stripe_*_windows_x86_64.zip" }).browser_download_url
    
    if (-not $downloadUrl) {
        throw "Could not find Windows x86_64 download URL in latest release"
    }
    
    Write-Host "  Downloading from: $downloadUrl" -ForegroundColor Gray
    Invoke-WebRequest -Uri $downloadUrl -OutFile $tempZip -UseBasicParsing
    Write-Host "  [OK] Download completed" -ForegroundColor Green
} catch {
    Write-Host "  [ERROR] Error downloading: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 3: Extract ZIP file
Write-Host "[3/4] Extracting Stripe CLI..." -ForegroundColor Green
try {
    Expand-Archive -Path $tempZip -DestinationPath $installPath -Force
    Write-Host "  [OK] Extraction completed" -ForegroundColor Green
} catch {
    Write-Host "  [ERROR] Error extracting: $_" -ForegroundColor Red
    Remove-Item -Path $tempZip -Force -ErrorAction SilentlyContinue
    exit 1
}
Write-Host ""

# Clean up ZIP file
Remove-Item -Path $tempZip -Force -ErrorAction SilentlyContinue

# Step 4: Verify installation
Write-Host "[4/4] Verifying installation..." -ForegroundColor Green
$stripeExe = Join-Path $installPath "stripe.exe"
if (Test-Path $stripeExe) {
    Write-Host "  [OK] Stripe CLI found at: $stripeExe" -ForegroundColor Green
    
    # Test version
    try {
        $version = & $stripeExe --version 2>&1
        Write-Host "  [OK] Version: $version" -ForegroundColor Green
    } catch {
        Write-Host "  [WARNING] Could not verify version (may need PATH configuration)" -ForegroundColor Yellow
    }
} else {
    Write-Host "  [ERROR] Stripe CLI not found after extraction!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 5: Add to PATH (User PATH)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PATH Configuration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")

if ($currentPath -notlike "*$installPath*") {
    Write-Host "Adding Stripe CLI to your user PATH..." -ForegroundColor Yellow
    try {
        $newPath = $currentPath + ";$installPath"
        [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
        Write-Host "  [OK] Added to user PATH" -ForegroundColor Green
        Write-Host ""
        Write-Host "[IMPORTANT] Please close and reopen your terminal for PATH changes to take effect!" -ForegroundColor Yellow
    } catch {
        Write-Host "  [ERROR] Error adding to PATH: $_" -ForegroundColor Red
        Write-Host "  You can manually add this path later: $installPath" -ForegroundColor Yellow
    }
} else {
    Write-Host "  [OK] Stripe CLI is already in your PATH" -ForegroundColor Green
}
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installation Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Stripe CLI is installed at: $stripeExe" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Close and reopen your terminal (for PATH to update)" -ForegroundColor White
Write-Host "  2. Run: stripe login" -ForegroundColor White
Write-Host "  3. Run: stripe listen --forward-to localhost:3000/api/payments/webhook" -ForegroundColor White
Write-Host ""
Write-Host "If PATH didn't update automatically, you can use the full path:" -ForegroundColor Yellow
Write-Host "  $stripeExe login" -ForegroundColor Gray
Write-Host ""

# Test if stripe is available (might not work until terminal is reopened)
Write-Host "Testing if 'stripe' command is available..." -ForegroundColor Cyan
$env:Path = [Environment]::GetEnvironmentVariable("Path", "User") + ";" + [Environment]::GetEnvironmentVariable("Path", "Machine")
$stripeInPath = Get-Command stripe -ErrorAction SilentlyContinue

if ($stripeInPath) {
    Write-Host "  [OK] 'stripe' command is available!" -ForegroundColor Green
    Write-Host "  You can now run: stripe --version" -ForegroundColor White
} else {
    Write-Host "  [WARNING] 'stripe' command not yet available" -ForegroundColor Yellow
    Write-Host "  Please close and reopen your terminal, then run: stripe --version" -ForegroundColor Yellow
}
Write-Host ""
