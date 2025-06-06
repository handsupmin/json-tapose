# JSONtapose Technical Specification

## Overview

JSONtapose is a high-performance visualization tool for comparing JSON objects with an optimized rendering engine that handles large datasets efficiently.

## Core Features

### 1. Visualization Engine

- Side-by-side comparison with synchronized scrolling
- Virtualized rendering for performance with large JSON files
- Dynamic context-aware diff view with configurable context lines
- "Diff Only" mode enabled by default for performance and clarity
- Full-width background styling during horizontal scrolling
- Recursive processing of nested JSON structures for complete diffing
- Advanced scroll synchronization with virtualized component support

### 2. Difference Highlighting

- Color-coded visualization:
  - Added (green)
  - Removed (red)
  - Changed (amber)
  - Unchanged (default text color)
- Diagonal pattern for placeholder elements (missing content)
- Consistent background colors that span the entire width regardless of scroll position
- Properly indented nested structures with inheritance of parent change types

### 3. Performance Optimizations

- Virtualization: Only renders elements within viewport
- Memoization: Caches expensive operations and prevents re-renders
- Efficient diffing algorithm with result caching
- Code splitting through component composition
- Default "Diff Only" mode reduces initial rendering load

## Implementation Architecture

### Component Structure

- Atomic design approach with focused, single-responsibility components
- Component composition for complex UI patterns
- Custom hooks separated by functionality:
  - `useSimpleValueRenderer`: Handles value rendering logic
  - `useLineNumberCalculator`: Manages line number calculation
  - `usePropertyProcessors`: Processes JSON properties
  - `useDiffFilter`: Filters content based on diff settings
  - `useDiffProcessor`: Orchestrates the diff process
  - `useSyncedScroll`: Synchronizes scrolling between panels

### Data Flow

1. JSON input → Parse and validate
2. Generate diff data structure with `compareJson`
3. Process diff data into line-by-line representation
4. Apply virtualization and rendering optimizations
5. Render diff view with appropriate styling

### Key Data Structures

- `JsonDiffItem`: Represents a difference between JSON objects
- `DiffLine`: Represents a line in the diff view with all necessary metadata
- `ProcessedDiffLines`: Contains processed lines ready for rendering

## Development Requirements

### Code Standards

- Follow Toss Frontend Rules for code structure and patterns
- Component abstraction for reusable UI elements
- Naming patterns for consistent code organization
- Magic numbers should be replaced with named constants
- Complex boolean expressions should use named variables for clarity

### English-Only Policy

All project code and documentation must be written in English:

- Source code (variable names, function names, class names)
- Comments and JSDoc documentation
- Commit messages and pull request descriptions
- Issue descriptions and discussions
- All specification and documentation files

This maintains consistency and ensures global collaboration. Non-English should only appear in content intended for localization.

## Technical Requirements

- React 19 with TypeScript for type safety
- Context API for state management
- TailwindCSS and daisyUI for styling
- Responsive design with mobile support
- Standard web accessibility support

## Performance Targets

- Handle JSON files up to 10MB with smooth scrolling
- Render time under 1 second for typical use cases
- 60fps scrolling performance
