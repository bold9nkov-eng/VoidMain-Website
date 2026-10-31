# VoidMain Website

Dark purple responsive Minecraft server website.

## Deploy to Render
- Build command: `npm install`
- Start command: `npm start`
- Set `NODE_ENV=production` and a strong `SESSION_SECRET` environment variable.

## Important
The current starter uses SQLite on local disk. On ephemeral hosting, accounts and news can be lost after restarts or redeploys. Render setup (required): add a Persistent Disk to the Web Service with mount path `/var/data`, then add environment variable `VOIDMAIN_DB_PATH=/var/data/voidmain.sqlite`. Production now defaults to this location and refuses to start if the persistent directory is missing, instead of silently creating a fresh empty database on ephemeral storage. Existing accounts can only be recovered if the previous SQLite database or a backup is still available. Minecraft live status and in-game statistics are not integrated yet. Website password login does not verify Minecraft account ownership.
