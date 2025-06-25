/**
 * Get the default theme based on browser's preferred color scheme
 */
export const getDefaultTheme = (): string => {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    return "light";
  }

  // Check user's system preference
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
};

export const defaultTheme = getDefaultTheme();

export const themeOptions = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "pastel", label: "Pastel" },
  { value: "dracula", label: "Dracula" },
  { value: "corporate", label: "Corporate" },
  { value: "purplewind", label: "PurpleWind" },
  { value: "emerald", label: "Emerald" },
  { value: "retro", label: "Retro" },
  { value: "winter", label: "Winter" },
  { value: "night", label: "Night" },
  { value: "lofi", label: "Lofi" },
  { value: "synthwave", label: "Synthwave" },
  { value: "fantasy", label: "Fantasy" },
  { value: "luxury", label: "Luxury" },
  { value: "wireframe", label: "Wireframe" },
  { value: "cyberpunk", label: "Cyberpunk" },
];
