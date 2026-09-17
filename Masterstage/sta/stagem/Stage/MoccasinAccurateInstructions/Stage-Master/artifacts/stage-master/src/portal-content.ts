export type PortalModule = {
  number: string;
  title: string;
  eyebrow: string;
  summary: string;
  readTime: string;
  videoAssetId: string;
  videoDuration: string;
  pattern: string;
  accent: "gold" | "blue" | "green";
};

export const portalModules: PortalModule[] = [
  {
    number: "01",
    title: "Own the Room in Your Head",
    eyebrow: "Module one",
    summary:
      "The 90-second reset that quiets the shake before you record and gives you a state you can call up on demand.",
    readTime: "8 min read",
    videoAssetId: "video-01",
    videoDuration: "1:50",
    pattern: "The Reframe + Confidence Anchor",
    accent: "gold",
  },
  {
    number: "02",
    title: "Message Architecture",
    eyebrow: "Module two",
    summary:
      "Build a talk around one clear idea with a structure people can follow and remember.",
    readTime: "10 min read",
    videoAssetId: "video-02",
    videoDuration: "1:55",
    pattern: "Presupposition + Embedded Commands",
    accent: "blue",
  },
  {
    number: "03",
    title: "Voice & Delivery",
    eyebrow: "Module three",
    summary:
      "Use pace, pitch, volume, and silence so your delivery sounds intentional instead of rushed.",
    readTime: "9 min read",
    videoAssetId: "video-03",
    videoDuration: "2:15",
    pattern: "Analog Marking + Auditory Pacing",
    accent: "green",
  },
  {
    number: "04",
    title: "Camera Presence & Body Language",
    eyebrow: "Module four",
    summary:
      "Look natural on camera with a stable eye line, simple framing, and deliberate movement.",
    readTime: "8 min read",
    videoAssetId: "video-04",
    videoDuration: "1:50",
    pattern: "Rapport Building + State Transfer",
    accent: "gold",
  },
  {
    number: "05",
    title: "Storytelling That Sells",
    eyebrow: "Module five",
    summary:
      "Build four reusable stories that make a stranger trust your expertise in 90 seconds.",
    readTime: "11 min read",
    videoAssetId: "video-05",
    videoDuration: "2:32",
    pattern: "Nested Loops + Submodality Shifts",
    accent: "blue",
  },
  {
    number: "06",
    title: "Speaking to Sell",
    eyebrow: "Module six",
    summary:
      "Use a simple webinar spine and a 60-second pitch to ask for the sale without shrinking your voice.",
    readTime: "10 min read",
    videoAssetId: "video-06",
    videoDuration: "1:57",
    pattern: "Pace-and-Lead + Future Pacing",
    accent: "green",
  },
  {
    number: "07",
    title: "The 30-Day Practice System",
    eyebrow: "Module seven",
    summary:
      "Turn the patterns into reflex with ten minutes of focused practice a day.",
    readTime: "7 min read",
    videoAssetId: "video-07",
    videoDuration: "2:17",
    pattern: "The Swish + Identity-Level Change",
    accent: "gold",
  },
];

export const portalResources = [
  {
    type: "Course PDF",
    title: "StageMaster Course",
    description: "The complete seven-module written course with all frameworks and examples.",
    assetId: "course-pdf",
    requiredTier: "personal",
  },
  {
    type: "Workbook",
    title: "StageMaster Workbook",
    description: "Practice drills and a 30-day plan to turn the patterns into reflex.",
    assetId: "workbook-pdf",
    requiredTier: "personal",
  },
  {
    type: "Cheat sheets",
    title: "Six Quick-Reference Sheets",
    description: "One-page reminders for talks, webinars, recordings, and all 12 NLP patterns.",
    assetId: "cheatsheets-pdf",
    requiredTier: "personal",
  },
  {
    type: "Companion deck",
    title: "16-Slide Companion Deck",
    description: "The speaking system in a presentation you can study or adapt.",
    assetId: "deck-pptx",
    requiredTier: "personal",
  },
  {
    type: "Swipe files",
    title: "Video Lesson Scripts",
    description: "Word-for-word scripts for all seven narrated lessons.",
    assetId: "video-scripts",
    requiredTier: "personal",
  },
  {
    type: "Swipe files",
    title: "Sales Page Copy",
    description: "The StageMaster headline, offer, FAQ, and final CTA copy.",
    assetId: "sales-page-copy",
    requiredTier: "reseller",
  },
  {
    type: "Swipe files",
    title: "Seven-Email Buyer Sequence",
    description: "Follow-up emails ready to load into an email tool.",
    assetId: "emails",
    requiredTier: "reseller",
  },
  {
    type: "Swipe files",
    title: "Whop Listing Copy",
    description: "Paste-ready product listing copy for the StageMaster offer.",
    assetId: "whop-listing",
    requiredTier: "reseller",
  },
];