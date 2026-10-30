# VoidMain Website

Dark purple responsive Minecraft server website.

## Deploy to Render
- Build command: `npm install`
- Start command: `npm start`
- Set `NODE_ENV=production` and a strong `SESSION_SECRET` environment variable.

## Important
The current starter uses SQLite on local disk. On ephemeral hosting, accounts and news can be lost after restarts or redeploys. Use PostgreSQL or a persistent disk before relying on user accounts. Minecraft live status and in-game statistics are not integrated yet. Website password login does not verify Minecraft account ownership.
