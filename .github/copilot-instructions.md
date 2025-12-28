# GitHub Copilot Instructions for React and Next.js Projects

This file provides guidelines for GitHub Copilot to ensure consistent, clean, and performant code generation for React and Next.js applications.

## General Principles

* **Clean Code:** Prioritize **readability, maintainability, and reusability**.
* **Conciseness:** Aim for concise and expressive code.
* **Descriptive Naming:** Use clear and descriptive names for variables, functions, components, and files (e.g., `getUserProfile`, `ProductCard`, `useAuth`).
* **DRY (Don't Repeat Yourself):** Extract reusable logic into functions, custom hooks, or components.
* **Modularization:** Break down complex problems and features into smaller, manageable units (components, functions, utilities).
* **TypeScript First:** All new code should be written in **TypeScript**, leveraging its type safety features.
* **Testable Code:** Design code to be easily testable.
* **Package Management:** This project uses **pnpm** for managing dependencies. All package installations and scripts should use `pnpm` instead of `npm` or `yarn`.
* **Documentation:** All principal documentation should be created in the `docs` folder.

### General Guidelines

* **Co-locate logic that change together**
* **Group code by feature, not by type**
* **Separate UI, logic, and data fetching**
* **Typesafety across the whole stack – db-server-client. If a type changes, everywhere using it should be aware.**
* **Clear product logic vs product infrastructure separation**
* **Design code such that it is easy to replace and delete**
* **Minimize places/number of changes to extend features**
* **Functions / APIs should do one thing well. One level of abstraction per function**
* **Minimize API interface and expose only what's necessary**
* **Favor pure functions, it makes logic easy to test**
* **Long, clear names over short, vague names, even at the cost of verbosity**

---

## React Specific Guidelines

### Component Design

* **Functional Components & Hooks:** Prefer **functional components with React Hooks**. Avoid class components unless explicitly for error boundaries.
* **Single Responsibility:** Each component should ideally have one primary responsibility. **Components should be kept small and focused.**
* **Component Naming:** Use `PascalCase` for all component names (e.g., `MyButton`, `UserAvatar`).
* **Props:**
* Use `camelCase` for prop names.
* Destructure props in the component's function signature.
* Provide clear `interface` or `type` definitions for props in TypeScript.


* **Immutability:** Never mutate props or state directly. Always create new objects or arrays for updates.
* **Fragments:** Use `<>...</>` or `React.Fragment` to avoid unnecessary DOM wrapper elements.
* **Custom Hooks:** Extract reusable stateful logic into **custom hooks** (e.g., `useDebounce`, `useLocalStorage`).
* **UI Components:** Use **Shadcn UI Library** for building UI components to ensure consistency and accessibility.

### Forms & Validation

* **Library Choice:** Always use **Shadcn Form** (built on `react-hook-form`) for all form implementations.
* **Validation:** Use **Zod** for all form schemas and validation logic.
* **Integration:** Ensure the `z.infer` types are used to provide full TypeScript support for form states.

### State Management

* **Local State:** Use `useState` for component-level state.
* **Global State:** For global or shared state, prefer **React Context API** or a dedicated state management library (e.g., Zustand, Redux, Jotai). Avoid prop drilling.

### Styling

* **Consistent Approach:** Use Tailwind CSS v4 or later.
* **Color Variables:** Strictly use **colors from globals.css** via CSS variables (e.g., `bg-background`, `text-primary`, `border-input`) to ensure theme compatibility.
* **Scoped Styles:** Ensure styles are scoped to avoid global conflicts.

### Performance

* **Keys:** Always provide a unique and stable `key` prop when mapping over lists. Do not use array `index` as a key if the list can change.
* **Lazy Loading:** Suggest `React.lazy` and `Suspense` for code splitting large components or routes.

---

## Next.js Specific Guidelines

### Data Fetching & Rendering

* **App Router Preference:** Use the **App Router** for new development.
* **Server Components:** Prioritize fetching data in **Server Components** (`async` components in `app` directory) for better performance and security.
* **Data Fetching Methods:**
* For build-time data or rarely changing content, suggest `getStaticProps` (Pages Router) or direct `fetch` in Server Components with `revalidate` (App Router).
* For dynamic, frequently changing data, suggest `getServerSideProps` (Pages Router) or direct `fetch` in Server Components (App Router).
* Avoid client-side data fetching for initial page loads unless absolutely necessary.


* **Parallel Fetching:** When fetching multiple independent data sources, initiate requests in parallel.

### Routing

* **File-System Routing:** Use Next.js's App Route file-system convention.
* **Route Groups:** Utilize `(folderName)` to organize routes without affecting the URL path.
* **Dynamic Routes:** Define dynamic segments clearly (e.g., `[slug]`).
* **Middleware:** Suggest using `middleware.ts` for authentication, authorization, or other global request handling.

### Optimization

* **Image Optimization:** Always use `next/image` component for images.
* **Font Optimization:** Use `next/font` for optimizing fonts.
* **Dynamic Imports:** Use `next/dynamic` for lazy loading components to reduce initial bundle size.

### Project Structure

* **Colocation:** Colocate component files (JSX/TSX, CSS Modules, tests) within a feature folder.
* **Utility & Helper Modules:** All general utility functions, helper functions, and large, non-component-specific logic should be extracted into a dedicated `lib/` folder.
* **Private Folders:** Use underscore-prefixed folders (e.g., `_lib`, `_components`) for internal, non-route-related files.
* **No Barrel Files:** Do not use barrel files. Always import directly from the specific file.

### SEO & Accessibility

* **Metadata:** Use `generateMetadata` (App Router) or `next/head` (Pages Router) for SEO metadata.
* **Accessibility:** Emphasize semantic HTML, ARIA attributes, and keyboard navigation.

### TypeScript

* **Strict Mode:** Ensure `strict: true` is enabled in `tsconfig.json`.
* **Type Definitions:** Provide accurate type definitions for API responses, props, and state.
* **Type Organization:** When generating TypeScript types or interfaces, always place them in the `types/` folder with a descriptive filename. Do not define types or interfaces inside components.

---

## Example of How Copilot Should Respond

* **Given:** `// Create a login form.`
* **Expected Output:** A component using **Shadcn Form**, **Zod** for the schema, and **TypeScript**. Styles should use variables like `text-primary` and `bg-background` from `globals.css`.
* **Given:** `// Implement a Next.js API route to fetch products.`
* **Expected Output:** A route handler demonstrating server-side fetching, proper error handling, and types imported from the `types/` folder.
* **Given:** `// Create a new UI button.`
* **Expected Output:** A component utilizing the **Shadcn UI** button primitive, ensuring it follows the project's Tailwind and color configuration.