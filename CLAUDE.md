# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a minimal Next.js project with TypeScript that has been simplified to contain only a Hello World application. The project structure is clean and focused on basic Next.js functionality.

## Development Commands

- `npm run dev` - Start development server (runs on all interfaces with 0.0.0.0)
- `npm run build` - Build the application for production
- `npm start` - Start production server

## Architecture

### Core Structure
- **Next.js App Router**: Uses the modern `src/app/` directory structure
- **TypeScript**: Configured with strict mode and path aliases (`@/*` maps to `./src/*`)
- **Styling**: Simple CSS with basic global styles for centered Hello World display

### Key Files
- `src/app/page.tsx` - Main page component with Hello World
- `src/app/layout.tsx` - Root layout with minimal metadata
- `src/app/globals.css` - Global styles with centered layout
- `next.config.js` - Next.js configuration with image optimization settings
- `tsconfig.json` - TypeScript configuration with path aliases

### Additional Components
- `figma-for-ai-example.tsx` - Complex React component example with D3.js integration for AI flow visualization (not currently used in the app)

## Development Notes

- Project uses npm for package management (package-lock.json present)
- No linting or formatting tools configured in current setup
- Image optimization is configured for external domains including Unsplash and same-assets.com
- TypeScript strict mode enabled with modern ES2017 target

## Language Requirements

**IMPORTANT**: This entire system must be developed exclusively in English. All code, comments, variable names, function names, component names, documentation, and user-facing text must be in English only.


# IMPORTANT
Do not make any changes until you are 95% confident about what needs to be built.
Ask questions until you are 95% confident.