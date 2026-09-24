$wmp = New-Object -ComObject wmplayer.ocx
$path = (Resolve-Path 'www/assets/audio/biome_1.mp3').Path
Write-Host "Playing sample: $path"
$wmp.URL = $path
$wmp.controls.play()
Start-Sleep -Seconds 6
$wmp.controls.stop()
Write-Host "Sample playback finished."
