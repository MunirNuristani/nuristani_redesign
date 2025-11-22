# 📊 Analytics Tracking System Documentation

## Overview

Your Nuristani Dictionary application now has a comprehensive Firebase-based analytics system that tracks user interactions while respecting privacy.

## 🎯 What's Being Tracked

### 1. **Page Visits** (`analytics-page-visits` collection)
Tracks when users visit the dictionary page.

**Data Collected:**
- Timestamp
- Page name
- Referrer URL
- User agent (browser info)
- User's selected language preference
- Session ID
- Current URL
- Viewport dimensions (screen size)

**Triggered:** Once when the dictionary page loads

---

### 2. **Dictionary Searches** (`analytics-dictionary-searches` collection)
Tracks every search performed in the dictionaries.

**Data Collected:**
- Timestamp
- Search query (the word being searched)
- Dictionary type (Dari→Nuristani or Nuristani→Pashto/Dari)
- Results found (true/false)
- Number of exact matches
- Number of similar matches
- User's language preference
- Session ID

**Triggered:** Every time a user clicks "Search" or presses Enter

**Use Cases:**
- Identify most searched words
- Find gaps in dictionary coverage
- Understand which dictionary is more popular
- Calculate search success rate

---

### 3. **Autocomplete Selections** (`analytics-autocomplete` collection)
Tracks when users select suggestions from the autocomplete dropdown.

**Data Collected:**
- Timestamp
- Original search query
- Selected suggestion
- Position in dropdown (0-4)
- Dictionary type
- User's language preference
- Session ID

**Triggered:** When clicking a suggestion or pressing Enter on a highlighted suggestion

**Use Cases:**
- Measure autocomplete effectiveness
- Understand if users prefer typing vs selecting suggestions
- Identify which position gets clicked most

---

### 4. **Button Clicks** (`analytics-button-clicks` collection)
Tracks all button interactions.

**Button Types Tracked:**
- `dictionary-tab-switch` - Switching between dictionaries
- `search-button` - Clicking the search button
- `suggestion-click` - Clicking autocomplete suggestions
- `similar-word-click` - Clicking similar words in results
- `clear-search` - Clicking the clear/reset button
- `new-search` - Starting a new search

**Data Collected:**
- Timestamp
- Button type
- Button label (e.g., the word that was clicked)
- Dictionary type
- Additional context data
- User's language preference
- Session ID
- Page URL

**Use Cases:**
- Understand navigation patterns
- Measure feature usage
- Identify most used interactions

---

### 5. **Dictionary Tab Switches** (`analytics-dictionary-switches` collection)
Tracks when users switch between Dari→Nuristani and Nuristani→Pashto/Dari dictionaries.

**Data Collected:**
- Timestamp
- From dictionary
- To dictionary
- User's language preference
- Session ID

**Use Cases:**
- Understand which dictionary is more popular
- See if users switch between both dictionaries
- Measure bilingual usage patterns

---

### 6. **User Sessions** (`analytics-sessions` collection)
Tracks unique user sessions.

**Data Collected:**
- Timestamp
- Session ID (unique per browser session)
- User's language preference
- User agent
- Referrer
- Landing page
- Viewport dimensions

**Triggered:** Once per browser session (first page visit)

**Use Cases:**
- Count unique visitors
- Understand user demographics (via user agent)
- Analyze traffic sources

---

## 🔒 Privacy Features

### What We DON'T Track:
- ❌ Personal information (names, emails, addresses)
- ❌ IP addresses
- ❌ User accounts or login info
- ❌ Location data
- ❌ Cookies

### What We DO Track:
- ✅ Anonymous session IDs (generated in browser)
- ✅ Language preferences (from localStorage)
- ✅ Search queries (to improve dictionary)
- ✅ Interaction patterns

### Session ID System:
- Generated in the browser using `sessionStorage`
- Persists only during the browser session
- Resets when browser is closed
- Cannot identify individual users across sessions

---

## 📈 Viewing Your Analytics Data

### Option 1: Firebase Console (Quick View)
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Firestore Database**
4. Browse collections:
   - `analytics-page-visits`
   - `analytics-dictionary-searches`
   - `analytics-autocomplete`
   - `analytics-button-clicks`
   - `analytics-dictionary-switches`
   - `analytics-sessions`

### Option 2: Export to Analysis Tools
You can export Firestore data to:
- **BigQuery** (for advanced SQL queries)
- **Google Sheets** (via Cloud Functions)
- **Custom dashboards** (build your own)

---

## 📊 Useful Queries & Insights

### Most Searched Words
Query `analytics-dictionary-searches` and group by `searchQuery`

### Search Success Rate
```
Success Rate = (searches with resultsFound=true) / (total searches) × 100
```

### Dictionary Popularity
Count searches in each `dictionaryType`

### Peak Usage Times
Group `timestamp` by hour/day

### Most Clicked Similar Words
Query `analytics-button-clicks` where `buttonType = "similar-word-click"`

### Autocomplete Effectiveness
Compare searches that used autocomplete vs manual typing

---

## 🚀 Future Enhancements

You can easily add more tracking:

1. **Search to Click Time** - How long users take to find results
2. **Scroll Depth** - How far users scroll in results
3. **Failed Searches** - Words that returned no results
4. **Language Switching** - Track when users change UI language
5. **Mobile vs Desktop** - Analyze usage by device type

---

## 🛠️ Maintenance

### Data Retention
Consider implementing data cleanup:
- Delete old analytics data after 90 days
- Aggregate old data into summary reports
- Set up Firebase TTL policies

### Cost Considerations
Firebase free tier includes:
- 50K document reads/day
- 20K document writes/day

Monitor usage in Firebase Console > Usage tab

---

## 🔧 Troubleshooting

### Analytics Not Working?
1. Check Firebase config in `.env.local`
2. Verify Firestore rules allow writes
3. Check browser console for errors
4. Confirm Firebase SDK is initialized

### Missing Data?
- Sessions are anonymous, data won't persist across browser restarts
- Check if Firestore is in production mode
- Verify network connectivity

---

## 📝 Example Firestore Security Rules

Make sure your Firestore has these rules to allow analytics writes:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow reads/writes to analytics collections
    match /analytics-{type}/{document=**} {
      allow read: if request.auth != null; // Only authenticated admins
      allow write: if true; // Anyone can write analytics
    }
  }
}
```

---

## 🎓 Learning Resources

- [Firebase Firestore Documentation](https://firebase.google.com/docs/firestore)
- [BigQuery + Firebase Integration](https://firebase.google.com/docs/firestore/extend-with-bigquery)
- [Privacy Best Practices](https://firebase.google.com/support/privacy)

---

## 📞 Support

If you need help analyzing the data or want custom reports:
1. Export data from Firestore
2. Use BigQuery for complex queries
3. Build custom dashboards with Chart.js/D3.js

---

**Built with ❤️ for the Nuristani Language preservation project**
