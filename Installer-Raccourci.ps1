$ErrorActionPreference = 'Stop'
$projectRoot = $PSScriptRoot
$gameFile = Join-Path $projectRoot 'dist\index.html'
if (-not (Test-Path -LiteralPath $gameFile)) { throw 'Le dossier dist du jeu est introuvable.' }
$chromeCandidates = @(
    (Join-Path $env:ProgramFiles 'Google\Chrome\Application\chrome.exe'),
    (Join-Path ${env:ProgramFiles(x86)} 'Google\Chrome\Application\chrome.exe'),
    (Join-Path $env:LOCALAPPDATA 'Google\Chrome\Application\chrome.exe')
)
$chromeExecutable = $chromeCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if (-not $chromeExecutable) { throw 'Google Chrome est introuvable. Installez Chrome puis relancez ce script.' }
$desktopFolder = [Environment]::GetFolderPath('Desktop')
$shortcutFile = Join-Path $desktopFolder 'Jouer à Curiona - Google Chrome.lnk'
$gameUri = ([Uri]$gameFile).AbsoluteUri
$shortcutShell = New-Object -ComObject WScript.Shell
$shortcut = $shortcutShell.CreateShortcut($shortcutFile)
$shortcut.TargetPath = $chromeExecutable
$shortcut.Arguments = '--new-window "' + $gameUri + '"'
$shortcut.WorkingDirectory = Join-Path $projectRoot 'dist'
$shortcut.Description = 'Curiona - La curiosité se cultive. Jeu de quiz hors ligne.'
$shortcut.IconLocation = $chromeExecutable + ',0'
$shortcut.Save()
Write-Output ('Raccourci créé : ' + $shortcutFile)
Write-Output ('Cible : ' + $chromeExecutable + ' ' + $shortcut.Arguments)
