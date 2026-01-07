# SIMS Chatbot (SmartCare Bot)

## Project Overview
This project contains the **SmartCare Bot**, a modern web-based chatbot application built with Next.js. It allows users to interact with a smart care assistant interface.

## Tech Stack
The project is built using the following technologies:

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** 
  - [Radix UI](https://www.radix-ui.com/) (Primitives for accessible components)
  - [Lucide React](https://lucide.dev/) (Icons)
  - [Sonner](https://sonner.emilkowal.ski/) (Toast notifications)
- **Animation:** Motion
- **Package Manager:** npm (node package manager)

## Project Structure
The project source code is located in the `smartcare-bot` directory.

```
SIMSChatbot/
├── smartcare-bot/       # Main application source code
│   ├── app/             # App Router pages and layouts
│   ├── components/      # Reusable React components
│   ├── lib/             # Utility functions and library configurations
│   ├── public/          # Static assets (images, fonts, etc.)
│   ├── package.json     # Project dependencies and scripts
│   ├── next.config.ts   # Next.js configuration
│   └── tsconfig.json    # TypeScript configuration
└── README.md            # Project documentation (this file)
```

## Setup Instructions

### Prerequisites
- Node.js (Latest LTS recommended)
- npm (comes with Node.js)

### Installation

1. Navigate to the project directory:
   ```bash
   cd smartcare-bot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Building for Production

To build the application for production:
```bash
npm run build
```

To start the production server:
```bash
npm start
```

## Linting
To run the linter:
```bash
npm run lint
```