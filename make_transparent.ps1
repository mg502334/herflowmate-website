Add-Type -AssemblyName System.Drawing
$sourcePath = "C:\Users\Michelle\.gemini\antigravity-ide\brain\db613839-4718-4819-ae5c-b0097a4c7124\favicon_new_1780894862990.png"
$destPath = "c:\Users\Michelle\Desktop\HerFlowMate\herflowmate-websites\public\favicon.png"
$img = [System.Drawing.Bitmap]::FromFile($sourcePath)
$img.MakeTransparent([System.Drawing.Color]::White)
$img.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
$img.Dispose()
