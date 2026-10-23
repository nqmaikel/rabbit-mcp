# Rabbit — The Rabbit Hole

**54 research tools for AI assistants, through one hosted MCP endpoint.**
Macro data, quant methods, public-company filings and academic papers: connect once, ask from Cursor, Claude or any MCP client.

🌐 **Website:** https://nqmaikel.github.io/rabbit-mcp/
💬 **Discord (The Rabbit Hole):** https://discord.gg/rFHFdbQ2xA

> ⭐ **Leave a star** if Rabbit is useful to you. It helps others find it.

## Free vs Pro

| | Free | Pro |
|---|---|---|
| Price | €0, forever | €30 / month |
| Tools | **One family of your choice**, forever | **All four families** (54 tools) |
| Sign-in | Discord login only, no card | Discord login + subscription via [Whop](https://whop.com/checkout/plan_XyogOsHlypRQB) |

Families: **Macro** (28 tools), **QuantFi** (10), **Premia** (10), **Edge** (6).
The Edge paper-ranking Discord bot is free for everyone inside The Rabbit Hole server.

## Connect

Rabbit is a hosted Streamable-HTTP MCP server. Nothing to install.

Cursor / Claude Code / any client that takes an MCP URL:

```json
{
  "mcpServers": {
    "rabbit": {
      "url": "https://the-macro-dashboard.com/mcp"
    }
  }
}
```

Claude Code:

```
claude mcp add --transport http rabbit https://the-macro-dashboard.com/mcp
```

To poke around first: `npx @modelcontextprotocol/inspector@latest`, transport *Streamable HTTP*, same URL.
You sign in with Discord the first time the client connects.

## Hosted, closed source

Rabbit is a **hosted service and closed source**. The tools run on our servers; you use them through the MCP endpoint.
This repository contains **only the public website and docs** (static HTML/CSS/JS, no build step, no server code, no keys).
Tools are read-only: they never run your code or touch your broker.

## Disclaimer

Rabbit provides research tooling, not investment advice. Backtests are simulations, not forecasts. Data comes from official public sources, may be delayed or incomplete, and is attributed to its publisher. Rabbit is independent and not affiliated with the sources or clients it names.

## Site development

- Preview: `python3 -m http.server 8080`
- Deploy: GitHub Pages via `.github/workflows/pages.yml` (all asset paths are relative, so it works under `/rabbit-mcp/`)
- Config (price, endpoint, tool counts, Whop link): `assets/config.js`
- Fonts (Geist, Geist Mono, Special Elite) are bundled locally; licenses in `assets/fonts/LICENSES.txt`

⭐ **Leave a star** · Dale una estrella
