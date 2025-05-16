# JSONtapose

<div align="center">
  <img src="public/logo.svg" alt="JSONtapose Logo" width="120" height="120">
</div>

> JSON + juxtapose

A modern JSON comparison tool that displays differences between two JSON objects in a side-by-side view, similar to traditional text file diff tools.

![JSONtapose Screenshot](screenshots/screenshot.png)

## Features

- **Side-by-Side Comparison**: Clear visual comparison between old and new JSON versions
- **Line-by-Line Viewing**: Each JSON property is displayed on its own line
- **Independent Line Numbers**: Each panel maintains its own line counting
- **Visual Difference Highlighting**:
  - Red for removed content (left panel)
  - Green for added content (right panel)
  - Diagonal patterns for placeholder cells (missing content)
- **Complete JSON Display**: No abbreviation of objects or arrays
- **Intuitive UI**: Clean interface makes differences immediately apparent
- **Theme Support**: Automatically adapts to light and dark themes

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- pnpm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/handsupmin/json-tapose.git
   cd json-tapose
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Enter or paste your "old" JSON in the left input
2. Enter or paste your "new" JSON in the right input
3. Click "Compare" to see the differences
4. The comparison view will show:
   - Matching properties in normal text
   - Added properties in green
   - Removed properties in red
   - Empty diagonal-patterned cells for missing properties

## Technology Stack

- **React**: UI components
- **TypeScript**: Type safety
- **Vite**: Build system
- **TailwindCSS**: Styling
- **daisyUI**: UI components
- **React Hooks**: State management

## Project Structure

```
├── public/             # Static assets
├── src/
│   ├── components/     # React components
│   │   ├── Header.tsx            # App header
│   │   ├── Footer.tsx            # App footer
│   │   ├── JsonInputPanel.tsx    # JSON input panels
│   │   └── JsonDiffView.tsx      # Main diff view component
│   ├── utils/          # Utility functions
│   │   └── jsonUtils.ts          # JSON diff calculation logic
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Entry point
└── ...
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by traditional text diff tools
- Built with React and TypeScript
- Styled with TailwindCSS and daisyUI
