# GitHub Copilot Instructions: Next.js & React Stack

## 1. Core Tech Stack & Standards

* **Framework:** Next.js 15+ (App Router). **Never** use Pages Router.
* **Language:** TypeScript (Strict Mode). No `any`. Use `interface` for props/data.
* **Package Manager:** `pnpm`.
* **UI/Styling:** Tailwind CSS v4+, `shadcn/ui`, `lucide-react` for icons.
* **Validation:** Zod for all schemas (shared between client/server).
* **State:** Local (`useState`), Global (Zustand or Context), Server (Server Actions).

---

## 2. Project Architecture

* **Directory Structure:**
* `app/`: Routes, layouts, and server-side logic.
* `components/ui/`: Shadcn components (install via CLI only).
* `components/`: Shared functional components.
* `lib/`: General utilities and helper functions.
* `types/`: Centralized TypeScript definitions (no in-file declarations).
* `hooks/`: Reusable custom hooks.


* **Organization:** * Group by feature, not by type.
* Use **Private Folders** (`_folder`) for internal route logic.
* **No Barrel Files:** Always import directly from the source file.



---

## 3. Component & Logic Guidelines

* **Server First:** Use Server Components by default. Use `"use client"` only for interactivity/hooks.
* **Purity:** Favor pure functions. Separate UI from business logic and data fetching.
* **Naming:** `PascalCase` for components, `camelCase` for functions/props. Use long, descriptive names.
* **DRY & Modular:** One level of abstraction per function. Extract complex logic into `lib/` or custom hooks.
* **Immutability:** Never mutate state or props directly.

---

## 4. UI & Styling Rules

* **Responsiveness:** Top-level page containers must use the `container` class.
* **Design System:** Use `globals.css` variables for colors; no hard-coded hex codes.
* **Forms:** Always use Shadcn `Form` + Zod validation.
* **Accessibility:** Ensure WCAG compliance, semantic HTML, and ARIA labels.

---

## 5. Performance & Optimization

* **Data Fetching:** Prefer Server Components and Server Actions.
* **Async UI:** Use `loading.tsx` and React `Suspense` for streaming/skeletons.
* **Images/Fonts:** Use `next/image` and `next/font`.
* **Lists:** Always use unique, stable `key` props (avoid array index).
* **Dynamic Imports:** Use `next/dynamic` for heavy client-side components.

---

## 6. Implementation Checklist for Copilot

* [ ] Is this a TypeScript file with proper types from `types/`?
* [ ] If it’s a component, is it Server-side by default?
* [ ] Are all UI elements from `shadcn/ui` and icons from `lucide-react`?
* [ ] Does this follow the `pnpm` workflow?
* [ ] Is the logic extracted if it’s becoming too complex?

