# Script to backup 'data' directory
$date = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupDir = "backups"
$sourceDir = "data"
$zipName = "$backupDir\backup_$date.zip"

# Create backups directory if not exists
if (!(Test-Path -Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
    Write-Host "Created backups directory." -ForegroundColor Cyan
}

# Check if data directory exists
if (Test-Path -Path $sourceDir) {
    Write-Host "Backing up '$sourceDir' to '$zipName'..." -ForegroundColor Yellow
    
    # Compress data folder to zip
    Compress-Archive -Path $sourceDir -DestinationPath $zipName
    
    Write-Host "✅ Backup successful: $zipName" -ForegroundColor Green
} else {
    Write-Host "❌ Error: '$sourceDir' directory not found!" -ForegroundColor Red
}
