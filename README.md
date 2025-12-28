This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

This project uses **pnpm** as the package manager. First, install dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Code Standards

This project follows strict code standards for consistency and maintainability:

- **TypeScript First**: All code is written in TypeScript with strict mode
- **Package Manager**: Uses pnpm exclusively for package management
- **Forms**: All forms use Shadcn Form (react-hook-form) with Zod validation
- **Styling**: Uses CSS variables from globals.css (no hardcoded colors)
- **No Barrel Files**: Direct imports from specific files only
- **Type Organization**: All types are in the `types/` folder

For detailed guidelines, see [CODE_STANDARDS.md](docs/CODE_STANDARDS.md)

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # Shared React components
├── contexts/         # React Context providers
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and helpers
├── providers/       # Provider components
└── types/           # TypeScript type definitions
```

For detailed architecture information, see [ARCHITECTURE.md](docs/ARCHITECTURE.md)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
