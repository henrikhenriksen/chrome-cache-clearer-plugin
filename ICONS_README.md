# Extension Icons - Safepoint Branding

## Icon Files

This directory contains:
- **icon.svg** - Master SVG file with Safepoint branding (purple checkmark logo)
- **icon16.png** - 16×16px icon (for browser toolbar)
- **icon48.png** - 48×48px icon (for extension management page)
- **icon128.png** - 128×128px icon (for Chrome Web Store)

## Updating Icons

To update the PNG icons from the SVG source:

### Using Inkscape (Command Line)
```bash
# 16x16
inkscape icon.svg --export-filename=icon16.png --export-width=16 --export-height=16

# 48x48
inkscape icon.svg --export-filename=icon48.png --export-width=48 --export-height=48

# 128x128
inkscape icon.svg --export-filename=icon128.png --export-width=128 --export-height=128
```

### Using Inkscape (GUI)
1. Open `icon.svg` in Inkscape
2. File → Export PNG Image
3. Set width/height to 16, 48, or 128 pixels
4. Export as `icon16.png`, `icon48.png`, or `icon128.png`

### Using Online Converter
1. Visit https://svgtopng.com/ or similar
2. Upload `icon.svg`
3. Set dimensions to 16×16, 48×48, or 128×128
4. Download and rename appropriately

### Using ImageMagick
```bash
# 16x16
convert -background none icon.svg -resize 16x16 icon16.png

# 48x48
convert -background none icon.svg -resize 48x48 icon48.png

# 128x128
convert -background none icon.svg -resize 128x128 icon128.png
```

## Design Notes

The icon features:
- **Purple gradient background** (#7c6b9e → #9987b8) matching Safepoint brand
- **White inner circle** for contrast
- **Purple checkmark** symbolizing "Protected. Always"
- **Clean, modern design** suitable for light and dark browser themes

## Color Palette

Primary colors from Safepoint branding:
- Dark Purple: `#362652`
- Medium Purple: `#7c6b9e`
- Light Purple: `#9987b8`
- Accent Purple: `#a89ec0`
