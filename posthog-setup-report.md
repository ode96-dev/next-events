<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NextEvents Next.js App Router application. Here is a summary of all changes made:

**New files created:**
- `instrumentation-client.ts` — Client-side PostHog initialisation using the recommended Next.js 15.3+ approach (`instrumentation-client.ts`). Initialises `posthog-js` with the EU cloud host proxied through `/ingest`, enables exception capture for error tracking, and enables debug mode in development.
- `src/lib/posthog-server.ts` — Singleton server-side PostHog client using `posthog-node`, ready for use in API routes or Server Actions.

**Modified files:**
- `next.config.ts` — Added PostHog reverse proxy rewrites (`/ingest/*` → `https://eu.i.posthog.com/*` and `/ingest/static/*` → `https://eu-assets.i.posthog.com/*`) and set `skipTrailingSlashRedirect: true` as required by PostHog.
- `src/components/explore/explore-btn.tsx` — Added `posthog.capture("explore_events_clicked")` in the existing `onClick` handler.
- `src/components/events/event-card.tsx` — Added `"use client"` directive, `posthog-js` import, and `posthog.capture("event_card_clicked", { event_title, event_slug, event_location, event_date })` on the card's link click.
- `src/components/navbar/navbar.tsx` — Added `posthog.capture("nav_link_clicked", { label, href })` on each of the three navigation links.

**Environment variables** set in `.env.local`:
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`

---

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `explore_events_clicked` | User clicks the "Explore events" CTA button on the homepage | `src/components/explore/explore-btn.tsx` |
| `event_card_clicked` | User clicks on an event card to view event details (with title, slug, location, date properties) | `src/components/events/event-card.tsx` |
| `nav_link_clicked` | User clicks a navigation link in the navbar (with label and href properties) | `src/components/navbar/navbar.tsx` |

---

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behaviour, based on the events we just instrumented:

- **Dashboard — Analytics basics:** https://eu.posthog.com/project/134635/dashboard/548873
- **Event Discovery Funnel** (pageview → explore click → event card click): https://eu.posthog.com/project/134635/insights/1NYHmfkh
- **Explore & Event Click Trends** (daily trend line): https://eu.posthog.com/project/134635/insights/NEOWFjS0
- **Most Popular Events** (event_card_clicked broken down by event title): https://eu.posthog.com/project/134635/insights/UYfXbmeU
- **Navigation Link Clicks by Destination** (nav_link_clicked broken down by label): https://eu.posthog.com/project/134635/insights/JVdhnYaz
- **Pageviews & Unique Visitors** (daily pageviews vs unique visitors): https://eu.posthog.com/project/134635/insights/Rd83DilL

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
