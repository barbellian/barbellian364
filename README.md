# BARBELLIAN 364+1 · 1RM Calculator

Mobile-first PWA project for the BARBELLIAN 1RM calculator.

## Files
- `index.html`: complete app interface and client-side calculator
- `manifest.webmanifest`: installable PWA metadata
- `sw.js`: offline cache / service worker
- `icon-192.png`, `icon-512.png`: app icons

## Deploy
Upload the contents of this folder to the root of the GitHub repository, then connect the repository to Netlify. Publish directory: `/` (repository root). No build command is required.

## Important review before public launch
The app implements the exercise-specific 1–12 coefficient arrays transcribed from the user's supplied coefficient-table image and the four-formula average for “기타”. The percentage result panel currently uses 100, 95, 90, 85, 80, 75, 70, 65 and 60 percent. Confirm this panel's exact intended percentage sequence and verify the coefficient transcription against the source image before public launch.
