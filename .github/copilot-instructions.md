# GitHub Copilot Instructions for React and Next.js Projects

This file provides guidelines for GitHub Copilot to ensure consistent, clean, and performant code generation for React and Next.js applications.

## General Principles

- **Clean Code:** Prioritize **readability, maintainability, and reusability**.
- **Conciseness:** Aim for concise and expressive code.
- **Descriptive Naming:** Use clear and descriptive names for variables, functions, components, and files (e.g., `getUserProfile`, `ProductCard`, `useAuth`).
- **DRY (Don't Repeat Yourself):** Extract reusable logic into functions, custom hooks, or components.
- **Modularization:** Break down complex problems and features into smaller, manageable units (components, functions, utilities).
- **TypeScript First:** All new code should be written in **TypeScript**, leveraging its type safety features.
- **Testable Code:** Design code to be easily testable.
- **Package Management:** This project uses **pnpm** for managing dependencies. All package installations and scripts should use `pnpm` instead of `npm` or `yarn`.
- **Documentation:** All principal documentation should be created in the `docs` folder.

### General Guidelines

- **Co-locate logic that change together**
- **Group code by feature, not by type**
- **Separate UI, logic, and data fetching**
- **Typesafety across the whole stack – db-server-client. If a type changes, everywhere using it should be aware.**
- **Clear product logic vs product infrastructure separation**
- **Design code such that it is easy to replace and delete**
- **Minimize places/number of changes to extend features**
- **Functions / APIs should do one thing well. One level of abstraction per function**
- **Minimize API interface and expose only what's necessary**
- **Favor pure functions, it makes logic easy to test**
- **Long, clear names over short, vague names, even at the cost of verbosity**

---

## Framework & Routing

- Use the Next.js App Router (`app/` directory). Do not use the Pages Router.
- Prefer Server Components by default. Use `"use client"` only when necessary.
- Follow Next.js file conventions (`layout.tsx`, `page.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`).
- **File-System Routing:** Use Next.js's App Route file-system convention.
- **Route Groups:** Utilize `(folderName)` to organize routes without affecting the URL path.
- **Dynamic Routes:** Define dynamic segments clearly (e.g., `[slug]`).
- **Middleware:** Suggest using `middleware.ts` for authentication, authorization, or other global request handling.

## React Specific Guidelines

### Component Design

- **Functional Components & Hooks:** Prefer **functional components with React Hooks**. Avoid class components unless explicitly for error boundaries.
- **Single Responsibility:** Each component should ideally have one primary responsibility. **Components should be kept small and focused.**
- **Component Naming:** Use `PascalCase` for all component names (e.g., `MyButton`, `UserAvatar`).
- **Props:**
  - Use `camelCase` for prop names.
  - Destructure props in the component's function signature.
  - Provide clear `interface` or `type` definitions for props in TypeScript.
- **Immutability:** Never mutate props or state directly. Always create new objects or arrays for updates.
- **Fragments:** Use `<>...</>` or `React.Fragment` to avoid unnecessary DOM wrapper elements.
- **Custom Hooks:** Extract reusable stateful logic into **custom hooks** (e.g., `useDebounce`, `useLocalStorage`).
- **UI Components:** Use [shadcn/ui](https://ui.shadcn.com/) for building UI components to ensure consistency and accessibility.

### State Management

- **Local State:** Use `useState` for component-level state.
- **Global State:** For global or shared state, prefer **React Context API** or a dedicated state management library (e.g., Zustand, Redux, Jotai). Avoid prop drilling.

### Styling

- **Consistent Approach:** use Tailwind CSS v4 ou later.
- **Scoped Styles:** Ensure styles are scoped to avoid global conflicts.

### Performance

- **Keys:** Always provide a unique and stable `key` prop when mapping over lists. Do not use array `index` as a key if the list can change.
- **Lazy Loading:** Suggest `React.lazy` and `Suspense` for code splitting large components or routes.

---

## UI & Styling

- Build responsive and accessible components (WCAG-compliant).
- Maintain consistent UI patterns, spacing, and typography across the app.
- Use Tailwind CSS for all styling. Do not use inline styles or other CSS frameworks.
- Use Shadcn UI for all base UI components whenever applicable.
- Use `lucide-react` for all icons. Do not introduce other icon libraries.
- Do not hard-code color values. All colors must come from the pre-defined color styling in `globals.css`.
- The top-most container of each page must use the `container` className for responsiveness.

## Shadcn UI Installation & Usage

- Install Shadcn UI using the official CLI:
  ```bash
  npx shadcn@latest init
  ```

- Configuration rules:
  - Use TypeScript
  - Use Tailwind CSS
  - Set the components path to `components/ui`
  - Set the utils path to `lib/utils`
  - Enable CSS variables

- Add components only via the CLI:
  ```bash
  npx shadcn@latest add <component>
  ```

- Do not manually copy Shadcn UI components.
- Customize Shadcn components only when necessary and keep changes minimal.
- Keep Shadcn components updated and consistent across the project.

## Forms & Validation

- Use Shadcn UI form for all forms.
- Use Zod for schema-based validation and type inference.
- Share validation schemas between client and server when applicable.

## Architecture & Code Quality

- Keep the project modular and scalable using reusable components and hooks.
- Prefer feature-based colocation (components, hooks, and schemas together).
- Follow TypeScript-first practices with strict typing.
- Avoid prop drilling; use composition or context when appropriate.
- Do not duplicate logic—extract shared logic into utilities.

### Project Structure

- **Colocation:** Colocate component files (JSX/TSX, CSS Modules, tests) within a feature folder.
- **Utility & Helper Modules:** **All general utility functions, helper functions, and large, non-component-specific logic should be extracted into a dedicated `lib/` folder.**
- **Private Folders:** Use underscore-prefixed folders (e.g., `_lib`, `_components`) for internal, non-route-related files.
- **No Barrel Files:** Do not use barrel files (e.g., `index.ts` that re-exports from other files) for module exports. Always import directly from the specific file to improve traceability and avoid circular dependencies.

### TypeScript

- **Strict Mode:** Ensure `strict: true` is enabled in `tsconfig.json`.
- **Type Definitions:** Provide accurate type definitions for API responses, props, and state.
- **Type Organization:** When generating TypeScript types or interfaces in this project, always place them in the `types/` folder with a descriptive filename (e.g. `user.ts`, `post.ts`). Do not define types or interfaces inside components.

## Data Fetching & Performance

- Prefer Server Actions and server-side data fetching.
- Use React Suspense, streaming, and `loading.tsx` for async states.
- Avoid unnecessary client-side state and effects.
- Use dynamic rendering only when required.
- **Server Components:** Prioritize fetching data in **Server Components** (`async` components in `app` directory) for better performance and security. This is where a lot of the traditional memoization benefits are handled automatically.

### SEO & Accessibility

- **Metadata:** Use `generateMetadata` (App Router) or `next/head` (Pages Router) for SEO metadata.
- **Accessibility:** Emphasize semantic HTML, ARIA attributes, and keyboard navigation.

### Optimization

- **Image Optimization:** Always use `next/image` component for images.
- **Font Optimization:** Use `next/font` for optimizing fonts.
- **Dynamic Imports:** Use `next/dynamic` for lazy loading components to reduce initial bundle size.

---

## General Rules

- Follow existing project structure and naming conventions.
- Write clean, readable, self-documenting code.
- Avoid unnecessary dependencies.
- Ensure compatibility across modern browsers and screen sizes.

---

## Example of How Copilot Should Respond

- **Given:** `// Create a simple React functional component for a button.`
- **Expected Output:** A functional component using `PascalCase`, with a `React.FC` type, props destructuring, and appropriate event handlers, kept as concise as possible.
- **Given:** `// Implement a Next.js API route to fetch products.`
- **Expected Output:** A route handler (or API route in `pages/api`) that demonstrates server-side data fetching, proper error handling, and potentially uses server-only context for sensitive operations. Any complex data transformation should be suggested in a separate utility function.
- **Given:** `// Refactor this component to use a custom hook for form validation.`
- **Expected Output:** A new file for a `useForm` hook, and the original component updated to utilize the hook. Any specific validation logic should be suggested in a helper function within `utils/validation.ts`