# Plagiarism Checker Library
A library for checking plagiarism in text documents.

## Developer Notes

## App Architecture
This library follows a functional programming approach rather than an object-oriented one. Since we don't need to maintain state between operations, using pure functions provides several benefits:

- **Modularity**: Each file exports a single function that performs one specific task, making the code easier to understand, test, and maintain
- **Predictability**: Pure functions always produce the same output for a given input, eliminating side effects and making debugging simpler
- **Testability**: Functions that don't maintain state are easier to unit test since we only need to verify input/output relationships
- **Composability**: Small, focused functions can be combined to create more complex operations while keeping the code organized

The architecture emphasizes keeping functions small, pure, and focused on a single responsibility. This allows us to build complex plagiarism detection logic by composing simpler, well-tested functions together.

### Project Structure

- `src/`: Source code for the library.
- `tests/`: Test cases for the library.
- `dist/`: Compiled output of the library.
- `package.json`: Project metadata and build scripts.
- `tsconfig.json`: TypeScript configuration.
- `eslint.config.js`: ESLint configuration.
- `vitest.config.ts`: Vitest configuration.
