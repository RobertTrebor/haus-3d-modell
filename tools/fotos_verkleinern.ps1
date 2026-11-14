# Legt von den benannten Fotos in fotos\ verkleinerte Kopien in fotos-klein\ an (gleiche Unterordner, lange Kante 1600 px).
# Dateien, deren Name mit PXL beginnt, werden übersprungen: Robert benennt ein Foto um, sobald es verwendet werden soll.
# Vorhandene, aktuelle Kopien bleiben unberührt. Die Originale werden nie verändert. Beide Ordner stehen in .gitignore.
# Aufruf im Projektordner:  powershell -ExecutionPolicy Bypass -File tools\fotos_verkleinern.ps1
param([int]$Kante = 1600, [int]$Qualitaet = 82)
Add-Type -AssemblyName System.Drawing
$wurzel = Split-Path -Parent $PSScriptRoot
$quelle = Join-Path $wurzel 'fotos'
$ziel = Join-Path $wurzel 'fotos-klein'
$jpeg = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$par = New-Object System.Drawing.Imaging.EncoderParameters 1
$par.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, [long]$Qualitaet)
$neu = 0; $alt = 0
Get-ChildItem -Path $quelle -Recurse -File | Where-Object { $_.Name -notlike 'PXL*' -and $_.Extension -match '^\.(jpe?g|png)$' } | ForEach-Object {
  $rel = $_.FullName.Substring($quelle.Length + 1)
  $aus = Join-Path $ziel ([System.IO.Path]::ChangeExtension($rel, '.jpg'))
  if ((Test-Path -LiteralPath $aus) -and ((Get-Item -LiteralPath $aus).LastWriteTime -ge $_.LastWriteTime)) { $alt++; return }
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $aus) | Out-Null
  $bild = [System.Drawing.Image]::FromFile($_.FullName)
  try {
    # Hochkant-Fotos: Drehung aus den Aufnahmedaten (EXIF 0x0112) anwenden, sonst liegen sie quer
    if ($bild.PropertyIdList -contains 0x0112) {
      switch ([int]$bild.GetPropertyItem(0x0112).Value[0]) {
        3 { $bild.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipNone) }
        6 { $bild.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone) }
        8 { $bild.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipNone) }
      }
    }
    $f = [Math]::Min(1.0, $Kante / [Math]::Max($bild.Width, $bild.Height))
    $b = [int][Math]::Round($bild.Width * $f); $h = [int][Math]::Round($bild.Height * $f)
    $klein = New-Object System.Drawing.Bitmap $b, $h
    $g = [System.Drawing.Graphics]::FromImage($klein)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($bild, 0, 0, $b, $h); $g.Dispose()
    $klein.Save($aus, $jpeg, $par); $klein.Dispose()
    $neu++
    Write-Output ("{0}  {1}x{2}  {3:N0} KB" -f $rel, $b, $h, ((Get-Item -LiteralPath $aus).Length / 1KB))
  } finally { $bild.Dispose() }
}
Write-Output "Neu verkleinert: $neu, schon vorhanden: $alt"
