

# Scaling AFF Design Studio: Patterns, Assets, and Dynamic Storage

## Current Architecture Summary

The system has three layers:
1. **Config** (`garment-config.ts`) — TypeScript types and option labels
2. **Silhouette Renderer** (`silhouette-renderer.ts`) — ~620 lines of hand-coded SVG drawing functions for the fashion illustration preview
3. **Pattern Engine** (`garment-pattern-engine.ts`) — Technical sewing pattern drafts from measurements

Everything is hardcoded in TypeScript. Adding a new neckline means editing 3+ files and redeploying. There is no database.

---

## Three Strategies for Growth

### Strategy 1: SVG-to-Parametric Pipeline (for your custom drawings)

Yes — if you provide SVG drawings, they can be made parametric. Here is how it would work:

1. **You provide** a static SVG of a garment component (e.g., a collar, pocket, or entire bodice shape)
2. **We identify anchor points** — key coordinates that should scale with body measurements (shoulder width, bust, waist, etc.)
3. **We convert** absolute coordinates to formulas relative to the croquis landmarks (e.g., `CX - SHOULDER_W`, `WAIST_Y + 10`)
4. **We parameterize** the SVG path data so it responds to fit type, garment length, and body proportions
5. **The result** is a TypeScript function that generates that SVG dynamically

**Example**: You draw a sailor collar SVG. We extract its path, identify that it anchors at `NECK_BASE` and spans to `SHOULDER_W`, and create a function like:
```text
function sailorCollar(fit, neckBase, shoulderW) → SVG path string
```

**Limitation**: Complex decorative SVGs (embroidery motifs, prints) would be stored as static assets and positioned/scaled on the garment, not fully parametric.

---

### Strategy 2: Plugin/Registry Architecture (code-level scaling)

Refactor the monolithic renderer into self-contained feature modules:

```text
src/lib/garment-features/
  ├── registry.ts          ← Central registry
  ├── necklines/
  │   ├── index.ts         ← Registers all necklines
  │   ├── round.ts         ← Config + renderer + pattern logic
  │   ├── v-neck.ts
  │   └── cowl.ts          ← New! Just add file + register
  ├── sleeves/
  │   ├── index.ts
  │   ├── bishop.ts        ← New sleeve type
  │   └── ...
  ├── collars/
  ├── pockets/
  ├── closures/
  └── details/
```

Each feature module exports a standard interface:
```text
{
  id: "cowl-neck",
  category: "neckline",
  label: "Cowl Neck",
  renderSilhouette: (landmarks, fit, view) → SVG path string,
  renderPattern: (measurements) → pattern pieces,
  thumbnail?: SVG string for the configurator UI
}
```

**Adding a new feature** = create one file, export the interface, import in the category index. No touching the main renderer.

---

### Strategy 3: Database-Driven Dynamic Patterns (Supabase)

This is the most powerful approach for long-term growth. Store garment components in Supabase so they can be added, edited, and shared without redeploying.

#### Database Schema

```text
┌─────────────────────────────┐
│ garment_components          │
├─────────────────────────────┤
│ id (uuid, PK)               │
│ category (text)              │  ← "neckline", "sleeve", "collar", "pocket", etc.
│ slug (text, unique)          │  ← "cowl-neck", "bishop-sleeve"
│ label (text)                 │  ← "Cowl Neck"
│ thumbnail_svg (text)         │  ← Small SVG for the configurator picker
│ silhouette_template (jsonb)  │  ← Parametric SVG path templates with landmark refs
│ pattern_template (jsonb)     │  ← Pattern drafting rules (points, curves, formulas)
│ applicable_to (text[])       │  ← ["top", "dress"] — which garment types can use it
│ created_by (uuid, FK)        │
│ is_published (boolean)       │
│ created_at (timestamptz)     │
└─────────────────────────────┘

┌─────────────────────────────┐
│ garment_presets              │
├─────────────────────────────┤
│ id (uuid, PK)               │
│ name (text)                  │  ← "Classic Shirtdress", "Boho Maxi"
│ category (text)              │  ← "dress"
│ config (jsonb)               │  ← Full garment config snapshot
│ thumbnail_url (text)         │
│ created_by (uuid, FK)        │
│ is_published (boolean)       │
│ created_at (timestamptz)     │
└─────────────────────────────┘

┌─────────────────────────────┐
│ svg_assets                   │
├─────────────────────────────┤
│ id (uuid, PK)               │
│ name (text)                  │
│ category (text)              │  ← "motif", "print", "texture"
│ svg_content (text)           │
│ anchor_points (jsonb)        │  ← Parametric anchor definitions
│ created_by (uuid, FK)        │
│ created_at (timestamptz)     │
└─────────────────────────────┘
```

#### How the Parametric Template Works

The `silhouette_template` JSON would store path data with variable references instead of hardcoded numbers:

```json
{
  "paths": [
    {
      "d": "M {{CX - SW}} {{SHOULDER_Y}} C {{CX - SW + 8}} {{SHOULDER_Y - 4}} {{CX - 15}} {{NECK_BASE - 18}} {{CX}} {{NECK_BASE - 10}} C {{CX + 15}} {{NECK_BASE - 18}} {{CX + SW - 8}} {{SHOULDER_Y - 4}} {{CX + SW}} {{SHOULDER_Y}}",
      "stroke": "primary",
      "fill": "garment-shade"
    }
  ],
  "variables": {
    "SW": "SHOULDER_W + fitExpand(fit)"
  }
}
```

At runtime, a template engine resolves `{{CX - SW}}` against the current croquis landmarks and measurements. This means anyone can add a new neckline by inserting a row into the database — no code changes, no redeployment.

#### What This Enables

- **Admin panel** to add/edit garment components visually
- **Community contributions** — designers upload SVGs that get parameterized and stored
- **Versioning** — track changes to pattern templates over time
- **A/B testing** — publish new components to a subset of users
- **Marketplace potential** — premium pattern components

---

## Recommended Phased Approach

| Phase | What | Effort |
|-------|------|--------|
| **1** | Refactor to plugin/registry architecture (Strategy 2) | Medium — restructure existing code, no new features yet |
| **2** | Build the SVG-to-parametric pipeline (Strategy 1) — a utility that takes your SVG input and helps convert it to parametric templates | Medium |
| **3** | Add Supabase + database schema (Strategy 3) — store components in DB, load dynamically at runtime | Large |
| **4** | Admin UI for managing components — upload SVGs, preview, publish | Medium |
| **5** | Preset/template library — save and share full garment configurations | Small |

Phase 1 is the foundation. Without it, the database approach would be fighting the current monolithic structure. With the registry pattern in place, swapping the "source" from local files to database rows becomes straightforward.

---

## What You Can Give Me Now

- **Static SVGs** of garment components (collars, sleeves, pockets, bodice shapes) — I will parameterize them against the croquis landmarks
- **Reference images** — I can create SVG paths from scratch based on fashion illustrations
- **New feature names** — tell me which styles/options to add and I will implement the config + renderer + pattern engine for each

---

## Technical Notes

- The parametric template engine (for DB-stored patterns) would be ~200 lines: parse `{{expression}}` placeholders, resolve against a context object containing all croquis landmarks + measurement-derived values
- Supabase RLS would restrict `created_by` for writes; published components would be readable by all authenticated users
- The `garment_presets` table enables a "template gallery" where users pick a starting design and customize from there
- SVG assets (prints, textures) would go in Supabase Storage; only parametric path data lives in the DB as JSON

