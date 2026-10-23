/* Rabbit — site configuration. Edit values here; the page picks them up everywhere.
   Static, public file: never put secrets, keys or private URLs in here. */
window.RABBIT_CONFIG = {
  PRO_PRICE_EUR: 30,             // <- Pro price, EUR per month (single source of truth for the page)
  ENDPOINT: "https://the-macro-dashboard.com/mcp", // current MCP endpoint (may move to a Rabbit domain)
  TOOLS: { macro: 28, quantfi: 10, premia: 10, edge: 6 }, // Discord bot is separate, not counted
  WHOP_URL: "https://whop.com/checkout/plan_XyogOsHlypRQB", // Whop public checkout link; "" = shows "coming soon"
  CONTACT_EMAIL: ""              // "" = hidden / coming soon
  // Discord invite is the DISCORD_INVITE constant at the top of assets/app.js
};
