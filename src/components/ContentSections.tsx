import React from "react";
import BlogSection from "./BlogSection";
import { KakaoAdfitBanner } from "./KakaoAdfitBanner";

/**
 * ContentSections Component
 *
 * Renders the main content sections of the JSONtapose application, including:
 * - How to Use guide
 * - JSON Best Practices
 * - Common Use Cases
 * - FAQ section
 * - Blog section
 *
 * Features:
 * - Responsive grid layouts
 * - Interactive FAQ accordion
 * - Anchor links for navigation
 * - Semantic HTML structure
 * - Consistent styling with theme support
 */
const ContentSections: React.FC = () => {
  return (
    <div className="space-y-8 mt-20 text-left">
      <KakaoAdfitBanner />
      {/* How to Use Section - Provides step-by-step instructions for using JSONtapose */}
      <section id="how-to-use" className="bg-base-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">
          <a href="#how-to-use" className="hover:text-primary">
            How to Use JSONtapose
          </a>
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-left">
              JSON Comparison
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-left">
              <li>Paste your original JSON data in the left panel</li>
              <li>Paste the modified JSON data in the right panel</li>
              <li>Click the "Compare JSON" button to analyze differences</li>
              <li>Review the highlighted changes in the comparison view</li>
              <li>Use the context controls to adjust the view</li>
            </ol>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3 text-left">
              Tree Viewer
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-left">
              <li>Navigate to the TreeViewer tab</li>
              <li>Paste your JSON data in the input panel</li>
              <li>View the interactive tree structure automatically</li>
              <li>Expand/collapse nodes to explore your data</li>
              <li>Use the Beautify button to format your JSON</li>
            </ol>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3 text-left">
            Tips & Tricks
          </h3>
          <ul className="list-disc list-inside space-y-1 text-left grid md:grid-cols-2">
            <li>Use the Beautify button to format messy JSON</li>
            <li>Try the example data to see how features work</li>
            <li>Adjust context lines to see more or less surrounding code</li>
            <li>
              Switch themes for better visibility in different environments
            </li>
            <li>All processing happens locally - your data stays private</li>
            <li>Copy formatted JSON directly from the tree viewer</li>
          </ul>
        </div>
      </section>

      {/* JSON Best Practices Section - Guidelines for effective JSON usage */}
      <section id="best-practices" className="bg-base-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">
          <a href="#best-practices" className="hover:text-primary">
            JSON Best Practices
          </a>
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-left">Structure</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-left">
              <li>Use consistent naming conventions</li>
              <li>Keep nesting levels reasonable</li>
              <li>Group related data together</li>
              <li>Use arrays for lists of similar items</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3 text-left">
              Performance
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-left">
              <li>Minimize deeply nested structures</li>
              <li>Use appropriate data types</li>
              <li>Avoid redundant data</li>
              <li>Consider compression for large files</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3 text-left">Validation</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-left">
              <li>Always validate JSON syntax</li>
              <li>Use schema validation when possible</li>
              <li>Handle missing or null values</li>
              <li>Test with edge cases</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Use Cases Section - Common scenarios and applications */}
      <section id="use-cases" className="bg-base-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">
          <a href="#use-cases" className="hover:text-primary">
            Common Use Cases
          </a>
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-left">
              Development
            </h3>
            <ul className="list-disc list-inside space-y-2 text-left">
              <li>
                <strong>API Response Comparison:</strong> Compare API responses
                before and after changes
              </li>
              <li>
                <strong>Configuration Management:</strong> Track changes in
                config files
              </li>
              <li>
                <strong>Data Migration:</strong> Verify data transformations
              </li>
              <li>
                <strong>Testing:</strong> Compare expected vs actual test
                results
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3 text-left">
              Data Analysis
            </h3>
            <ul className="list-disc list-inside space-y-2 text-left">
              <li>
                <strong>Database Changes:</strong> Track schema or data
                modifications
              </li>
              <li>
                <strong>Version Control:</strong> Review JSON file changes in
                repositories
              </li>
              <li>
                <strong>Data Quality:</strong> Identify inconsistencies in
                datasets
              </li>
              <li>
                <strong>Backup Verification:</strong> Ensure backup integrity
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ Section - Interactive accordion with common questions */}
      <section id="faq" className="bg-base-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">
          <a href="#faq" className="hover:text-primary">
            Frequently Asked Questions
          </a>
        </h2>
        <div className="space-y-4">
          <div className="collapse collapse-arrow bg-base-100">
            <input type="radio" name="faq-accordion" defaultChecked />
            <div className="collapse-title text-lg font-medium">
              What file formats does JSONtapose support?
            </div>
            <div className="collapse-content">
              <p className="text-left">
                JSONtapose supports standard JSON format. You can paste JSON
                data directly into the text areas or use the example data to get
                started. The tool automatically validates your JSON syntax and
                provides helpful error messages if there are any issues.
              </p>
            </div>
          </div>

          <div className="collapse collapse-arrow bg-base-100">
            <input type="radio" name="faq-accordion" />
            <div className="collapse-title text-lg font-medium">
              How large can my JSON files be?
            </div>
            <div className="collapse-content">
              <p className="text-left">
                JSONtapose doesn't impose strict size limits on your JSON files.
                The tool can handle reasonably large JSON data efficiently. If
                you encounter any performance issues or problems with large
                files, please let us know by creating an issue on our GitHub
                repository or sending us an email - we'd love to improve the
                tool based on your feedback!
              </p>
            </div>
          </div>

          <div className="collapse collapse-arrow bg-base-100">
            <input type="radio" name="faq-accordion" />
            <div className="collapse-title text-lg font-medium">
              Is my data secure when using JSONtapose?
            </div>
            <div className="collapse-content">
              <p className="text-left">
                Absolutely! All JSON processing happens entirely in your
                browser. No data is ever sent to our servers or stored anywhere.
                Your JSON data never leaves your device, ensuring complete
                privacy and security. You can even use JSONtapose offline once
                the page is loaded.
              </p>
            </div>
          </div>

          <div className="collapse collapse-arrow bg-base-100">
            <input type="radio" name="faq-accordion" />
            <div className="collapse-title text-lg font-medium">
              Can I save or export my work?
            </div>
            <div className="collapse-content">
              <p className="text-left">
                You can copy the formatted JSON or comparison results directly
                from the interface. The beautified JSON can be copied from
                either the input panels or the tree viewer. For comparison
                results, you can select and copy the diff output to save your
                analysis.
              </p>
            </div>
          </div>

          <div className="collapse collapse-arrow bg-base-100">
            <input type="radio" name="faq-accordion" />
            <div className="collapse-title text-lg font-medium">
              Does JSONtapose work offline?
            </div>
            <div className="collapse-content">
              <p className="text-left">
                Yes! Once JSONtapose is loaded in your browser, it works
                completely offline. All processing happens locally, so you can
                use it without an internet connection. This makes it perfect for
                working with sensitive data or in environments with limited
                connectivity.
              </p>
            </div>
          </div>

          <div className="collapse collapse-arrow bg-base-100">
            <input type="radio" name="faq-accordion" />
            <div className="collapse-title text-lg font-medium">
              What's the difference between Compare and TreeViewer?
            </div>
            <div className="collapse-content">
              <p className="text-left">
                The Compare tool shows differences between two JSON objects
                side-by-side with highlighted changes, perfect for version
                control or API testing. The TreeViewer displays a single JSON
                object as an interactive, expandable tree structure, ideal for
                exploring complex data hierarchies and understanding JSON
                structure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* JSON Resources */}
      <section id="resources" className="bg-base-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">
          <a href="#resources" className="hover:text-primary">
            JSON Learning Resources
          </a>
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-left">
              Official Documentation
            </h3>
            <ul className="list-disc list-inside space-y-2 text-left">
              <li>
                <a
                  href="https://www.json.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-primary"
                >
                  JSON.org - Official JSON specification
                </a>
              </li>
              <li>
                <a
                  href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-primary"
                >
                  MDN JSON Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://tools.ietf.org/html/rfc7159"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-primary"
                >
                  RFC 7159 - JSON Data Interchange Format
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3 text-left">
              Related Resources
            </h3>
            <ul className="list-disc list-inside space-y-2 text-left">
              <li>
                <a
                  href="https://json-schema.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-primary"
                >
                  JSON Schema - Validation Standard
                </a>
              </li>
              <li>
                <a
                  href="https://stedolan.github.io/jq/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-primary"
                >
                  jq - Command-line JSON processor
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/topics/json"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-primary"
                >
                  GitHub JSON Projects - Open source JSON tools
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Blog Section - Latest updates and articles */}
      <BlogSection />
    </div>
  );
};

export default ContentSections;
