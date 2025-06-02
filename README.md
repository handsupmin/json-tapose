# JSONtapose

<div align="center">
  <img src="public/logo.svg" alt="JSONtapose Logo" width="120" height="120">
</div>

> JSON + juxtapose

A modern, high-performance JSON comparison tool that displays differences between JSON objects in a side-by-side view.

![JSONtapose Screenshot](screenshots/screenshot.png)

## Features

- **Side-by-Side Comparison**: Clear visual comparison between old and new JSON versions
- **Performance Optimized**: Handles large JSON files efficiently with virtualization
- **Visual Difference Highlighting**: Color-coded changes for easy identification
- **Context-Aware Diff View**: Show only differences with configurable context lines
- **Complete JSON Display**: No abbreviation of objects or arrays
- **Deep Nested Structure Support**: Properly displays and compares nested objects and arrays
- **Theme Support**: Multiple themes including light and dark modes
- **Responsive Design**: Works on devices of all sizes

## Quick Start

```bash
# Clone repository
git clone https://github.com/handsupmin/json-tapose.git
cd json-tapose

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Usage

1. Enter or paste JSON in both panels
2. Click "Compare" to see the differences
3. Use the controls to:
   - Toggle between showing differences only (default) or all content
   - Adjust context lines around differences
   - Switch between different themes

## Technology

- **React 19**: Latest React version with performance improvements
- **TypeScript**: For type safety and better developer experience
- **TailwindCSS & daisyUI**: For styling and components
- **Virtualization**: Efficient rendering for large datasets
- **Context API**: For state management

## Project Structure

```
src/
├── components/     # React components
├── contexts/       # React Context for state management
├── hooks/          # Custom React hooks
├── types/          # TypeScript type definitions
└── utils/          # Utility functions including JSON comparison
```

## Key Optimizations

- **Component Composition**: Breaking down complex UI into focused components
- **Custom Hooks**: Separated logic for better reusability
- **Virtualized Rendering**: Only renders visible items in the viewport
- **Memoization**: Prevents unnecessary calculations and re-renders
- **Efficient Diff Algorithm**: Optimized JSON comparison with caching

## Development Guidelines

This project follows strict development guidelines to maintain code quality and consistency:

### Code Style

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Keep functions small and focused
- Use meaningful variable and function names

### Best Practices

- Document complex logic with comments
- Keep components pure and reusable
- Use proper error handling
- Follow React best practices and hooks guidelines

### English-Only Policy

- All code, comments, and documentation must be in English
- Variable and function names must be in English
- Commit messages must be in English
- Only user-facing text can be localized

## Contributing

1. Fork the repo
2. Create a branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes
4. Open a Pull Request
5. Read [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines

## License

This project is licensed under the MIT License.
