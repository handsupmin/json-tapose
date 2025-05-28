import React from "react";

/**
 * Article type definition
 */
interface Article {
  title: string;
  excerpt: string;
  readTime: string;
  category: string;
  content: string;
}

/**
 * BlogSection Component
 *
 * Renders a collection of blog articles about JSON and JSONtapose usage.
 * Features:
 * - Article cards with titles, excerpts, and read times
 * - Category-based filtering
 * - Markdown content rendering
 * - Responsive grid layout
 * - Interactive article expansion
 *
 * Article Categories:
 * - Tutorial: Step-by-step guides and learning resources
 * - Troubleshooting: Common issues and solutions
 * - Advanced: Advanced techniques and best practices
 */
const BlogSection: React.FC = () => {
  // Article data with titles, excerpts, and full content
  const articles: Article[] = [
    {
      title: "Getting the Most Out of JSONtapose: A User's Guide",
      excerpt:
        "Discover advanced features and practical tips for using JSONtapose effectively in your development workflow.",
      readTime: "6 min read",
      category: "Tutorial",
      content: `
        JSONtapose is designed to make JSON comparison and visualization effortless. Whether you're debugging API responses, reviewing configuration changes, or exploring complex data structures, these tips will help you work more efficiently.

        ## Mastering the Compare Tool
        The comparison feature is perfect for:
        - **API Testing**: Compare expected vs actual API responses
        - **Configuration Management**: Track changes in JSON config files
        - **Data Migration**: Verify transformations are working correctly
        - **Code Reviews**: Quickly spot differences in JSON data

        ## TreeViewer Best Practices
        Use the TreeViewer when you need to:
        - **Explore Structure**: Understand complex nested JSON hierarchies
        - **Debug Data**: Quickly locate specific values in large objects
        - **Format JSON**: Clean up minified or poorly formatted JSON
        - **Validate Syntax**: Check for JSON errors with clear error messages

        ## Power User Tips
        - **Context Lines**: Adjust the context setting to see more or less surrounding code in comparisons
        - **Theme Switching**: Use dark mode for late-night debugging sessions
        - **Example Data**: Start with sample data to understand how features work
        - **Keyboard Navigation**: Use keyboard shortcuts to navigate through differences
        - **Copy Results**: Select and copy formatted JSON or comparison results

        ## Real-World Scenarios
        ### Scenario 1: API Version Comparison
        When updating an API, paste the old response in the left panel and the new response in the right panel. JSONtapose will highlight exactly what changed, making it easy to verify your updates.

        ### Scenario 2: Configuration Debugging
        If your application isn't behaving as expected, compare your current config with a known working version. The visual diff will quickly show what settings have changed.

        ### Scenario 3: Data Structure Exploration
        When working with unfamiliar JSON data, use the TreeViewer to expand and collapse sections, making it easy to understand the data hierarchy without getting overwhelmed.
      `,
    },
    {
      title: "Understanding JSON: A Complete Guide for Developers",
      excerpt:
        "Learn the fundamentals of JSON, its syntax, data types, and best practices for modern web development.",
      readTime: "8 min read",
      category: "Tutorial",
      content: `
        JSON (JavaScript Object Notation) is a lightweight, text-based data interchange format that's easy for humans to read and write. Despite its name suggesting a connection to JavaScript, JSON is language-independent and widely used across different programming languages.

        ## What is JSON?
        JSON is built on two structures:
        - A collection of name/value pairs (similar to objects, dictionaries, or hash tables)
        - An ordered list of values (similar to arrays or lists)

        ## JSON Syntax Rules
        - Data is in name/value pairs
        - Data is separated by commas
        - Curly braces hold objects
        - Square brackets hold arrays
        - Strings must be in double quotes

        ## Common Use Cases
        1. **API Communication**: REST APIs commonly use JSON for data exchange
        2. **Configuration Files**: Many applications use JSON for configuration
        3. **Data Storage**: NoSQL databases often store data in JSON format
        4. **Web Applications**: AJAX requests frequently use JSON

        ## Best Practices
        - Use consistent naming conventions (camelCase or snake_case)
        - Keep nesting levels reasonable (max 3-4 levels)
        - Validate JSON structure before processing
        - Handle null values appropriately
        - Use meaningful property names
      `,
    },
    {
      title: "Debugging JSON Like a Pro: Common Issues and Solutions",
      excerpt:
        "Learn to identify and fix JSON problems quickly using JSONtapose's validation and visualization features.",
      readTime: "5 min read",
      category: "Troubleshooting",
      content: `
        JSON errors can be frustrating, but with the right approach and tools like JSONtapose, you can identify and fix them quickly. Here's how to tackle the most common JSON issues.

        ## Using JSONtapose for Error Detection
        JSONtapose provides instant feedback when your JSON has syntax errors:
        - **Real-time Validation**: See errors as you type
        - **Clear Error Messages**: Understand exactly what's wrong
        - **Visual Indicators**: Red highlighting shows problem areas
        - **Error Badges**: Click to dismiss error notifications

        ## Common JSON Syntax Errors

        ### 1. Missing or Extra Commas
        **Problem**: \`{"name": "John", "age": 30,}\` (trailing comma)
        **Solution**: Remove the comma after the last property
        **JSONtapose Help**: The validator will highlight the exact location of trailing commas

        ### 2. Unquoted Property Names
        **Problem**: \`{name: "John", age: 30}\`
        **Solution**: Always wrap property names in double quotes: \`{"name": "John", "age": 30}\`
        **JSONtapose Help**: Error message will point to the unquoted property

        ### 3. Single Quotes Instead of Double Quotes
        **Problem**: \`{'name': 'John'}\`
        **Solution**: JSON requires double quotes: \`{"name": "John"}\`
        **JSONtapose Help**: The TreeViewer won't render until quotes are fixed

        ### 4. Unescaped Special Characters
        **Problem**: \`{"message": "He said "Hello""}\`
        **Solution**: Escape quotes: \`{"message": "He said \\"Hello\\""}\`
        **JSONtapose Help**: Syntax highlighting will show string termination issues

        ## Debugging Strategies with JSONtapose

        ### Start with the TreeViewer
        1. Paste your JSON into the TreeViewer
        2. If it doesn't render, check the error message
        3. Fix syntax errors one by one
        4. Use the Beautify button to format correctly

        ### Compare Working vs Broken JSON
        1. Find a similar working JSON structure
        2. Use the Compare tool to see differences
        3. Identify patterns in the working version
        4. Apply the same structure to your broken JSON

        ### Use Example Data as Reference
        - Click "Try Example" to see properly formatted JSON
        - Compare your data structure with the examples
        - Learn from the formatting and structure patterns

        ## Prevention Tips
        - Always validate JSON before using it in production
        - Use JSONtapose's real-time validation during development
        - Keep a reference of working JSON structures
        - Test with the TreeViewer to ensure proper nesting
        - Use the Beautify feature to maintain consistent formatting
      `,
    },
    {
      title: "Common JSON Validation Errors and How to Fix Them",
      excerpt:
        "Identify and resolve the most frequent JSON syntax errors that developers encounter.",
      readTime: "5 min read",
      category: "Troubleshooting",
      content: `
        JSON validation errors can be frustrating, but they're usually easy to fix once you know what to look for. Here are the most common issues and their solutions.

        ## 1. Missing or Extra Commas
        **Error**: Unexpected token ',' or missing comma
        **Solution**: Check for trailing commas or missing commas between elements

        ## 2. Unquoted Property Names
        **Error**: Unexpected token
        **Solution**: Always wrap property names in double quotes

        ## 3. Single Quotes Instead of Double Quotes
        **Error**: Unexpected token '
        **Solution**: JSON requires double quotes for strings

        ## 4. Trailing Commas
        **Error**: Unexpected token }
        **Solution**: Remove commas after the last element in objects or arrays

        ## 5. Unescaped Characters
        **Error**: Unterminated string
        **Solution**: Escape special characters like quotes, backslashes, and newlines

        ## 6. Invalid Number Formats
        **Error**: Unexpected number
        **Solution**: Ensure numbers follow JSON number format (no leading zeros, proper decimal notation)

        ## Validation Tools
        - Online JSON validators
        - IDE extensions and plugins
        - Command-line tools like jq
        - Programming language built-in parsers

        ## Prevention Tips
        - Use a good code editor with JSON syntax highlighting
        - Implement automated validation in your development workflow
        - Use JSON schema for structure validation
        - Test with various JSON validators
      `,
    },
    {
      title: "Advanced JSON Techniques: Schema Validation and More",
      excerpt:
        "Explore advanced JSON concepts including schema validation, JSON Path, and performance optimization.",
      readTime: "10 min read",
      category: "Advanced",
      content: `
        Beyond basic JSON usage, there are advanced techniques that can improve your data handling and application robustness.

        ## JSON Schema Validation
        JSON Schema provides a contract for your JSON data, ensuring it meets specific requirements.

        ### Benefits of JSON Schema
        - **Data Validation**: Ensure data integrity
        - **Documentation**: Self-documenting data structures
        - **Code Generation**: Generate types and classes
        - **API Documentation**: Describe API request/response formats

        ### Schema Example
        A schema defines the structure, data types, and constraints for your JSON data.

        ## JSON Path
        JSON Path allows you to query and extract data from JSON documents using a simple syntax.

        ### Common JSON Path Expressions
        - \`$\`: Root element
        - \`$.store.book[*]\`: All books in the store
        - \`$..price\`: All price elements
        - \`$.store.book[?(@.price < 10)]\`: Books cheaper than $10

        ## Performance Optimization
        ### Large JSON Files
        - Use streaming parsers for large files
        - Implement pagination for large datasets
        - Consider binary formats like MessagePack for performance-critical applications

        ### Memory Management
        - Parse only required fields
        - Use lazy loading for nested objects
        - Implement proper garbage collection

        ## Security Considerations
        - Validate input size limits
        - Sanitize data before processing
        - Use secure parsing libraries
        - Implement proper error handling
        - Avoid eval() for JSON parsing

        ## Tools and Libraries
        - **Validation**: Ajv, joi, yup
        - **Querying**: JSONPath, jq
        - **Transformation**: jolt, JSONata
        - **Performance**: fast-json-stringify, simdjson
      `,
    },
    {
      title: "JSON in Modern Development: API Design and Best Practices",
      excerpt:
        "Essential patterns and practices for designing robust JSON APIs and handling JSON data in modern applications.",
      readTime: "7 min read",
      category: "Best Practices",
      content: `
        JSON has become the backbone of modern web APIs and data exchange. Understanding how to design and work with JSON effectively can significantly improve your development workflow and application performance.

        ## API Design with JSON
        When designing JSON APIs, consistency and clarity are key:
        - **Consistent Naming**: Use camelCase or snake_case consistently throughout your API
        - **Meaningful Structure**: Group related data logically
        - **Error Handling**: Standardize error response formats
        - **Versioning**: Plan for API evolution from the start

        ## Common JSON Patterns

        ### RESTful Resource Representation
        Structure your JSON to represent resources clearly:
        - Use objects for single resources
        - Use arrays for collections
        - Include metadata when necessary (pagination, timestamps)
        - Provide clear relationships between resources

        ### Error Response Patterns
        Standardize how errors are communicated:
        - **Consistent Structure**: Always use the same error format
        - **Descriptive Messages**: Provide clear, actionable error descriptions
        - **Error Codes**: Include both HTTP status codes and application-specific codes
        - **Field-Level Errors**: Specify which fields have validation issues

        ## Performance Considerations

        ### Minimize Payload Size
        - **Select Fields**: Only include necessary data
        - **Avoid Deep Nesting**: Keep structure reasonably flat
        - **Use Compression**: Enable gzip compression for large responses
        - **Pagination**: Break large datasets into manageable chunks

        ### Caching Strategies
        - **ETags**: Use entity tags for cache validation
        - **Last-Modified**: Include modification timestamps
        - **Cache-Control**: Set appropriate cache headers
        - **Immutable Data**: Mark unchanging data as cacheable

        ## Security Best Practices
        - **Input Validation**: Always validate incoming JSON data
        - **Sanitization**: Clean data before processing
        - **Size Limits**: Prevent oversized payloads
        - **Schema Validation**: Use JSON Schema for structure validation
        - **Sensitive Data**: Never expose sensitive information in responses

        ## Testing JSON APIs
        ### Using JSONtapose for API Testing
        JSONtapose is perfect for API development and testing:
        1. **Response Comparison**: Compare API responses before and after changes
        2. **Schema Validation**: Verify response structure matches expectations
        3. **Data Exploration**: Use TreeViewer to understand complex response structures
        4. **Debugging**: Quickly identify differences in API behavior

        ## Modern JSON Tools and Libraries
        - **Schema Validation**: JSON Schema, Ajv
        - **Parsing Libraries**: Native JSON.parse(), fast-json-stringify
        - **API Testing**: Postman, Insomnia, curl
        - **Documentation**: OpenAPI/Swagger for API documentation
        - **Comparison Tools**: JSONtapose for visual diff analysis

        ## Future-Proofing Your JSON APIs
        - **Backward Compatibility**: Add fields, don't remove them
        - **Graceful Degradation**: Handle missing fields elegantly
        - **Documentation**: Keep API documentation up to date
        - **Monitoring**: Track API usage and performance
        - **Feedback Loop**: Listen to developer feedback and iterate
      `,
    },
  ];

  // Track expanded article state
  const [expandedArticle, setExpandedArticle] = React.useState<number | null>(
    null
  );

  return (
    <section id="blog" className="bg-base-200 rounded-lg p-6">
      {/* Blog header with title and description */}
      <h2 className="text-2xl font-bold mb-4 text-center">
        <a href="#blog" className="hover:text-primary">
          JSONtapose Blog
        </a>
      </h2>
      <p className="text-center mb-6 text-base-content/80">
        Tips, tutorials, and best practices for working with JSON
      </p>

      {/* Article grid with responsive layout */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article: Article, index: number) => (
          <div
            key={index}
            className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="card-body">
              <div className="flex items-center gap-2 mb-2">
                <span className="badge badge-primary badge-sm">
                  {article.category}
                </span>
                <span className="text-sm text-base-content/60">
                  {article.readTime}
                </span>
              </div>
              <h3 className="card-title text-lg">{article.title}</h3>
              <p className="text-sm text-base-content/80 mb-4">
                {article.excerpt}
              </p>
              <div className="card-actions justify-end">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setExpandedArticle(index)}
                >
                  Read More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {expandedArticle !== null && (
        <div className="bg-base-100 rounded-lg p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="badge badge-primary">
                {articles[expandedArticle].category}
              </span>
              <span className="text-sm text-base-content/60">
                {articles[expandedArticle].readTime}
              </span>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setExpandedArticle(null)}
            >
              ← Back to Articles
            </button>
          </div>

          <h1 className="text-3xl font-bold mb-4 text-center">
            {articles[expandedArticle].title}
          </h1>

          <div className="prose prose-lg max-w-none text-left">
            {articles[expandedArticle].content.split("\n").map((line, i) => (
              <p key={i} className="mb-4">
                {line}
              </p>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default BlogSection;
