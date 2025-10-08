# Project Readme

This document provides a comprehensive overview of the project, its structure, and the purpose of each file.

## Project Overview

This is a Next.js application built with TypeScript that simulates a desktop operating system environment. It utilizes a variety of libraries to create a rich, interactive user experience, including:

*   **UI Components:** Radix UI and shadcn/ui for a set of accessible and customizable UI components.
*   **Forms:** React Hook Form and Zod for robust form management and validation.
*   **Animations:** Framer Motion for smooth animations and transitions.
*   **Data Visualization:** Recharts for creating charts.
*   **Narrative:** InkJS for creating branching, interactive stories.
*   **State Management:** React Context is used for global state management, particularly for user profiles.

The project is structured to separate concerns, with distinct directories for pages, components, context, hooks, and various libraries.

## File-by-File Breakdown

### `src` Directory

The `src` directory contains the core application code.

#### `app` Directory

This directory contains the main application pages and global styles, following the Next.js App Router structure.

*   `layout.tsx`: The root layout of the application. It sets up the HTML structure, includes global fonts, and wraps the application in the `UserProfileProvider`.
*   `page.tsx`: The main entry point of the application. It manages the application's state (booting, login, desktop) and renders the appropriate component based on the current state.
*   `globals.css`: Global CSS styles, including Tailwind CSS directives and theme variables for colors, radius, etc., using HSL values for easy customization.
*   `favicon.ico`: The application's favicon.

#### `components` Directory

This directory contains the application's React components.

*   `boot-screen.tsx`: The initial loading screen component displayed when the application starts.
*   `debug-overlay.tsx`: An overlay that displays debugging information, such as `localStorage` contents, active user profile data, and set flags.
*   `desktop.tsx`: The main desktop component, which acts as the user's workspace. It renders the desktop background, app icons, and manages open application windows.
*   `login-screen.tsx`: The user login and profile creation screen. It displays existing profiles and allows users to create new ones.
*   `profile-card.tsx`: A component that displays a user's profile picture and username, used on the `LoginScreen`.

##### `desktop` Directory

This directory contains components specific to the desktop view.

*   `app-icon.tsx`: A component for an application icon on the desktop.
*   `media-player.tsx`: A small, floating media player that appears when a track is played from the Music app.
*   `taskbar-clock.tsx`: A simple clock component displayed in the taskbar.
*   `taskbar.tsx`: The taskbar at the bottom of the desktop, showing user info, system controls, and the clock.
*   `volume-control.tsx`: A popover-based volume slider accessible from the taskbar.

###### `apps` Directory

This directory contains the components for the various "applications" that can be opened on the virtual desktop.

*   `chatcord.tsx`: An interactive story player application that uses InkJS to render branching narratives. It allows users to select from available story "scenes".
*   `ehmazon.tsx`: A mock e-commerce application that displays a grid of products.
*   `likestagram.tsx`: A mock social media feed that displays a series of posts. It passes a handler to open user profiles.
*   `likestagram-post.tsx`: A component for a single post in the Likestagram app, including like functionality.
*   `likestagram/profile.tsx`: Displays a user's profile page within the Likestagram app, showing their posts.
*   `music.tsx`: A music player application that lists available songs.
*   `profile.tsx`: An application that allows the active user to edit their profile details, including username, description, and avatar.
*   `settings.tsx`: A settings application for customizing the desktop experience, such as changing the background.
*   `terminal.tsx`: A functional terminal application that accepts and executes a variety of commands.

##### `ui` Directory

This directory contains the UI components, most of which are from `shadcn/ui`, providing the building blocks for the application's interface. It includes common elements like `button`, `card`, `dialog`, `input`, etc., as well as more complex components like `chat`, `chart`, and `sidebar`.

*   `color-picker.tsx`: A component for picking colors, used in the settings for background customization.
*   `color-popover.tsx`: A popover content component for selecting solid colors, gradients, or a URL for the background.
*   `window-close-button.tsx`: A specialized close button for application windows (dialogs).
*   `window-nav-buttons.tsx`: Navigation buttons (back/forward) for application windows.

#### `context` Directory

This directory contains React contexts for global state management.

*   `user-profile-context.tsx`: Provides the `useUserProfile` hook's state (profiles, active profile, and management functions) to the entire application.

#### `hooks` Directory

This directory contains the application's custom React hooks.

*   `use-mobile.tsx`: A hook for detecting if the user is on a mobile device based on screen width.
*   `use-toast.ts`: A hook for programmatically displaying toast notifications.
*   `use-user-profile.ts`: A critical hook that manages all user profile data, including creating, reading, updating, and deleting profiles from `localStorage`. It also handles XP, money, and the flag system.

#### `lib` Directory

This directory contains the application's libraries, utility functions, and static data.

*   `event-manager.ts`: A singleton event emitter/listener for decoupled communication between components.
*   `flag-actions.ts`: Contains the callback functions that are executed when flags are set or removed.
*   `flag-types.ts`: TypeScript type definitions for the flag system.
*   `flags-manager.ts`: The core class for managing the flag system. It processes triggers, evaluates dependencies, and applies flags to the user profile.
*   `flags.json`: A JSON file defining all available flags, their triggers, durations, and associated actions.
*   `leveling.ts`: Utility functions for calculating a user's level and XP progress.
*   `likestagram.json`: Static JSON data for the users and posts in the Likestagram app.
*   `likestagram.ts`: Loads and processes the `likestagram.json` data, linking users and images to posts.
*   `music.json`: Static JSON data for the songs in the Music app.
*   `music.ts`: Loads and processes the `music.json` data.
*   `placeholder-images.json`: A central JSON file containing definitions for all placeholder and static images used in the app.
*   `placeholder-images.ts`: Loads the `placeholder-images.json` data for use in the application.
*   `products.ts`: Loads and processes product data from the `products` directory.
*   `scene-manager.ts`: Manages loading and providing interactive story scenes to the ChatCord app.
*   `scene-types.ts`: TypeScript type definitions for story scenes.
*   `utils.ts`: General utility functions, including `cn` for merging Tailwind classes and a hostname validator.

##### `products` Directory

This directory contains JSON files, each representing a single product for the Ehmazon app.

##### `story` Directory

This directory contains the InkJS story files.

*   `*.ink.json`: Compiled JSON files from Ink stories, which define the narrative content.
*   `scenes.ts`: Defines the metadata for each story scene, such as title, description, and avatar.

##### `terminal` Directory

This directory contains the implementation for the terminal commands.

*   `index.ts`: Exports all available commands.
*   `types.ts`: TypeScript types for the terminal commands.
*   Other files (`about.tsx`, `cheat.ts`, etc.): Each file defines a single command, its name, description, and execution logic.

### Other Root Files

*   `apphosting.yaml`: Configuration for Firebase App Hosting.
*   `components.json`: Configuration for `shadcn/ui`.
*   `next.config.ts`: Configuration for Next.js, including image remote patterns and webpack modifications.
*   `package.json`: The project's dependencies and scripts.
*   `postcss.config.mjs`: Configuration for PostCSS.
*   `tailwind.config.ts`: Configuration for Tailwind CSS, including custom fonts, colors, and animations.
*   `tsconfig.json`: Configuration for TypeScript.
