param(
    [switch]$RemoveLocalGit,
    [switch]$ForcePush
)
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "Git is not installed or not in PATH. Install from https://git-scm.com/download/win"
    exit 1
}
$repoUrl = 'https://github.com/SayanBanerjee100/PhishingDetector.git'
if (Test-Path .git) {
    if ($RemoveLocalGit) {
        Remove-Item -Recurse -Force .git
        Write-Host ".git removed."
    } else {
        Write-Host "Local .git exists. Re-run with -RemoveLocalGit to remove and continue."
        exit 1
    }
}
git init
git add -A
{ git commit -m "Initial commit" } 2>$null || Write-Host "Nothing to commit or commit failed."
git branch -M main
git remote add origin $repoUrl 2>$null || git remote set-url origin $repoUrl
if ($ForcePush) {
    git push -u origin main --force
} else {
    git push -u origin main
}
