# Love Story Page 💌

A romantic surprise website for anniversaries and "I love you" messages. Plain HTML, CSS and JavaScript, so there is nothing to install or build.

**What the person experiences**
1. A sealed envelope with a secret code. The seal breaks when the code is right.
2. A beating heart and a live counter of how long you have been together.
3. A long scrolling story: title with their name, a love letter, a timeline of your story, flip cards ("why I love you"), "open when…" letters, a **scratch-off card**, photos, a **hold-to-feel-my-heartbeat** heart, a **tilt-your-phone** petal box, promises, a playful "Will you keep choosing me?" question (the "No" button runs away), and a finale with fireworks.

## The interactive extras (all in `config.js`)
- **`scratch`**: she scratches a rose-gold foil card with her finger to reveal a message or coupon. There is a "Reveal it for me" link for anyone who cannot scratch.
- **`heartbeat`**: she presses and holds the heart for about 4 seconds. It beats faster, thumps, and (on Android phones) vibrates in rhythm, then shows your message with fireworks. iPhones cannot vibrate from a web page, so they get the sound and glow only.
- **`tilt`**: she taps Start, then tilts her phone and petals slide around the box. After a few tilts your message appears. On iPhone she will see a permission pop-up for motion sensors; she must tap Allow. On a computer she can move the mouse over the box instead.

Delete a whole block from `config.js` (for example `tilt: {...}`) and that feature disappears.

## Try it
Double-click `index.html`. The default secret code is **0214**.

## Make it yours: edit `config.js` only
- `partnerName`, `yourName`, `occasion` ("anniversary" or "iloveyou")
- `theme`: "wine", "rose" or "midnight"
- `secretCode`, `hint`, `startDate` (YEAR-MONTH-DAY, for the counter)
- `message`, `letter`, `timeline`, `reasons`, `openWhen`, `promises`, `question`, `closing`
- `photos` (copy pictures into `photos/`) and `music` (copy an mp3 into `music/`)

Leave a list empty (`[]`) and that section disappears.

## Publish
Upload the whole folder to any static host (for example Cloudflare Pages, GitHub Pages, Vercel or Neocities). Open the link on a phone and test everything, including sound, before sending it.

## Good to know
- The code is a fun gate, not real security. Anyone who views the page source can find it.
- Fonts (Cormorant Garamond and Pinyon Script) load from Google Fonts; offline it falls back to your device's serif and script fonts.
- Animations and falling hearts switch off for people with "reduce motion" turned on.
- Phone tilt needs the site to be on https (any normal host provides this) and may not work when you just double-click `index.html`.
- Sound is generated in the browser. The speaker button (top right) mutes it.
