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
    * Edit `.env` to configure backend settings (e.g., port).

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
    The frontend should start on a different port (defaulting to 5173 for Vite or 3000 for create-react-app).

Open your browser to the frontend address (e.g., `http://localhost:5173` or `http://localhost:3000`). You should see the basic dashboard layout with placeholder cards.

## Data Sources (To Be Connected)

* **FRED:** Macroeconomic data
* **Alpha Vantage:** Market data (indices, stocks - free tier limitations)
* **IEX Cloud:** Stock data (free tier limitations)
* **CoinGecko:** Crypto data
* **Trading Economics:** Free endpoints for various indicators
* **Yahoo Finance:** Via scraping (carefully, respecting terms)
* **Quandl:** Specific datasets

Connecting these APIs and implementing data fetching will be covered in subsequent phases.

## Next Steps

* Implement data fetching logic in the backend controllers and services, connecting to external APIs.
* Pass data from the backend to the frontend.
* Replace placeholder components with actual data displays and charts using a charting library (e.g., Plotly.js).
* Begin work on the PDF report generation engine.