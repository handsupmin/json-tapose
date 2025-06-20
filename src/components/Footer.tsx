/**
 * Footer Component
 *
 * Renders the application footer with:
 * - Branding and logo
 * - External links (GitHub, Contact)
 * - Copyright information
 *
 * Features:
 * - Responsive layout
 * - Dynamic year update
 * - Social and contact links
 * - Consistent styling with theme support
 */
const Footer: React.FC = () => {
  // Get current year for copyright
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer footer-center p-4 mt-10 bg-base-300 text-base-content">
      {/* Main footer content with branding and links */}
      <div className="grid grid-flow-row gap-4 md:grid-flow-col">
        {/* Branding section with logo */}
        <aside className="flex items-center gap-2">
          <img src="/logo.svg" alt="JSONtapose Logo" className="h-5 w-5" />
          <p>
            <span className="font-bold">JSONtapose</span> - Secure JSON Comparison Tool
          </p>
        </aside>

        {/* External links section */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <a
            href="https://github.com/handsupmin/json-tapose"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
              className="mr-1"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
            GitHub
          </a>

          <a
            href="mailto:thstkdals0318@gmail.com"
            className="btn btn-sm btn-outline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
              className="mr-1"
            >
              <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
            </svg>
            Contact
          </a>
        </div>
      </div>

      {/* Copyright notice */}
      <div className="text-sm opacity-70" translate="no">
        © {currentYear} All Rights Reserved - handsupmin
      </div>
    </footer>
  );
};

export default Footer;
