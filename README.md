# mktdash - Market Analytics Dashboard

**mktdash** is a web-based market analytics platform designed to provide insights into U.S. financial markets using publicly available data sources and free APIs. The project aims to deliver a comprehensive dashboard and a daily market summary PDF report. It is built as a monorepo using pnpm workspaces, with a React frontend and a Node.js/Express backend.

**Current Status:** Phase 1 (Optimizing initial structure, implementing core features, and refining UI).

---

## Features

### Current Features:
* **Market Overview:** Snapshot of key market indices (S&P 500, Nasdaq, DJIA) and their performance.
* **Macroeconomic Data:** Visualization of key economic indicators from FRED (e.g., Federal Funds Rate, CPI, Unemployment Rate).
* **Cryptocurrency Data:** Details and market chart data for various cryptocurrencies via CoinGecko.
* **Economic Calendar:** Displays upcoming economic events using an embed from Investing.com on the frontend.
* **Daily PDF Summary Report:** Automated generation of a daily market summary report (work in progress).
* **Interactive Charts:** Data visualization using Plotly.js and Echarts.
* **Responsive UI:** Built with TailwindCSS and shadcn/ui.

### Planned Features:
* Expanded data source integration (e.g., IEX Cloud, Trading Economics, Yahoo Finance, Quandl).
* Advanced technical analysis tools.
* User accounts and personalized dashboards.
* More comprehensive and customizable PDF reports.
* Machine learning insights (placeholder ML service exists in frontend).

---

## Tech Stack

* **Monorepo:** pnpm workspaces
* **Backend:**
    * Runtime: Node.js
    * Framework: Express
    * Language: TypeScript
    * Data Sources:
        * FRED (Federal Reserve Economic Data)
        * CoinGecko
    * Caching: Redis
    * PDF Generation: Puppeteer
    * Key Libraries: `axios` (for HTTP requests), `dotenv` (for environment variables).
* **Frontend:**
    * Framework: React (with Vite)
    * Language: TypeScript
    * Styling: TailwindCSS, shadcn/ui
    * Charting: Plotly.js, Echarts
    * State Management: TanStack React Query (React Query)
    * Routing: React Router DOM
    * Key Libraries: `axios` (for API calls).
* **DevOps & Tooling:**
    * ESLint for linting (primarily frontend).
    * Prettier (likely, for code formatting).
    * Git for version control.

---

## Project Structure

The project is organized into a monorepo with two main packages:

zekenewsom-mktdash/
├── packages/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── controllers/  # Request handlers
│   │   │   ├── services/     # Business logic, data fetching, external API interactions
│   │   │   ├── routes/       # API route definitions
│   │   │   ├── utils/        # Utility functions (date, fetch, Redis)
│   │   │   └── index.ts      # Backend server entry point
│   │   ├── .env.example      # Environment variable template
│   │   └── package.json
│   └── frontend/
│       ├── src/
│       │   ├── pages/        # Top-level page components
│       │   ├── components/   # Reusable UI components (general, UI, placeholders)
│       │   ├── hooks/        # Custom React hooks
│       │   ├── api/          # Frontend API service calls
│       │   ├── lib/          # Utility functions
│       │   ├── styles/       # Global styles
│       │   ├── App.tsx       # Main app component with routing
│       │   └── main.tsx      # Frontend entry point
│       ├── vite.config.ts    # Vite configuration (including proxy)
│       └── package.json
├── package.json              # Root package.json for workspace scripts
└── pnpm-workspace.yaml       # pnpm workspace configuration


---

## Configuration

