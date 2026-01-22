# PooPals 💩

**PooPals** is the ultimate social poop tracking and health companion app. Track your habits, gain health insights, find nearby thrones, and compete with friends for the royal flush!

<p align="center">
  <img src="assets/images/icon.png" width="100" />
</p>

## ✨ Features

### 📝 Log-a-Log

- **Complete Tracking**: Record Bristol Stool Scale type (1-7), volume (Small to Massive), and colour.
- **Session Timer**: Stopwatch with "Toilet Reading Time" fun facts to entertain you.
- **Photo Capture**: Securely log photos of your deposit (auto-blurred in feed) and the toilet venue.
- **Panic Button**: Instant one-tap access to start a session when nature calls urgently.

### 📊 Deep Dumps Analytics

- **Health Score (0-100)**: Proprietary algorithm analyzes your regularity, consistency, and color.
- **Smart Alerts**: Automatic detection of concerning patterns (constipation, diarrhea, warning colors).
- **Charts & Graphs**: Visualize your habits with time-of-day heatmaps and Bristol distribution charts.
- **Monthly Wrapped**: Shareable month-end report card summarizing your toilet tenure.

### 🗺️ Toilet Finder

- **Nearby Map**: Find public restrooms near you instantly with Google Maps integration.
- **Venue Details**: See ratings, bidet availability, and toilet paper quality.
- **Filter & Search**: Filter by "Malls" or "Hotels" for a premium experience.
- **Hotspots**: Track your personal most-visited locations (e.g., "Home Base", "Office").

### 🏆 Achievements

- **Badges System**: Unlock 11 unique badges like _Speed Demon_ (<1 min), _The Philosopher_ (>30 mins), and _Iron Gut_.
- **Progress Tracking**: See exactly what you need to do to unlock the next tier.

### 👥 Social Flush

- **Friend Feed**: See (blurred) updates from friends. "Sync Poop" notification when you go at the same time!
- **Leaderboards**: Compete for titles like _The Sprinter_ (fastest), _Marathoner_ (longest duration), and _Heavyweight_ (most volume).
- **Privacy Mode**: Toggle to blur all potentially sensitive content in the feed.

---

## 🚀 Getting Started

1. **Clone the repo**

   ```bash
   git clone https://github.com/maxi-cmyk/poop-tracker.git
   cd poop-tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root directory:

   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
   ```

4. **Run the App**
   ```bash
   npx expo start
   ```
   Scan the QR code with the **Expo Go** app on iOS or Android.

---

## 🛠️ Built With

- **React Native** (Expo)
- **Supabase** (PostgreSQL Database & Auth)
- **Google Maps API**
- **TypeScript**

---

Made with concern by PooPals Team
