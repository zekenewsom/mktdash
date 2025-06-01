# mktdash: Market Analytics Platform

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