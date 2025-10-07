# LIK3 M3

Welcome to "LIK3 M3," an interactive, OS-like desktop experience built for the browser. This project, bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app), simulates a complete desktop environment, including a boot screen, login, and a variety of interactive applications.

## Features

- **OS-like Interface**: A fully-featured desktop environment with a taskbar, start menu, and draggable application windows.
- **User Profile System**: Create and switch between multiple user profiles, with all data saved locally in your browser.
- **Interactive Applications**: A suite of built-in applications, including:
    - **Likestagram**: A mock social media platform.
    - **Terminal**: A functional terminal with a variety of custom commands.
    - **Music**: A music player to listen to your favorite tunes.
    - **Ehmazon**: A simulated e-commerce experience.
    - **ChatCord**: A mock-up of a chat application.
- **Gamification**: An experience point (XP) and leveling system to reward user interaction.
- **Customizable**: A settings application to personalize your desktop experience.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [prompt-kit](https://github.com/ibelick/prompt-kit) for AI-powered UI components.
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: React Context with a custom `useUserProfile` hook for local persistence.
- **Story**: [Inkjs](https://github.com/y-lohse/inkjs) for interactive narrative elements.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js and npm installed on your machine.

### Installation

1. Clone the repository to your local machine.
2. Install NPM packages:
   ```sh
   npm install
   ```

### Running the Application

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

This application is configured for deployment on Firebase App Hosting. The `apphosting.yaml` file contains the necessary configuration for a seamless deployment.
