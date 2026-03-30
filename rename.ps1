$files = @(
  "src\components\AchievementPopup.tsx",
  "src\components\EndCreditsModal.tsx",
  "src\components\FlashTaskCard.tsx",
  "src\components\NameSubmitModal.tsx",
  "src\components\PasswordGate.tsx",
  "src\components\ProfileCard.tsx",
  "src\components\StatsCardModal.tsx",
  "src\i18n\translations.ts",
  "src\App.tsx",
  "src\index.css",
  "src\main.tsx",
  "index.html",
  "tailwind.config.js",
  "package.json"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content -Path $file -Raw -Encoding UTF8

        # For specific user-facing title
        $content = $content -replace "Prada Princess Namtan Tipnaree ✨", "A Good Thing Is Coming"
        
        # Replace specific config and variable keys to `agtic`
        $content = $content -creplace "prada:", "agtic:"
        $content = $content -creplace "colors.prada", "colors.agtic"
        $content = $content -creplace "prada-", "agtic-"
        $content = $content -creplace "--prada-", "--agtic-"
        
        # Capitalized user-facing names
        $content = $content -creplace "Prada", "A Good Thing Is Coming"
        
        # Fallback lowercase for things like the background script, any residual `prada` as a word.
        $content = $content -creplace "\bprada\b", "agtic"
        
        # Specifically clean up any project name in package.json
        $content = $content -creplace '"name"\s*:\s*"a good thing is coming"', '"name": "a-good-thing-is-coming"'
        
        Set-Content -Path $file -Value $content -Encoding UTF8 -NoNewline
    } else {
        Write-Host "File not found: $file"
    }
}
Write-Host "Replacement Done."