### Backend (`packages/backend/`)
Create a `.env` file in the `packages/backend/` directory by copying `.env.example`. Key environment variables include:
* `PORT`: Port for the backend server (default: 3001).
* `FRED_API_KEY`: Your API key for FRED.
* `COINGECKO_API_KEY`: Your API key for CoinGecko (Note: CoinGecko's public API is generally keyless but rate-limited; a key might be for a paid tier if used).
* `REDIS_URL`: Connection URL for your Redis instance (e.g., `redis://localhost:6379`).
* `COINGECKO_CACHE_TTL`: Cache Time-To-Live for CoinGecko data (e.g., `60` for 60 seconds).
* `FRED_HISTORY_CACHE_TTL`: Cache TTL for FRED historical series (e.g., `86400` for 24 hours).
* `FRED_DAILY_CACHE_TTL`: Cache TTL for FRED daily data (e.g., `3600` for 1 hour).

### Frontend (`packages/frontend/`)
* `vite.config.ts`: Contains the proxy configuration for API requests. By default, requests to `/api` are proxied to `http://localhost:3001` (the backend server).

---

## Getting Started

### Prerequisites
* Node.js (LTS version recommended)
* pnpm (latest version recommended)
* A running Redis instance.
* API Keys:
    * FRED API Key
    * CoinGecko API Key (if applicable for your usage level)

### Installation
1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd zekenewsom-mktdash
    ```
2.  Install dependencies for all packages using pnpm:
    ```bash
    pnpm install
    ```
3.  Set up backend environment variables:
    * Navigate to `packages/backend/`.
    * Copy `.env.example` to `.env`.
    * Fill in your API keys and Redis URL in the new `.env` file.

### Running the Project
You can run both the backend and frontend concurrently from the root directory:
```bash
pnpm dev
```

This will typically start:

    Backend server on http://localhost:3001 (or the port specified in .env).
    Frontend development server (Vite) on http://localhost:5173 (or another available port).

Alternatively, you can run them separately:

    To start the backend:
    ```bash
    pnpm --filter backend dev
    ```

    To start the frontend:
    ```bash
    pnpm --filter frontend dev
    ```

Open your browser and navigate to the frontend URL (usually http://localhost:5173).

## Key API Endpoints (Backend)

The backend exposes several RESTful API endpoints under the /api prefix. Some key endpoints include:

    GET /api/overview/snapshot: Retrieves an aggregated snapshot of market data for the homepage.
    GET /api/macro: Fetches general macroeconomic data series.
    GET /api/market-indices: Retrieves data for major market indices (S&P 500, Nasdaq, DJIA).
    GET /api/series/:seriesId: Fetches detailed historical data for a specific FRED series ID.
    GET /api/series/:seriesId/details: Fetches details and recent values for a specific FRED series ID.
    GET /api/crypto/:cryptoId: Fetches details for a specific cryptocurrency from CoinGecko.
    GET /api/crypto/:cryptoId/market_chart: Fetches market chart data for a specific cryptocurrency.
    POST /api/report/generate: Generates a daily market summary PDF report.

(Note: The /api/calendar/events endpoint is deprecated as calendar functionality is now frontend-based).

---

## Optimization & Development Notes

This project is actively being optimized. Key areas of focus include:

    Standardizing caching mechanisms (consolidating on Redis).
    Refactoring report generation for better maintainability.
    Improving error handling and configuration management.
    Removing unused or redundant code.
    Enhancing code documentation.
    Establishing a comprehensive testing suite.

The frontend makes use of placeholder components for features that are still under development or awaiting full data integration.


## Project Objective

To create an interactive and modular web-based market analytics platform for U.S. financial markets, including a Goldman Sachs–style daily PDF report generator, using only free APIs and public data sources.

## Current Phase

Phase 1: Initial Structure and UI Scaffold

This phase establishes the foundational file structure for the frontend (React, TailwindCSS, shadcn/ui) and backend (Node.js, Express) and includes placeholder components and routes.

## Structure

The project uses a simple monorepo-like structure with `packages/frontend` and `packages/backend`, managed using **pnpm workspaces**.

## Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url> mktdash
    cd mktdash
    ```
2.  **Install pnpm (if you don't have it):**
    ```bash
    npm install -g pnpm # Or follow instructions on pnpm.io
    ```
3.  **Install all dependencies using pnpm workspaces:**
    ```bash
    pnpm install
    ```
    This command runs from the root directory and installs dependencies for both `frontend` and `backend` packages.

4.  **Install shadcn/ui (Frontend):**
    * Navigate into the frontend package:
        ```bash
        cd packages/frontend
        ```
    * Initialize shadcn/ui. This step is interactive. Follow the prompts to configure shadcn/ui (select TypeScript, your preferred style, configure CSS variables, etc.).
        ```bash
        npx shadcn-ui@latest init
        ```
    * **Crucially**, when prompted about the `components.json` file location, ensure it's correctly set up relative to your project structure. The default should usually work if you run the command inside `packages/frontend`.
    * After initialization, you can add components. For example, to add the Button component:
        ```bash
        npx shadcn-ui@latest add button
        ```
        This will create files like `src/components/ui/button.tsx`.

5.  **Backend Environment Variables:**
    * Navigate back to the backend package:
        ```bash
        cd ../backend
        ```
    * Copy the example environment file:
        ```bash
        cp .env.example .env
        ```
    * Edit `.env` to configure backend settings (e.g., port) **and add your API keys for FRED and Alpha Vantage:**

        - **FRED API Key:**
            - Register for free at https://fred.stlouisfed.org/docs/api/api_key.html
            - Paste the key into your `.env` as `FRED_API_KEY=...`
        - **Alpha Vantage API Key:**
            - Register for free at https://www.alphavantage.co/support/#api-key
            - Paste the key into your `.env` as `ALPHAVANTAGE_API_KEY=...`

    * Your `.env` should look like:
        ```env
        PORT=3001
        FRED_API_KEY=your_fred_api_key_here
        ALPHAVANTAGE_API_KEY=your_alpha_vantage_api_key_here
        ```

## Running the Application

You can run the backend and frontend concurrently using pnpm workspace filters. Open two terminal windows.

1.  **Start the backend:**
    ```bash
    cd mktdash # Ensure you are in the root directory
    pnpm --filter backend dev
    ```
    The backend should start on the port specified in your `.env` file (defaulting to 3001 if not set).

2.  **Start the frontend:**
    ```bash
    cd mktdash # Ensure you are in the root directory
    pnpm --filter frontend dev
    ```
    mktdash: Market Analytics Platform

## Project Objective

To create an interactive and modular web-based market analytics platform for U.S. financial markets, including a Goldman Sachs–style daily PDF report generator, using only free APIs and public data sources.

## Current Features

- **Monorepo Structure:** Managed with pnpm workspaces, separating frontend and backend concerns.

### Backend:
- **Node.js with Express.js and TypeScript.**
- **Serves as an API gateway, fetching data from various external sources.**
- **Data Services:**
    - FRED (Federal Reserve Economic Data) integration for economic and market series.
    - Alpha Vantage integration for economic calendar data (CSV parsing).
    - CoinGecko integration for cryptocurrency data.
- **API Endpoints:**
    - `/api/series/:seriesId`: Detailed historical data, current value, performance metrics (1D, 1W, 1M, YTD), and analytical metrics (SMAs, 52-week High/Low) for FRED series.
    - `/api/crypto/:cryptoId`: Similar detailed data for cryptocurrencies.
    - `/api/overview/snapshot`: Aggregated data for the Home page snapshot.
    - `/api/calendar/events`: Economic calendar events.
    - `/api/report/generate`: Generates a basic daily PDF summary report using Puppeteer.
- **Caching:**
    - In-memory caching for FRED and Alpha Vantage calendar data.
    - Redis integration for more robust caching (partially implemented for CoinGecko and FRED).

### Frontend:
- **React with Vite, TypeScript, TailwindCSS, and shadcn/ui.**
- **Routing:** Multi-page navigation using react-router-dom.
- **Dashboards:**
    - Home Page: Overview snapshot of Markets, Economic, and Financial Stability sections.
    - Markets Dashboard: Sections for Equities, Fixed Income/Bonds, Currencies (Forex), Commodities, Real Estate, and Cryptocurrencies.
    - Economic Indicators Dashboard: Sections for Inflation, Employment, Economic Growth, and Sentiment.
    - Financial Stability Dashboard: Sections for Interest Rates, Default & Delinquency, Debt Ratios, Asset Valuations, and Liquidity.
    - Economic Calendar Page: Displays economic events (currently using an Investing.com iframe, backend API available).
- **Detailed Indicator View:**
    - Interactive charts using ECharts (with SMAs plotted).
    - Performance metrics table.
    - Analytical metrics panel.
    - Basic chart drawing tools (trend line, measurement tool).
- **State Management for API Data:** Uses @tanstack/react-query via the useIndicatorDetails hook for efficient data fetching, caching, and state management.
- **PDF Report Viewer:** Button to trigger and download the daily PDF summary.
- **Styling:** TailwindCSS with shadcn/ui for a modern UI, including light/dark mode support.

## Tech Stack

- **Monorepo:** pnpm workspaces
- **Backend:**
    - Node.js, Express.js, TypeScript
    - APIs: FRED, Alpha Vantage, CoinGecko
    - PDF Generation: Puppeteer
    - Caching: Redis (integration in progress), In-memory
    - CSV Parsing: papaparse
- **Frontend:**
    - React, Vite, TypeScript
    - Styling: TailwindCSS, shadcn/ui
    - Charting: ECharts (via echarts-for-react)
    - Routing: react-router-dom
    - Data Fetching/State: @tanstack/react-query, Axios
    - Icons: lucide-react

## Setup

1. **Clone the repository:**

    ```sh
    git clone <repository-url> mktdash
    cd mktdash
    ```

2. **Install pnpm (if you don't have it):**

    ```sh
    npm install -g pnpm
    ```

3. **Install all dependencies using pnpm workspaces:**
   (Run from the root mktdash directory)

    ```sh
    pnpm install
    ```

4. **Initialize shadcn/ui (Frontend - if not already done or if re-initializing):**

    - Navigate into the frontend package:
      ```sh
      cd packages/frontend
      ```
    - Run:
      ```sh
      npx shadcn-ui@latest init
      ```
    - Follow the prompts. Ensure components.json is correctly configured.
    - Add components as needed, e.g.,
      ```sh
      npx shadcn-ui@latest add button select
      ```

5. **Backend Environment Variables:**

    - Navigate to the backend package:
      ```sh
      cd packages/backend
      ```
    - Copy the example environment file:
      ```sh
      cp .env.example .env
      ```
    - Edit `.env` to add your API keys:
        - FRED API Key: Register at fred.stlouisfed.org
        - Alpha Vantage API Key: Register at alphavantage.co
        - CoinGecko API Key: (You provided CG-8fdsVitGVLWHgpoanhsaabC2. Ensure this is kept secure and not committed to your repository if it's a real key. Use a placeholder in public examples.) Register at coingecko.com/en/api
        - Redis URL (Optional but Recommended): If you have a Redis instance running, set REDIS_URL. Defaults to redis://localhost:6379.
    - Your `.env` should look like:
      ```env
      PORT=3001
      FRED_API_KEY=your_fred_api_key_here
      ALPHAVANTAGE_API_KEY=your_alpha_vantage_api_key_here
      COINGECKO_API_KEY=your_coingecko_api_key_here # Use your actual key
      REDIS_URL=redis://localhost:6379

      # Cache TTLs (in seconds) - examples
      COINGECKO_CACHE_TTL=60
      FRED_HISTORY_CACHE_TTL=86400
      FRED_DAILY_CACHE_TTL=3600
      ```
    - **IMPORTANT:** Ensure your `.env` file is listed in `packages/backend/.gitignore` to prevent committing your API keys.

6. **Redis Setup (Optional but Recommended for Caching):**
    - Install Redis locally or use a cloud-hosted instance.
    - Ensure the `REDIS_URL` in your backend `.env` file points to your Redis instance. If Redis is not available, the caching for CoinGecko and FRED history will fall back or might not work as effectively.

## Running the Application

You can run the backend and frontend concurrently or individually.

**Option 1: Concurrently (from the root mktdash directory):**

```sh
pnpm start
```

This will attempt to start both the backend (on port 3001 by default) and the frontend (on port 5173 by default).

**Option 2: Individually (Open two terminal windows, from the root mktdash directory):**

- **Start the backend:**
    ```sh
    pnpm --filter backend dev
    ```
    The backend should start on the port specified in your `.env` file (defaulting to 3001).

- **Start the frontend:**
    ```sh
    pnpm --filter frontend dev
    ```
    The frontend should start on port 5173 (Vite default).

Open your browser to the frontend address (e.g., http://localhost:5173).

## Project Structure Overview

- `packages/backend`: Contains the Node.js/Express API.
    - `src/controllers`: Handles incoming requests and responses.
    - `src/services`: Contains business logic, data fetching from external APIs, and data processing.
    - `src/routes`: Defines API routes.
    - `src/utils`: Helper utilities (date manipulation, caching, etc.).
- `packages/frontend`: Contains the React/Vite UI.
    - `src/components`: Reusable UI components, including chart components and shadcn/ui elements.
    - `src/pages`: Top-level page components corresponding to routes.
    - `src/hooks`: Custom React hooks (e.g., useIndicatorDetails for data fetching).
    - `src/lib`: Utility functions (e.g., cn for Tailwind class merging).
    - `src/styles`: Global CSS and Tailwind configuration.

## Key API Endpoints (Backend)

- `/api/overview/snapshot`: Data for the Home page.
- `/api/series/:seriesId`: Detailed data for FRED series (e.g., /api/series/SP500).
- `/api/crypto/:cryptoId`: Detailed data for cryptocurrencies (e.g., /api/crypto/bitcoin).
- `/api/calendar/events`: Economic calendar data (e.g., /api/calendar/events?horizon=3month).
- `/api/report/generate` (POST): Triggers PDF report generation.
- `/api/macro`: Basic macro data (used by some overview cards).
- `/api/market-indices`: Basic market index data (used by some overview cards).

## Future Enhancements / Roadmap

- **Complete Markets Dashboard:**
    - Refine Cryptocurrency section (dynamic list, more crypto-specific details).
- **Enhance Detailed Indicator View:**
    - Add more analytical metrics (Volatility, RSI, etc.).
    - User-configurable chart overlays (e.g., toggle SMAs).
    - More advanced drawing tools (select/edit/delete lines, different shapes).
- **PDF Report Generator:**
    - More sophisticated report content and styling.
    - Embed ECharts charts into the PDF.
    - User customization for report content.
- **API Call Optimization:**
    - Full Redis integration across all backend services.
    - Advanced rate limiting/queuing for external APIs.
- **User Interface/User Experience:**
    - Refine layouts, styling, and interactions.
    - Improve error handling and user feedback.
    - Accessibility improvements.
- **Testing:** Implement comprehensive unit, integration, and E2E tests.
- **News Feed:** Connect to a live news API or RSS feed.
- **Custom Dashboards/User Accounts:** (Long-term) Allow users to create and save their own dashboard layouts and indicator sets.
* Begin work on the PDF report generation engine.