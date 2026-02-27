# AI Workflow

This project was built entirely inside Claude Code (Anthropic's CLI agent), used as a pair-programming partner throughout the full development cycle.

**Approach:** Work was broken into focused, reviewable steps — scaffold → types → mock data → layout shell → page by page — rather than generating whole pages at once. Each step was reviewed before moving on, keeping context tight and output predictable.

**Key AI-assisted decisions:**
- `md:contents` to dissolve a chip scroll wrapper at desktop, solving the mobile/desktop layout conflict without duplicating markup.
- Switching Vitest from `jsdom` to `node` environment after Claude diagnosed a CJS/ESM conflict in `html-encoding-sniffer`.
- Global CSS overrides for dark/light mode text rather than touching Tailwind class strings across dozens of files.
- `vercel.json` fix: removing `rootDirectory` (invalid schema property) and using `cd app &&` in the build command instead.

**What I would improve with more time:**
- Replace `!important` CSS text-colour overrides with proper Tailwind theme tokens.
- Add React Testing Library integration tests for charts and tables.
- Use a real date-range picker (e.g. react-day-picker) instead of native `<input type="date">`.

**AI planning artefacts:** `CLAUDE.md` (challenge brief and build plan) and `process.md` (running decision journal).
