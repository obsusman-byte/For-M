/* =========================================================
   EDIT ME — everything personal lives in this one file.
   Keep the quotes and commas exactly as they are.
   ========================================================= */
const CONFIG = {
  // Who it is for, and who it is from
  partnerName: "Maryam",
  yourName: "",                 // shown at the end of the letter (optional)

  // "anniversary" or "iloveyou" (changes the big title)
  occasion: "anniversary",

  // Colour theme: "wine" (deep red), "rose" (rose and plum) or "midnight" (navy and gold)
  theme: "wine",

  // The code that opens the letter (numbers or letters, any length)
  secretCode: "0214",
  hint: "",                     // optional hint, e.g. "The day we met"

  // The date your story began, as YEAR-MONTH-DAY. Shows a live "time together" counter.
  // Leave "" to hide the counter.
  startDate: "2022-02-14",

  // Small line under the big title
  subtitle: "Every day with you is my favourite day.",

  // The big line at the top of the letter
  message: "You turned my ordinary days into the ones I never want to forget.",

  // The letter. Add, remove or rewrite paragraphs freely.
  letter: [
    "I wanted to say this somewhere you could keep it, so I built you a little world made of the things I never say out loud.",
    "Thank you for the patience on my hardest days and the laughter on my best ones. You make home feel like a person, and that person is you.",
    "I do not need a perfect life. I just need to keep sharing the ordinary one with you: the long talks, the silly jokes, the quiet evenings where nothing happens and everything is enough.",
    "Whatever comes next, I am choosing you, again and again.",
  ],

  // Last line of the whole page
  closing: "I love you, today and every day after this one.",

  // "Our story so far" timeline. Add as many moments as you like.
  timeline: [
    { date: "The beginning", title: "The day we met", text: "I did not know it yet, but my life was about to change." },
    { date: "The first date", title: "Nervous and happy", text: "I remember being nervous, and I remember not wanting the night to end." },
    { date: "The moment I knew", title: "It was always you", text: "Somewhere between the laughter and the quiet, I knew." },
    { date: "Today", title: "Still choosing you", text: "And I would choose you again, a thousand times over." },
  ],

  // Flip cards ("icon" can be any emoji)
  reasons: [
    { icon: "😊", title: "Your smile", text: "My favourite sight in the whole world." },
    { icon: "😂", title: "Your laugh", text: "It fixes my worst days in seconds." },
    { icon: "🌷", title: "Your kindness", text: "You care in ways most people never notice." },
    { icon: "💪", title: "Your strength", text: "You inspire me more than you know." },
    { icon: "✨", title: "Your eyes", text: "I could get lost in them and never ask for directions." },
    { icon: "💗", title: "Just you", text: "Exactly as you are. That is what I love." },
  ],

  // Little letters to open (3 works best)
  openWhen: [
    { label: "Open when you miss me", text: "Look up at the sky tonight. We are under the same one, and I am thinking of you right now." },
    { label: "Open when you have a hard day", text: "You are stronger than this day. Breathe, drink some water, and remember I am on your side, always." },
    { label: "Open when you cannot sleep", text: "Close your eyes and picture the next time we are laughing together. I will meet you in your next dream." },
  ],

  // Promises (leave [] to hide)
  promises: [
    "I will listen, even when it is hard to hear.",
    "I will celebrate your wins louder than my own.",
    "I will choose kindness, even when I am tired.",
    "I will always make time for us.",
    "I will keep falling for you, every single day.",
  ],

  // The playful question near the end (the "No" button runs away!)
  question: "Will you keep choosing me?",
  yesLabel: "Yes, always",
  noLabel: "No",
  yesAnswer: "I knew it. I am the luckiest person alive. I love you. 💗",

  // ---- Interactive extras (delete a whole block to remove that feature) ----

  // Scratch-off card: she scratches with her finger to reveal a hidden message or coupon.
  scratch: {
    title: "A little something for you",
    prompt: "Use your finger to scratch the card.",
    icon: "🎟️",
    reveal: "One perfect date night, planned by me. Valid forever. Redeem it any time you like.",
  },

  // Hold to feel my heartbeat: she presses and holds the heart (phones can buzz in rhythm).
  heartbeat: {
    title: "Feel my heartbeat",
    prompt: "Press and hold the heart. Keep holding.",
    message: "That is what you do to me. Every single time.",
  },

  // Tilt your phone: rose petals slide around as she tilts her phone.
  tilt: {
    title: "Tilt your phone",
    prompt: "Tap start, then tilt your phone and watch the petals move.",
    message: "Wherever life tilts you, I will always be right here to catch you.",
  },

  // Your own song (optional). Put the mp3 in the "music" folder and write its name here.
  // Leave "" to use the built-in soft music-box background.
  // Example: music: "music/song.mp3",
  music: "",

  // Photos (optional). Put pictures in the "photos" folder, then list them here.
  // Example: { src: "photos/beach.jpg", caption: "Our best day" },
  // Leave [] to hide the photo section.
  photos: [],
};
