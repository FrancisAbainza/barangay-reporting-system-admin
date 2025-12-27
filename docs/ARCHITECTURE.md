# Project Architecture

This project demonstrates a modern Next.js 14+ App Router architecture with proper separation between Server and Client Components.

## Architecture Pattern

### Server Components (Data Fetching)
**Location:** `page.tsx` files

These are React Server Components that handle data fetching. In a production app, they would fetch data directly from the database or API.

**Current Implementation:**
```tsx
// app/admin-dashboard/complaints/page.tsx
export default function ComplaintsPage() {
  // In production: const complaints = await fetchComplaints();
  // For demo: delegating to client wrapper with context
  return <ComplaintsPageClient />;
}
```

**Benefits:**
- No JavaScript sent to client for data fetching
- Direct database access (in production)
- Automatic request deduplication
- Better SEO and performance

### Client Components (Interactivity)
**Location:** `*-client.tsx` and `components/` directories

These handle all user interactions, state management, and mutations.

**Pattern:**
```tsx
// complaints-page-client.tsx
"use client";

export function ComplaintsPageClient() {
  // Receives data (in production, as props from server component)
  const { complaints } = useComplaintDb();
  
  // Passes data down to child components
  return (
    <>
      <ComplaintStatsWrapper complaints={complaints} />
      <ComplaintManagementCard complaints={complaints} />
    </>
  );
}
```

**Child Components:**
```tsx
"use client";

export function ComplaintManagementCard({ complaints }: Props) {
  // Receives data as props (read-only)
  // Uses context ONLY for mutations (create, update, delete)
  const { updateComplaintStatus, deleteComplaint } = useComplaintDb();
  
  // Local state for UI interactions
  const [filters, setFilters] = useState({...});
  
  // Filtered/computed data
  const filteredComplaints = useMemo(() => {...}, [complaints, filters]);
  
  return (...)
}
```

## Data Flow

```
┌─────────────────────────────────────────────────┐
│ Server Component (page.tsx)                     │
│ - Fetches data from database/API                │
│ - No state, no interactivity                    │
└──────────────────┬──────────────────────────────┘
                   │
                   │ passes data
                   ▼
┌─────────────────────────────────────────────────┐
│ Client Wrapper (*-client.tsx)                   │
│ - Receives data                                 │
│ - Distributes to child components               │
└──────────────────┬──────────────────────────────┘
                   │
                   │ passes data as props
                   ▼
┌─────────────────────────────────────────────────┐
│ Feature Components (components/)                │
│ - Receives data as props (read-only)            │
│ - Uses context for mutations only               │
│ - Manages local UI state                        │
│ - Handles user interactions                     │
└─────────────────────────────────────────────────┘
```

## Key Principles

### 1. **Separation of Concerns**
- **Server Components**: Data fetching
- **Client Components**: Interactivity and mutations

### 2. **Props for Data, Context for Actions**
- Data flows down via props (unidirectional)
- Mutations use context/hooks (simulating server actions)

### 3. **No Prop Drilling**
- Data is passed only one level deep
- Each component uses hooks for its own mutations

### 4. **Minimal Client JavaScript**
- Only interactive parts are client components
- Headers, static content can remain server components

## File Structure

```
app/admin-dashboard/
├── complaints/
│   ├── page.tsx                    # Server Component
│   ├── complaints-page-client.tsx  # Client Wrapper
│   ├── components/
│   │   ├── complaint-stats-wrapper.tsx      # Client (receives data)
│   │   ├── complaint-management-card.tsx    # Client (receives data, uses mutations)
│   │   ├── complaint-filters.tsx            # Client (UI only)
│   │   └── complaint-table.tsx              # Client (UI only)
│   └── [id]/
│       ├── page.tsx                # Server Component
│       └── components/
│           └── complaint-details-content.tsx  # Client (receives ID, fetches & mutates)
│
└── transparency/
    ├── page.tsx                    # Server Component
    ├── transparency-page-client.tsx # Client Wrapper
    ├── components/
    │   ├── project-stats-wrapper.tsx       # Client (receives data)
    │   └── project-management-card.tsx     # Client (receives data, uses mutations)
    └── [id]/
        ├── page.tsx                # Server Component
        └── components/
            └── project-details-content.tsx  # Client (receives ID, fetches & mutates)
```

## Context Usage (Simulating Server Actions)

The `useComplaintDb` and `useProjectDb` hooks simulate server actions:

**In Production:**
- Replace context with actual Server Actions
- Use `'use server'` directive
- Call database directly from actions

**Current Demo:**
```tsx
// This pattern:
const { updateComplaintStatus } = useComplaintDb();

// Would become:
import { updateComplaintStatus } from '@/actions/complaints';
// Where updateComplaintStatus is a Server Action
```

## Benefits of This Architecture

1. **Performance**: Server Components don't send JavaScript to the client
2. **SEO**: Data is rendered server-side
3. **Security**: Sensitive operations stay on the server
4. **Developer Experience**: Clear separation of concerns
5. **Scalability**: Easy to add new features without prop drilling
6. **Type Safety**: TypeScript types flow through the entire stack

## Migration Path to Server Actions

When ready to use real server actions:

1. Create actions file:
```tsx
// actions/complaints.ts
'use server';

export async function updateComplaintStatus(id: string, status: ComplaintStatus) {
  await db.complaint.update({ where: { id }, data: { status } });
  revalidatePath('/admin-dashboard/complaints');
}
```

2. Update page.tsx to fetch data:
```tsx
// page.tsx
export default async function ComplaintsPage() {
  const complaints = await fetchComplaints();
  return <ComplaintsPageClient complaints={complaints} />;
}
```

3. Use actions in client components:
```tsx
// complaint-management-card.tsx
import { updateComplaintStatus } from '@/actions/complaints';

// Then call directly:
await updateComplaintStatus(id, status);
```

## Current State

This project demonstrates the **pattern** while using context for simplicity. The architecture is already properly separated and ready for real server actions when you add a database.
