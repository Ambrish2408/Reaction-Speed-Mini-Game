# Reaction Speed Game (with sounds + intro)

A React + Tailwind + Framer Motion mini-game. This version includes simple WAV sound effects and a 3-2-1-Go intro.

## What's added
- `public/sounds/` contains `click.wav`, `miss.wav`, `start.wav` generated as short tones.
- Intro countdown before game start (3..2..1..Go).
- Sounds: click (on hit), miss (on timeout), start (on game begin).

## Run locally
1. Clone the repository
2. 'npm install'
3. 'npm run dev' and open the Vite URL (usually http://localhost:5173/)

## Notes
- Sounds are small WAV files generated programmatically (sine tones). Replace with mp3 if desired.
- For mobile autoplay restrictions, user interaction (click Start) triggers audio play permission.
 
 # Additional Note:
- You Can change sound accordingly if you want from public/sounds folder
