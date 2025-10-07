# Project Readme

This document provides a comprehensive overview of the project, its structure, and the purpose of each file.

## Project Overview

This is a Next.js application built with TypeScript. It utilizes a variety of libraries to create a rich user experience, including:

*   **UI Components:** Radix UI and shadcn/ui for a set of accessible and customizable UI components.
*   **Forms:** React Hook Form for managing forms.
*   **Animations:** Framer Motion for animations.
*   **Data Visualization:** Recharts for creating charts.
*   **Narrative:** InkJS for creating interactive stories.

The project is structured to separate concerns, with distinct directories for components, context, hooks, and libraries.

## File-by-File Breakdown

### `src` Directory

The `src` directory contains the core application code.

#### `app` Directory

This directory contains the main application pages and layouts.

*   `layout.tsx`: The main layout of the application.
*   `page.tsx`: The main page of the application.
*   `globals.css`: Global CSS styles.
*   `favicon.ico`: The application's favicon.

#### `components` Directory

This directory contains the application's React components.

*   `boot-screen.tsx`: The boot screen component.
*   `debug-overlay.tsx`: A debug overlay component.
*   `desktop.tsx`: The main desktop component.
*   `login-screen.tsx`: The login screen component.
*   `profile-card.tsx`: A profile card component.

##### `desktop` Directory

This directory contains components specific to the desktop view.

*   `app-icon.tsx`: An application icon component.
*   `media-player.tsx`: A media player component.
*   `taskbar-clock.tsx`: A taskbar clock component.
*   `taskbar.tsx`: The taskbar component.
*   `volume-control.tsx`: A volume control component.

###### `apps` Directory

This directory contains the desktop applications.

*   `chatcord.tsx`: A chat application.
*   `ehmazon.tsx`: An e-commerce application.
*   `likestagram.tsx`: A social media application.
*   `likestagram-post.tsx`: A component for a single post in the social media application.
*   `music.tsx`: A music player application.
*   `profile.tsx`: A user profile application.
*   `settings.tsx`: A settings application.
*   `terminal.tsx`: A terminal application.

##### `ui` Directory

This directory contains the UI components, many of which are from shadcn/ui.

*   `accordion.tsx`: An accordion component.
*   `alert-dialog.tsx`: An alert dialog component.
*   `alert.tsx`: An alert component.
*   `avatar.tsx`: An avatar component.
*   `badge.tsx`: A badge component.
*   `button.tsx`: A button component.
*   `calendar.tsx`: A calendar component.
*   `card.tsx`: A card component.
*   `carousel.tsx`: A carousel component.
*   `chart.tsx`: A chart component.
*   `chat.tsx`: A chat component.
*   `checkbox.tsx`: A checkbox component.
*   `code-block.tsx`: A code block component.
*   `collapsible.tsx`: A collapsible component.
*   `dialog.tsx`: A dialog component.
*   `dropdown-menu.tsx`: A dropdown menu component.
*   `form.tsx`: A form component.
*   `input.tsx`: An input component.
*   `label.tsx`: A label component.
*   `markdown.tsx`: A markdown component.
*   `menubar.tsx`: A menubar component.
*   `message.tsx`: A message component.
*   `popover.tsx`: A popover component.
*   `progress.tsx`: A progress bar component.
*   `prompt-suggestion.tsx`: A prompt suggestion component.
*   `radio-group.tsx`: A radio group component.
*   `scroll-area.tsx`: A scroll area component.
*   `select.tsx`: A select component.
*   `separator.tsx`: A separator component.
*   `sheet.tsx`: A sheet component.
*   `sidebar.tsx`: A sidebar component.
*   `skeleton.tsx`: A skeleton component.
*   `slider.tsx`: A slider component.
*   `switch.tsx`: A switch component.
*   `table.tsx`: A table component.
*   `tabs.tsx`: A tabs component.
*   `textarea.tsx`: A textarea component.
*   `toast.tsx`: A toast component.
*   `toaster.tsx`: A toaster component.
*   `tooltip.tsx`: A tooltip component.
*   `window-close-button.tsx`: A window close button component.
*   `window-nav-buttons.tsx`: Window navigation buttons component.

#### `context` Directory

This directory contains the application's React contexts.

*   `user-profile-context.tsx`: A context for managing the user's profile.

#### `hooks` Directory

This directory contains the application's custom React hooks.

*   `use-mobile.tsx`: A hook for detecting mobile devices.
*   `use-toast.ts`: A hook for displaying toasts.
*   `use-user-profile.ts`: A hook for accessing the user's profile.

#### `lib` Directory

This directory contains the application's libraries and utility functions.

*   `event-manager.ts`: An event manager.
*   `flag-actions.ts`: Functions for managing flags.
*   `flag-types.ts`: Types for flags.
*   `flags-manager.ts`: A manager for flags.
*   `flags.json`: A JSON file with flag definitions.
*   `leveling.ts`: Functions for managing user leveling.
*   `likestagram.json`: A JSON file with data for the Likestagram app.
*   `likestagram.ts`: Functions for the Likestagram app.
*   `music.json`: A JSON file with data for the Music app.
*   `music.ts`: Functions for the Music app.
*   `placeholder-images.json`: A JSON file with placeholder images.
*   `placeholder-images.ts`: Functions for managing placeholder images.
*   `products.ts`: Functions for managing products.
*   `scene-manager.ts`: A manager for scenes.
*   `scene-types.ts`: Types for scenes.
*   `utils.ts`: Utility functions.

##### `products` Directory

This directory contains JSON files with product data.

*   `chrono-smartwatch.json`: Data for the Chrono Smartwatch.
*   `noise-away-headphones.json`: Data for the Noise-Away Headphones.
*   `sky-high-drone.json`: Data for the Sky-High Drone.
*   `virtusphere-vr.json`: Data for the VirtuSphere VR.

##### `story` Directory

This directory contains the InkJS story files.

*   `new_user_introduction.ink.json`: The new user introduction story.
*   `pixel_pioneer_superfan_chat.ink.json`: A chat with a superfan.
*   `scenes.ts`: Functions for managing story scenes.
*   `story-1.ink.json`: The first part of the story.
*   `story-2.ink.json`: The second part of the story.

##### `terminal` Directory

This directory contains the terminal commands.

*   `about.tsx`: The "about" command.
*   `cheat.ts`: The "cheat" command.
*   `clear.ts`: The "clear" command.
*   `debug.ts`: The "debug" command.
*   `help.tsx`: The "help" command.
*   `index.ts`: The main terminal file.
*   `test.ts`: The "test" command.
*   `types.ts`: Types for the terminal.
*   `whoami.ts`: The "whoami" command.

### Other Files

*   `apphosting.yaml`: Configuration for Firebase App Hosting.
*   `components.json`: Configuration for shadcn/ui.
*   `next.config.ts`: Configuration for Next.js.
*   `package.json`: The project's dependencies and scripts.
*   `postcss.config.mjs`: Configuration for PostCSS.
*   `tailwind.config.ts`: Configuration for Tailwind CSS.
*   `tsconfig.json`: Configuration for TypeScript.

