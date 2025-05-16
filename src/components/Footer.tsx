const Footer: React.FC = () => {
  return (
    <footer className="footer footer-center p-4 bg-base-300 text-base-content">
      <aside className="flex items-center gap-2">
        <img src="/logo.svg" alt="JSONtapose Logo" className="h-5 w-5" />
        <p>
          <span className="font-bold">JSONtapose</span> - Modern JSON Comparison
          Tool
        </p>
      </aside>
    </footer>
  );
};

export default Footer;
