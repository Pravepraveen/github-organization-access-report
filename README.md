# GitHub Organization Access Report

Single-page React app that audits who can access which repositories in a GitHub organization. It supports live fetching with a Personal Access Token and a built‑in demo mode with realistic mock data.

## Features
- Validates PAT scopes (`repo` + `read:org`) and shows the authenticated user.
- Scans all org repositories and collaborators with progress updates and rate‑limit awareness.
- Interactive report: search, filter by access level/user type/repo, sort, and export JSON.
- Demo preview without hitting the GitHub API.

## Quick start
```bash
npm ci           # install deps
npm run dev      # start Vite dev server
# open the shown localhost URL
```

## Production build
```bash
npm run build
```
Output is a single-file bundle at `dist/index.html`.

## Usage
1) Generate a GitHub Personal Access Token with `repo` and `read:org` scopes.  
2) Enter your org name and token, then run the report.  
3) Filter/sort results and click **Export JSON** to download.  
4) Alternatively, click **Try demo** to explore with mock data.

## Tech stack
React 19, Vite 7, TypeScript, Tailwind CSS 4, lucide-react, clsx, tailwind-merge.
