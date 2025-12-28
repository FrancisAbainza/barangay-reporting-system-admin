# Code Standards and Guidelines

This document outlines the code standards and guidelines followed in this project, ensuring consistency, maintainability, and adherence to best practices.

## Package Management

This project uses **pnpm** for all package management operations.

```bash
# Install dependencies
pnpm install

# Add a package
pnpm add <package-name>

# Run development server
pnpm dev

# Build the project
pnpm build
```

## TypeScript

All code in this project is written in **TypeScript** with strict mode enabled.

### Type Organization

- All type definitions are centralized in the `types/` folder
- Each module has its own type file (e.g., `types/complaint.ts`, `types/project.ts`)
- Component prop types can be defined inline for component-specific interfaces
- Never use `any` unless absolutely necessary

## React Components

### Component Structure

- Use **functional components** with React Hooks
- Follow the **single responsibility principle** - each component should have one primary purpose
- Use `PascalCase` for component names
- Use `camelCase` for prop names

### Forms

All forms must use:
- **Shadcn Form** (built on `react-hook-form`)
- **Zod** for schema validation
- TypeScript inference with `z.infer` for type safety

Example:
```tsx
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
});

type FormValues = z.infer<typeof formSchema>;

const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: { name: "", email: "" },
});
```

## Styling

### CSS Variables

**Always use semantic CSS variables from `globals.css`** instead of hardcoded Tailwind color classes.

✅ **Correct:**
```tsx
<div className="bg-background text-foreground border-border">
<Badge className="bg-primary/10 text-primary">Status</Badge>
<Button variant="destructive">Delete</Button>
```

❌ **Incorrect:**
```tsx
<div className="bg-white text-black border-gray-200">
<Badge className="bg-blue-100 text-blue-800">Status</Badge>
<Button className="bg-red-500 text-white">Delete</Button>
```

### Available CSS Variables

#### Colors
- `--background` / `bg-background`
- `--foreground` / `text-foreground`
- `--primary` / `bg-primary` / `text-primary`
- `--secondary` / `bg-secondary` / `text-secondary`
- `--muted` / `bg-muted` / `text-muted-foreground`
- `--accent` / `bg-accent` / `text-accent-foreground`
- `--destructive` / `bg-destructive` / `text-destructive`
- `--border` / `border-border`
- `--input` / `bg-input`
- `--ring` / `ring-ring`

#### Chart Colors
- `--chart-1` through `--chart-5` for data visualization

## Project Structure

### File Organization

```
src/
├── app/                      # Next.js App Router pages
│   ├── admin-dashboard/      # Feature-based routing
│   │   ├── complaints/       # Complaints feature
│   │   │   ├── [id]/        # Dynamic route
│   │   │   │   └── components/  # Page-specific components
│   │   │   └── components/  # Feature-specific components
│   │   └── transparency/     # Transparency feature
│   │       └── components/   # Feature-specific components
│   ├── globals.css           # Global styles and CSS variables
│   └── layout.tsx            # Root layout
├── components/               # Shared components
│   └── ui/                   # Shadcn UI components
├── contexts/                 # React Context providers
├── hooks/                    # Custom React hooks
├── lib/                      # Utility functions and helpers
├── providers/                # Provider components
└── types/                    # TypeScript type definitions
```

### Import Guidelines

**No Barrel Files:**
- Do not use `index.ts` or `index.tsx` for re-exporting
- Always import directly from the specific file

✅ **Correct:**
```tsx
import { Providers } from "@/providers/providers";
import { ComplaintStatus } from "@/types/complaint";
```

❌ **Incorrect:**
```tsx
import { Providers } from "@/providers"; // Barrel file
import { ComplaintStatus } from "@/types"; // Barrel file
```

### Utility Functions

All general utility functions, helper functions, and large non-component logic should be extracted to the `lib/` folder.

Examples:
- `lib/complaint-helpers.ts` - Complaint-specific utilities
- `lib/project-helpers.ts` - Project-specific utilities
- `lib/utils.ts` - General utilities
- `lib/date-formatter.ts` - Date formatting utilities

## State Management

### Local State
Use `useState` for component-level state.

### Global State
Use React Context API for application-wide state:
- `auth-context.tsx` - Authentication state
- `complaint-db-context.tsx` - Complaint data
- `project-db-context.tsx` - Project data
- `admin-db-context.tsx` - Admin data

## Performance

### Optimization Strategies

1. **Keys in Lists**: Always provide unique, stable keys when mapping over lists
2. **Code Splitting**: Use `React.lazy` and `Suspense` for large components
3. **Image Optimization**: Use `next/image` component
4. **Font Optimization**: Use `next/font` for font loading

## UI Components

Use **Shadcn UI Library** for all UI components to ensure:
- Consistency across the application
- Accessibility (ARIA attributes, keyboard navigation)
- Theme compatibility with CSS variables

## Best Practices

### Clean Code Principles

1. **Descriptive Naming**: Use clear, descriptive names for variables, functions, and components
2. **DRY (Don't Repeat Yourself)**: Extract reusable logic into functions, hooks, or components
3. **Single Responsibility**: Each function/component should do one thing well
4. **Pure Functions**: Favor pure functions for easier testing
5. **Immutability**: Never mutate props or state directly

### Code Organization

- **Colocate logic that changes together**
- **Group code by feature, not by type**
- **Separate UI, logic, and data fetching**
- **Design code to be easy to replace and delete**
- **Minimize places/number of changes needed to extend features**

### Documentation

- Principal documentation should be in the `docs/` folder
- Use clear, concise comments for complex logic
- Document API interfaces and type definitions

## Testing

Design code to be easily testable:
- Write pure functions when possible
- Separate business logic from UI components
- Use dependency injection for external dependencies

## Accessibility

- Use semantic HTML elements
- Include proper ARIA attributes
- Ensure keyboard navigation works
- Maintain sufficient color contrast
- Provide alternative text for images

## SEO

For Next.js pages:
- Use `generateMetadata` (App Router) for SEO metadata
- Include descriptive titles and descriptions
- Use proper heading hierarchy

## Next.js Specific

### Data Fetching

- Prioritize **Server Components** for data fetching
- Use `fetch` with `revalidate` for caching strategies
- Fetch data in parallel when possible

### Routing

- Use App Router file-system routing
- Utilize route groups `(folderName)` for organization
- Define dynamic routes with `[slug]` notation

## Git Workflow

- Write clear, descriptive commit messages
- Keep commits focused on a single concern
- Use meaningful branch names

---

**Last Updated:** December 29, 2025
