

# Podcaster

This project is a podcast application built using React, TypeScript, and Vite. It features the ability to search for podcasts, view podcast details, and play episodes. The project also uses a caching strategy for API calls to improve performance and user experience.

Hosted: [Podcaster](https://podcast-ex-test.vercel.app/)

## Demo
![Crud App](https://github.com/user-attachments/assets/e6a4f189-7d7c-40af-bf20-30d2b04928f1)


## Quick Start Guide

## Prerequisites

- Node.js (version 14 or later)
- npm (version 6 or later) or yarn (version 1.22 or later)

## Installation

1. **Clone the repository:**

```sh
git clone https://github.com/contracamilo/podcast-ex-test.git
cd podcast-ex-test
```

1. **Install dependencies::**

Using npm:

```sh
npm install
```

2. **Running the Development Server::**

Start the development server to run the application locally:

Using npm:

```sh
npm run dev
```

Open your browser and navigate to <http://localhost:5173/> to see the application.

3. **Building for Production::**
To create a production build of the application, we use Vite's build command. The production build is optimized for performance and ready for deployment.

Using npm:

```sh
npm run build
```

This command generates a dist folder containing the optimized application. You can then deploy the contents of the dist folder to your preferred hosting service.

**Serve the Production Build**
You need to serve the contents of the dist folder using a static server. There are several ways to do this, such as using a static server like serve, deploying to a hosting service, or using a web server like Nginx or Apache.

**Using serve**
You can use a simple static file server like serve to serve the production build locally.

Install serve globally if you haven't already:

```sh
npm install -g serve
```

Serve the production build:

```sh
serve -s dist
```


**Linting & Testing::**
To build the application for production, use:

To run the tests and lint the project, use:

Using npm:

```sh
npm run test
npm run lint
```

**Project Structure::**

```sh
.
├── App.tsx
├── api
├── assets
├── components
│   ├── AudioPlayer
│   │   ├── AudioPlayer.spec.tsx
│   │   └── AudioPlayer.tsx
│   ├── Grid
│   │   └── Grid.tsx
│   ├── Header
│   │   ├── Header.spec.tsx
│   │   └── Header.tsx
│   ├── Layout
│   │   ├── MainLayout.spec.tsx
│   │   └── MainLayout.tsx
│   ├── Loader
│   │   └── Loader.tsx
│   ├── SearchField
│   │   ├── SearchField.tsx
│   │   └── SerachField.spec.tsx
│   ├── SidePanel
│   │   ├── SidePanel.spec.tsx
│   │   └── SidePanel.tsx
│   └── Tile
│       ├── Tile.spec.tsx
│       └── Tile.tsx
├── context
│   └── PageContext.tsx
├── hooks
│   ├── useFetchApi.tsx
│   ├── usePodcast.tsx
│   └── usePodcastContext.tsx
├── index.scss
├── main.tsx
├── pages
│   ├── EpisodeDetail.tsx
│   ├── Home.tsx
│   ├── PodcastDetail.tsx
│   └── index.ts
├── router
│   └── RouterWrapper.tsx
├── styles
│   ├── audio-player.scss
│   ├── details.scss
│   ├── episode.scss
│   ├── globals.scss
│   ├── grid.scss
│   ├── header.scss
│   ├── home.scss
│   ├── layout.scss
│   ├── podcast.scss
│   ├── search.scss
│   ├── sidebar.scss
│   └── tile.scss
├── types
│   └── podcast.ts
├── utils
│   └── helpers.ts
└── vite-env.d.ts
```

### Key Features

Search Functionality: Allows users to search for podcasts.
Podcast Details: Displays detailed information about a podcast, including a list of episodes.
Episode Playback: Enables users to play podcast episodes directly within the app.
Caching Strategy: Implements a caching strategy to store API call responses in local storage, reducing the need for repeated API requests and improving load times.
Technical Approach
Caching Strategy
To optimize performance and improve the user experience, we implemented a caching strategy for API calls using local storage. This approach involves storing API responses in the browser's local storage and retrieving them when needed, thus avoiding redundant network requests.

### Hook for Fetching Data with Caching

We created a custom hook, useFetch, to handle data fetching and caching:

```typescript
import { useState, useEffect } from "react";

const useFetch = <T,>(
  url: string,
  storageKey: string,
  expiryKey: string,
): { data: T | null; error: string | null; loading: boolean } => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const currentTime = new Date().getTime();
      const savedData = localStorage.getItem(storageKey);
      const savedExpiry = localStorage.getItem(expiryKey);

      if (
        savedData &&
        savedExpiry &&
        currentTime - parseInt(savedExpiry) < 2592000000 // 30 days in milliseconds
      ) {
        setData(JSON.parse(savedData));
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result);
        localStorage.setItem(storageKey, JSON.stringify(result));
        localStorage.setItem(expiryKey, currentTime.toString());
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, storageKey, expiryKey]);

  return { data, error, loading };
};

export default useFetch;
```

### Using the Custom Hook

We used the useFetch hook to fetch podcast and episode details, and to implement caching for these API calls:

```typescript
export const usePodcastDetail = (podcastId: string) => {
  const { data, error, loading } = useFetch<{
    results: PodcastDetail[];
  }>(
    `https://itunes.apple.com/lookup?id=${podcastId}&media=podcast&entity=podcastEpisode&limit=20`,
    `podcastDetail_${podcastId}`,
    `podcastDetailExpiry_${podcastId}`,
  );

  const podcastDetail =
    data?.results.find(
      (item): item is PodcastDetail => "collectionName" in item,
    ) || null;
  const episodes =
    data?.results.filter((item: PodcastDetail) => "trackName" in item) || [];

  return {
    podcastDetail: podcastDetail ? { ...podcastDetail, episodes } : null,
    error,
    loading,
  };
};
```

This hook retrieves episode details based on the podcast ID and episode ID. If the data is cached and not expired (within 30 days), it uses the cached data. Otherwise, it fetches the data from the API and caches it for future use.

### Unit Testing Components

We have implemented unit tests for our React components to ensure their functionality and reliability. Here's an example of how we tested the Header component:

``` typescript
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Header } from "./Header";

describe("Header", () => {
  test("renders header component with title", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    const headerElement = screen.getByTestId("header-component");
    const titleElement = screen.getByText("Podcaster");

    expect(headerElement).toBeInTheDocument();
    expect(titleElement).toBeInTheDocument();
  });

  test("renders loading indicator when loading is true", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    const loadingIndicator = screen.getByTestId("loading-indicator");

    expect(loadingIndicator).toBeInTheDocument();
  });

  test("does not render back button on home page", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Header />
      </MemoryRouter>,
    );

    const backButton = screen.queryByText("< Back");

    expect(backButton).not.toBeInTheDocument();
  });

  test("renders back button on non-home pages", () => {
    render(
      <MemoryRouter initialEntries={["/about"]}>
        <Header />
      </MemoryRouter>,
    );

    const backButton = screen.getByLabelText("Back button");

    expect(backButton).toBeInTheDocument();
  });
});
});
```

Unit tests help us verify that our components render correctly and handle user interactions as expected.

## Future Improvements

Enhanced Error Handling: Improve error handling mechanisms to provide better user feedback.
Unit Testing: Add more comprehensive unit tests to ensure the reliability of components and hooks.
Responsive Design: Ensure the application is fully responsive and works well on various screen sizes.

By implementing these strategies and improvements, we aim to create a robust and user-friendly podcast application.

