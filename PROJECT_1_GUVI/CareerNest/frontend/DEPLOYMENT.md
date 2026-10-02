# Frontend deployment

## Vercel / Netlify

Build:
`npm run build`

Output:
`dist`

Environment:
`VITE_API_URL=https://your-backend.example.com/api`

For a single-page app, configure a rewrite so `/jobs/...` and `/dashboard` serve `index.html`.
