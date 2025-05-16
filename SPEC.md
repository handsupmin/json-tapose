# JSONtapose Specification

## Overview

JSONtapose is a visual JSON comparison tool that displays differences between two JSON objects in a line-by-line, side-by-side view similar to traditional text file comparison tools.

## Core Features

### 1. Side-by-Side Comparison View

- Two panels showing "Old Version" (left) and "New Version" (right)
- Independent line numbering for each panel
- Panel-level vertical scrolling

### 2. JSON Difference Visualization

- Color-coded differences:
  - Red: Removed content (left panel)
  - Green: Added content (right panel)
  - Black/Default: Unchanged content

### 3. Placeholder Visualization

- Empty cells with diagonal striped pattern to represent:
  - Fields that exist in one JSON but not the other
  - Properties with no corresponding match in the other JSON
- Placeholders maintain the same height as their corresponding content
- No line numbers assigned to placeholder lines

### 4. Complete JSON Structure Display

- Shows complete JSON objects/arrays instead of abbreviated versions
- Preserves proper indentation and hierarchy
- Proper opening/closing brackets and commas
- No content truncation

## Implementation Details

### Diff Line Types

Each line in the comparison is assigned one of these types:
- `unchanged`: Content that exists in both versions with the same value
- `added`: Content that exists only in the new version
- `removed`: Content that exists only in the old version
- `changed`: Content that exists in both versions but with different values
- `header`: Special lines like opening/closing brackets of the root object
- `placeholder`: Empty cells representing missing content

### Line Representation

Each line has the following attributes:
- `content`: The actual text content of the line
- `type`: The difference type (see above)
- `indentLevel`: The indentation level for proper hierarchy display
- `isOpening`: Whether the line contains an opening bracket
- `isClosing`: Whether the line contains a closing bracket
- `isComma`: Whether the line has a trailing comma

### Visual Design

- Fixed-width line number columns
- Line numbers are sequential (skipping placeholders)
- Independent line counting in each panel
- Diagonal striped pattern for placeholder cells using CSS linear gradients
- Automatic theme adaptation using daisyUI CSS variables
- Support for both light and dark themes

### Processing Algorithm

1. Input: Array of `JsonDiffItem` objects representing the differences
2. Process: Convert differences into line-by-line representation
3. Output: Two arrays of `DiffLine` objects for left and right panels

## Technical Requirements

- React component-based implementation
- TypeScript for type safety
- daisyUI/Tailwind CSS for styling
- Responsive design that works on various screen sizes

## Accessibility

- Proper color contrast ratios for differences
- Semantic HTML structure
- Support for keyboard navigation
