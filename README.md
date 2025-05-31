# Tax Scenarios Analyzer MVP

A tool for analyzing and comparing different tax scenarios across various locations, helping users make informed decisions about their financial planning.

## Features

- Compare tax scenarios across different locations
- Analyze capital gains tax implications
- Evaluate qualitative factors affecting relocation decisions
- Track and manage multiple scenarios
- Share and collaborate on tax plans

## Developer Setup

### Prerequisites

- Node.js (v20.x or LTS)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd tax-scenarios-lean
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

To start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

To create a production build:
```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

- `src/` - Source code
  - `app/` - Application entry points and routing
  - `components/` - React components
  - `data/` - Static data and configurations
  - `models/` - TypeScript interfaces and types
  - `services/` - Business logic and data services
  - `store/` - State management
  - `styles/` - Global styles and Tailwind configuration
- `docs/` - Project documentation
- `research/` - Research data and findings
- `prompts/` - AI prompts for data generation

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI
- Zustand (State Management)
- React Router DOM
