# And That Is Okay

> A poetic web memorial for GitHub Pages.

---

## ✦ Features

- **Poem Preserved Verbatim**: Formatted with high-aesthetic typography (`Cormorant Garamond` & `Plus Jakarta Sans`), subtle line spacing, and emotional emphasis on the refrains.
- **Audio Experience (`and-that-is-okay.mp3`)**:
  - Discreet, emotional entry screen (*"Step Inside"*). Clicking unlocks browser autoplay restrictions and fades the music in gently with a smooth volume ramp.
  - Floating player in the lower corner with animated sound bars to pause/resume anytime.
- **Cinematic Background (12–13 Photos)**:
  - Slow, emotional **Ken Burns effect** (slow pan & subtle zoom).
  - Smooth 3-second cross-fade between photos every 10 seconds.
  - Dark vignette overlay and subtle floating dust particles ensuring high text legibility and bittersweet melancholy.
  - Automatic error handling: only photos that exist in the directory are shown (missing files are skipped automatically without errors).

---

## ✦ How to Add Your 12 or 13 Photos

You currently have:
- `2025-Oct-12.jpg`
- `2025-Oct-13.jpg`

To add the rest:
1. Place your other photos in this folder (`/home/kali/and-that-is-okay/`).
2. Open `script.js` and list your filenames inside the `IMAGE_CANDIDATES` array:
   ```javascript
   const IMAGE_CANDIDATES = [
     '2025-Oct-12.jpg',
     '2025-Oct-13.jpg',
     '2025-Oct-14.jpg',
     'photo3.jpg',
     // ... add up to 12 or 13 files
   ];
   ```
*(Numbered files like `1.jpg`, `2.jpg` ... `13.jpg` are also detected automatically!)*

---

## ✦ How to Deploy to GitHub Pages

1. Commit and push the files to your GitHub repository:
   ```bash
   git add .
   git commit -m "Initial release: And That Is Okay"
   git push -u origin main
   ```
2. On GitHub:
   - Go to your repository **Settings** → **Pages** (on the left sidebar).
   - Under **Build and deployment** > **Branch**:
     - Select branch: `main`
     - Select folder: `/ (root)`
     - Click **Save**.
3. In ~1 minute, your site will be live at `https://<your-username>.github.io/<repo-name>/`.

