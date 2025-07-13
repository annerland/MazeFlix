# MazeFlix - TV Show Dashboard

A Vue 3 application for browsing TV shows, genre-based carousels, debounced search, and detailed show information. Built with TypeScript, Pinia, Tailwind CSS, and Vitest.

https://github.com/user-attachments/assets/d2a3b78b-9d59-4541-9367-18a4059580f9

---

## ✨ Features

- **Dashboard:** Horizontal, animated carousels organized by genre
- **Genre-Based Organization:** Automatic categorization and sorting by rating
- **Debounced Search:** Real-time, efficient search with a Netflix-style expanding bar
- **Show Details:** Responsive detail view with summary, metadata, and genre links
- **Responsive Design:** Optimized for desktop and mobile
- **Error Handling:** User-friendly error and empty states
- **Modern UI:** Fixed, animated header; animated cards; smooth transitions

---

## 🛠️ Technical Stack

- **Vue 3** (Composition API)
- **TypeScript** (strict mode)
- **Pinia** (state management)
- **Vue Router** (routing)
- **Tailwind CSS** (utility-first styling)
- **Axios** (HTTP client)
- **Vitest** (unit testing)
- **@vue/test-utils** (component testing)

---

## 🧩 Architecture

### Repository Pattern and Client-Side Caching

**Context:**  
The TVMaze API has a few limitations I needed to work around: there's no server-side caching or filtering by genre, and the data comes paginated. Some shows are also missing important pieces like images or metadata. On top of that, repeated API calls can be slow and might trigger rate limits. Since the goal is to deliver a smooth and responsive user experience, I would like to minimize unnecessary network calls wherever possible.

**Decision:**  
To solve this, I wrapped all API interactions in a `TvmazeRepository`. This layer takes care of normalizing data, handling errors consistently, and giving us a clean, predictable interface to work with. Once the shows are fetched, they’re cached in a centralized Pinia store `allShows`, so we’re not hitting the API more than we need to. Filtering (like by genre) is done on the client side, directly on this cached data. Additional show details and banners are also cached after their initial request.

**Consequences:**  
- We avoid redundant API calls and reduce the risk of running into rate limits.
- The app feels faster and more responsive since most data is served from memory.
- Error handling and data shaping happen in one place, which makes the codebase easier to maintain and test.
- This setup also makes easier to mock data for unit tests.
- Enables easy mocking for unit tests.
- Initial load may require multiple paginated requests.
- Client memory usage increases with the number of cached shows.
- Cache invalidation is not automatic if the API data changes.

---

### Centralized State Management with Pinia

**Context:**  
To keep the UI reactive and consistent across views, we need a shared state for things like show data, search terms, and error messages. Multiple components depend on the same data and need to update automatically when something changes.

**Decision:**  
I chose Pinia for centralized state management. All show data, search state, and errors live in a single store. I’ve also exposed computed properties for things like genre lists, filtered results, and search mode to keep components away from unecessary logic.

**Consequences:**  
- All components stay in sync automatically, which simplifies the app architecture.
- The data flow becomes easier to follow and debug.
- It’s simple to extend or refactor the logic in one place if needed.
- It's easier to learn for contributors unfamiliar with Pinia.

---

Run all tests with:
```bash
pnpm test
# or
npm run test
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- pnpm (recommended) or npm

---

## 📚 API

This project uses the [TVMaze API](https://api.tvmaze.com) for all show data. No auth required.

---

## 📄 License

MIT
