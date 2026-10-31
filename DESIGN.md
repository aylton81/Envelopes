---
name: Actual Budget
description: Local-first personal finance, built around envelope budgeting
# Dark is the default theme. Keys suffixed -dark / -light are the same semantic
# role in each theme; components never use these hexes directly, they route
# through `theme.*` (see The Semantic Token Rule). Midnight keeps the legacy
# navy/purple palette and is not described by these tokens.
colors:
  terracotta: '#d97757'
  terracotta-hover: '#e8a68f'
  terracotta-deep: '#b4552f'
  terracotta-deep-hover: '#9c4728'
  graphite-page: '#262624'
  graphite-surface: '#30302e'
  graphite-raised: '#3d3d3a'
  graphite-hairline: '#4d4c48'
  graphite-sidebar: '#1f1e1d'
  ivory-page: '#f5f4ed'
  ivory-surface: '#faf9f5'
  ivory-hairline: 'color-mix(in srgb, #f0eee6 55%, transparent)'
  paper-white: '#ffffff'
  stone-text-dark: '#f0eee6'
  stone-text-light: '#1f1e1d'
  stone-muted: '#6e6c66'
  stone-light: '#a6a39a'
  positive-green-dark: '#65d6ad'
  positive-green-light: '#147d64'
  negative-red-dark: '#ff9b9b'
  negative-red-light: '#e12d39'
  warning-ochre-dark: '#d9a447'
  warning-gold-light: '#b88115'
typography:
  display:
    fontFamily: "'Source Serif 4 Variable', Georgia, 'Times New Roman', serif"
    fontSize: '30px'
    fontWeight: 500
    letterSpacing: '-0.01em'
  headline:
    fontFamily: "'Source Serif 4 Variable', Georgia, 'Times New Roman', serif"
    fontSize: '26px'
    fontWeight: 500
    lineHeight: 1.1
  title:
    fontFamily: "'Source Serif 4 Variable', Georgia, 'Times New Roman', serif"
    fontSize: '20px'
    fontWeight: 500
  body:
    fontFamily: 'Inter Variable, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif'
    fontSize: '13px'
    fontWeight: 400
  amount:
    fontFamily: 'Inter Variable, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif'
    fontSize: '13px'
    fontWeight: 400
    fontFeature: '"tnum", "ss01", "ss04"'
  label:
    fontFamily: 'Inter Variable, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif'
    fontSize: '12px'
    fontWeight: 400
rounded:
  sm: '2px'
  md: '3px'
  lg: '4px'
  sheet: '4px'
  pill: '999px'
spacing:
  xxs: '2px'
  xs: '4px'
  sm: '8px'
  md: '12px'
  lg: '16px'
  xl: '24px'
components:
  button-primary:
    backgroundColor: '{colors.terracotta}'
    textColor: '{colors.graphite-sidebar}'
    rounded: '{rounded.lg}'
    padding: '5px 10px'
  button-primary-hover:
    backgroundColor: '{colors.terracotta-hover}'
    textColor: '{colors.graphite-sidebar}'
  button-primary-light:
    backgroundColor: '{colors.terracotta-deep}'
    textColor: '{colors.paper-white}'
    rounded: '{rounded.lg}'
    padding: '5px 10px'
  button-primary-light-hover:
    backgroundColor: '{colors.terracotta-deep-hover}'
    textColor: '{colors.paper-white}'
  button-normal:
    backgroundColor: '{colors.graphite-surface}'
    textColor: '{colors.stone-text-dark}'
    rounded: '{rounded.lg}'
    padding: '5px 10px'
  input:
    backgroundColor: '{colors.graphite-surface}'
    textColor: '{colors.stone-text-dark}'
    rounded: '{rounded.lg}'
    padding: '5px'
  balance-chip:
    rounded: '{rounded.sm}'
    padding: '2px 6px'
  spending-bar:
    height: '3px'
    width: '100%'
  to-budget-band:
    typography: '{typography.headline}'
    padding: '14px 16px'
    rounded: '0px'
---

# Design System: Actual Budget

## Overview

**Creative North Star: "The Quiet Ledger"**

Actual reads like a well-kept ledger on a warm desk: stone-toned paper (ivory by day, graphite by night), ruled by 1px hairlines, with one terracotta mark for whatever you act on next. It is a tool people open weekly for years to reconcile accounts and give every dollar a job, so the interface optimizes for routine reading top to bottom, not first impressions. Density stays moderate-to-high (it is still a table-driven app), feedback is instant, decoration is close to zero. The numbers are the interface; a calm serif voice names the page and states the headline figure, and Inter with tabular figures carries every amount.

Geometry is square and flat. Corners stop at 2-4px, persistent surfaces are drawn with hairlines rather than lifted shadows, and lists run edge to edge as ruled rows instead of stacked rounded cards. The system rejects fintech-startup gloss (gradient heroes, glassmorphism, neon) and corporate banking UI (navy-and-gold enterprise-portal density). Dark is the default theme; light is its ivory twin; midnight intentionally keeps the legacy navy/purple palette.

**Key Characteristics:**

- Warm stone neutrals: graphite in dark, ivory in light, never blue-grey
- One terracotta accent for primary action, selection and focus only
- Source Serif 4 for page titles and headline figures; Inter (tabular) for body and every amount
- Square geometry (2-4px radii) and 1px hairlines; shadows only on transient overlays
- Semantic color tokens only; components never hardcode hex values

## Colors

Warm stone neutrals with a single terracotta accent and strict semantic roles for money.

The light and dark themes map the same semantic `theme.*` roles to the `--palette-warm*`, `--palette-clay*` and `--palette-ochre300` scales in `palette.css`. Midnight still maps them to the legacy `--palette-gray*`/`navy*`/`purple*` scales. The hexes below are for orientation only; components route every color through `theme.*`.

### Primary

- **Terracotta** (`terracotta`, dark): primary buttons (with near-black text), active mobile nav item, selected rows and borders, focused input borders. Hover lightens to **Pale Clay** (`terracotta-hover`).
- **Deep Terracotta** (`terracotta-deep`, light): the same roles on ivory, with white button text; hover deepens to `terracotta-deep-hover`. Link text uses the clay scale too (clay300 on graphite, clay600 on ivory).

### Neutral

- **Graphite Page** (`graphite-page`): dark page and mobile header background.
- **Graphite Surface** (`graphite-surface`): tables, cards, menus, modals, inputs in dark.
- **Graphite Raised** (`graphite-raised`): row hover, table header, group header rows in dark.
- **Graphite Hairline** (`graphite-hairline`): dark table borders, row rules, card hairlines.
- **Charcoal Sidebar** (`graphite-sidebar`): dark sidebar and mobile nav bar; also primary-button text.
- **Ivory Page** (`ivory-page`) / **Ivory Surface** (`ivory-surface`) / **Paper White** (`paper-white`): light page, table and card/menu/modal backgrounds, in that order of lift.
- **Ivory Hairline** (`ivory-hairline`): the light theme's translucent border, kept as a `color-mix` so it sits correctly on any ivory step.
- **Stone Text** (`stone-text-dark` / `stone-text-light`): body text in each theme.
- **Stone Muted** (`stone-muted`) and **Stone Light** (`stone-light`): secondary text (`pageTextLight`, status lines, column headers) and decorative glyphs (chevrons, help icons).

### Tertiary (semantic money and status colors)

- **Positive Green** (`positive-green-dark` / `positive-green-light`): positive amounts, funded To Budget.
- **Negative Red** (`negative-red-dark` / `negative-red-light`): negative amounts, overspending, errors.
- **Warning Ochre / Gold** (`warning-ochre-dark` / `warning-gold-light`): underfunded goals, near-limit spending.

Positive balances in the budget are neutral stone, not green: green is reserved for To Budget and explicit positive amounts.

### Named Rules

**The Semantic Token Rule.** Components never use raw palette values or hex codes. Every color goes through the `theme.*` semantic layer (`--color-*` custom properties) so all three themes (dark, light, midnight) stay correct. A hardcoded hex in a component is a bug.

**The One Accent Rule.** Terracotta appears on well under 10% of any screen: primary action, current selection, active nav, focus. It never decorates, and it is never used for money state.

**The Never-Color-Alone Rule.** Positive/negative money state is conveyed by sign and words as well as color; green/red/ochre are reinforcement, never the only signal. The mobile status line ("Overspent by X") exists so the bar and chip are never the only cue.

**The Tinted-Not-Painted Rule.** State fills are tints mixed from the state color into the surface (`color-mix(in srgb, <state> 12%, <surface>)`), never solid state-colored blocks.

## Typography

**Display Font:** Source Serif 4 Variable (with Georgia, Times New Roman, serif)
**Body Font:** Inter Variable (with system-ui fallback stack)
**Label/Mono behavior:** Inter; financial figures switch on tabular OpenType features

**Character:** A calm serif names things and states the one figure that matters; a workhorse sans does everything else. The serif is a reading voice, not decoration: always weight 500, never bold, never for running text or columns.

### Hierarchy

- **Display** (serif 500, 30px, -0.01em): `styles.veryLargeText`. Large balances and rare page-level figures.
- **Headline** (serif 500, 26px, line-height 1.1): desktop page titles (`PageHeader`) and the mobile To Budget figure.
- **Title** (serif 500, 20px): `styles.largeText` section titles; the mobile header title uses the serif at 19px.
- **Category name** (Inter 500, 14px): mobile budget row names.
- **Body** (Inter 400, 13px): default dense app text (`styles.smallText`); 15px/500 (`mediumText`) for emphasized text.
- **Label** (Inter 400, 12px): status lines, table meta, tight secondary text; 10px for the tightest spots.

### Standard Component Sizes

`Button`, `Text` and `Input` accept a `size` prop: `small` | `medium` | `large` | `extra-large` (the `ComponentSize` vocabulary in `packages/component-library/src/tokens.ts`). Omitting the prop renders exactly as before — fully backward compatible. Sizes are responsive: they step up one notch on mobile/narrow for readability and touch targets, and collapse to the compact desktop scale from 512px/730px up. Breakpoint groups mirror the `useResponsive` view modes: narrow <512, small 512–729, medium 730–1099, wide ≥1100.

Text values (fontSize / lineHeight, px):

| Size        | narrow  | small   | medium  | wide    |
| ----------- | ------- | ------- | ------- | ------- |
| small       | 12 / 16 | 12 / 16 | 12 / 16 | 12 / 16 |
| medium      | 13 / 18 | 13 / 18 | 13 / 18 | 13 / 18 |
| large       | 16 / 22 | 15 / 20 | 15 / 20 | 15 / 20 |
| extra-large | 17 / 24 | 17 / 24 | 16 / 22 | 16 / 22 |

Control values for Button/Input (paddingY / paddingX / min-height, px):

| Size        | narrow       | small       | medium      | wide        |
| ----------- | ------------ | ----------- | ----------- | ----------- |
| small       | 3 / 8 / 24   | 3 / 8 / 24  | 3 / 8 / 24  | 3 / 8 / 24  |
| medium      | 5 / 10 / —   | 5 / 10 / —  | 5 / 10 / —  | 5 / 10 / —  |
| large       | 8 / 12 / 36  | 6 / 12 / 32 | 6 / 12 / 32 | 6 / 12 / 32 |
| extra-large | 10 / 14 / 40 | 8 / 12 / 36 | 8 / 12 / 36 | 8 / 12 / 36 |

`size="medium"` reproduces the default control look exactly (5px/10px padding, 13px text, no min-height) and, on controls, inherits line-height like the default; the other sizes apply their scale line-height. `Text` always applies its size's line-height, while the omitted prop forces no line-height at all. `extra-large` narrow hits the 40px mobile touch target. The touch-target guarantee applies to touch-primary controls: at narrow, use `large` or `extra-large` for controls the user taps; `small` stays the compact 24px desktop-density choice at every breakpoint and is not meant for touch-primary controls.

### Named Rules

**The Tabular Number Rule.** Every standalone financial figure renders with `font-feature-settings: "tnum", "ss01", "ss04"` (via `FinancialText` or `styles.tnum`) so digits align in columns and disambiguate. This includes serif headline figures. A proportional-figure money column is a bug.

**The Serif Voice Rule.** Source Serif 4 is reserved for titles and headline figures, at weight 500, through `styles.serifFont`, `veryLargeText` or `largeText`. Tables, amounts in columns, buttons and body text stay in Inter.

## Layout

Desktop is sidebar + page: a fixed stone sidebar, page content padded 20px from 512px up (2px below). Budget tables keep their column grid; the spending bar sits under the Spent cell. Mobile is a single ruled column: header, full-width bands and rows that run edge to edge, nav bar at the bottom.

Spacing follows the `spacing` scale in `tokens.ts` (2/4/8/12/16/24px); controls keep their size-table paddings. Breakpoints: 512px (small), 730px (medium), 1100px (wide). Mobile rows have a 50px minimum height and touch targets of at least 40px.

## Elevation & Depth

Flat. Depth comes from tonal steps of the stone scale (page, then surface, then raised) and 1px hairlines in `tableBorder`. Persistent surfaces (cards, tables, the mobile header, group sections) carry a hairline drawn as `box-shadow: 0 0 0 1px <tableBorder>` (`styles.cardShadow`) or a 1px border, never a lifted shadow. Shadows exist only to lift transient surfaces above the page.

### Shadow Vocabulary

- **Hairline** (`box-shadow: 0 0 0 1px var(--color-tableBorder)`): cards and persistent containers. A border in shadow form, not elevation.
- **Ambient** (`box-shadow: 0 2px 4px 0 rgba(0,0,0,0.1)`): `styles.shadow`; subtle lift on focused big inputs.
- **Large** (`box-shadow: 0 15px 30px 0 rgba(0,0,0,0.11), 0 5px 15px 0 rgba(0,0,0,0.08)`): tooltips, popovers, floating panels.
- **Sheet** (`box-shadow: 0 -4px 24px rgba(0,0,0,0.2)`): mobile bottom sheets.

### Named Rules

**The Transient-Only Rule.** If a surface stays on screen, it gets a hairline. If it appears on interaction and disappears, it may cast a shadow.

## Shapes

Square and ruled. Radii come from `radius` in `tokens.ts`: 2px (`sm`) for chips and small marks, 3px (`md`) for sidebar items and summary panels, 4px (`lg`) for buttons, inputs, cards, menus and the floating action bar, 4px (`sheet`) for the top corners of mobile bottom sheets. Edge-to-edge mobile bands and group sections use 0. `pill` (999px) survives only for true dots and counters (sync dots, count pills, the sheet grab handle), never for containers or amounts. Bars are square-ended.

**The Square Corner Rule.** No container, chip or control exceeds 4px. If something looks like a rounded card, it is off-system.

## Components

Utilitarian and quiet: compact paddings, instant state feedback, hairlines instead of boxes. Values below name the dark theme first; every color routes through the semantic token layer.

### Buttons

- **Shape:** Square-ish (4px radius), compact padding (5px 10px at `medium`)
- **Primary:** Terracotta with near-black text in dark; Deep Terracotta with white text in light. Hover moves one step along the clay scale
- **Normal:** Surface background, stone text, 1px stone border
- **Bare:** Transparent; translucent grey tint on hover/press. The workhorse for in-table actions and the To Budget band
- **Focus:** the global focus outline follows `formInputBorderSelected` (terracotta), falling back to blue before a theme loads

### Inputs / Fields

- **Style:** Surface background, 1px stone border, 4px radius, 5px padding
- **Focus:** Border switches to terracotta; big inputs drop the border and take the ambient shadow instead
- **Big variant:** 10px padding for mobile and prominent forms (40px minimum touch height on mobile)

### Cards / Containers

- **Corner Style:** 4px; 0 when a section runs edge to edge on mobile
- **Background:** Surface on page (graphite on graphite-page, paper white on ivory)
- **Shadow Strategy:** Hairline only (see Elevation & Depth)
- **Internal Padding:** 12-20px

### Chips

- **Balance chip:** non-zero balances sit in a 2px-radius chip tinted 12% from their own state color into the table background, padding 2px 6px, tabular figures. Zero balances are plain text. Only the balance is chipped; Budgeted and Spent figures stay plain
- **Editor pills:** tinted pill background, 4px radius, 3px 5px padding, for rule conditions and inline tokens

### Navigation

- **Sidebar:** Charcoal (dark) or ivory (light) background, stone text; hover steps one tone, selection is a terracotta-tinted fill (22% mix) with clay text in dark, a warm125 fill in light. 1px right hairline on the redesigned sidebar. Status states tint the item gold/green/red
- **Mobile header:** page-colored, serif 19px title, 1px bottom hairline
- **Mobile nav bar:** charcoal (dark) background, stone items, terracotta selected item
- **Mobile sheets:** bottom sheets on the modal surface (`modalBackground`), 4px top corners, grab handle in `pageTextSubdued`, hairline row dividers in `tooltipBorder`. Rows are full-width bare buttons, destructive rows in `errorText`, section labels in sentence case only when a sheet has two or more groups. Dismiss by swipe down, tap outside or Escape; no close button

### Help Hint

A 12px information-circle icon in `pageTextSubdued` beside a label. Mouse hover shows a tooltip; click, tap, Enter or Space opens a 260px popover (12px padding, optional 600-weight title). Used next to column headers and summary labels, never as decoration.

### Signature Component: The Ledger Row (mobile budget)

The mobile budget is a ruled list. At the top, the **To Budget band**: full width, 0 radius, 1px top and bottom hairlines, 14px 16px padding, background tinted 12% from the state color (untinted when neutral), serif 26px figure in the state color on the left, label plus chevron on the right. Below it, one column-header row and full-width group rows with group totals. Each **category row** (min 50px, padding 10px 10px 10px 12px, 6px gap, 1px bottom hairline) holds: name (Inter 500, 14px) left; the Budgeted or Spent figure (toggled) as plain tabular text plus the balance chip right; a **3px full-width spending bar** (track `tableBorder` at 60%, fill `pageTextLight` on track, `warningText` from 85% used, `budgetNumberNegative` when overspent; square ends, no animation); and a muted **status line** (12px, tabular) that says in words "Spent X of Y", "X more needed" (warning), "Overspent by X" (negative), "Nothing spent yet" or "No money assigned". On desktop the same bar runs as an overlay under the Spent cell, hidden until money is spent.

## Do's and Don'ts

### Do:

- **Do** route every color through `theme.*` semantic tokens so dark, light and midnight all work. Test all three; dark is the default.
- **Do** wrap standalone financial numbers in `FinancialText` or apply `styles.tnum`, serif headline figures included.
- **Do** use `styles.serifFont` (Source Serif 4, weight 500) for page titles and the single headline figure of a view, and Inter for everything else.
- **Do** keep corners at 2-4px from the `radius` tokens and separate persistent surfaces with 1px `tableBorder` hairlines.
- **Do** tint state backgrounds with `color-mix` into the surface (12% for chips and bands).
- **Do** keep terracotta scarce: primary action, selection, active nav and focus only.
- **Do** respect the breakpoints: 512px (small), 730px (medium), 1100px (wide); mobile touch targets are at least 40px tall.
- **Do** reuse the existing component library (`@actual-app/components`) before writing new UI.

### Don't:

- **Don't** use fintech-startup gloss: gradient heroes, glassmorphism, neon accents, crypto-dashboard styling (PRODUCT.md anti-reference).
- **Don't** use corporate banking UI patterns: navy-and-gold, enterprise-portal density, legalese energy (PRODUCT.md anti-reference).
- **Don't** hardcode hex values or raw `--palette-*` colors in components; the semantic layer is the only entry point.
- **Don't** rely on color alone for positive/negative amounts.
- **Don't** put lifted shadows on persistent surfaces; a hairline is the only depth a resting surface gets.
- **Don't** use radii above 4px on containers, chips or controls, or pill-shaped amounts; `radius.pill` is for dots and counters only.
- **Don't** use the serif for amounts in columns, buttons, or running text.
- **Don't** use terracotta for money state; money state is green, red and ochre.
- **Don't** use `border-left`/`border-right` thicker than 1px as a colored accent stripe.
- **Don't** animate layout properties; transitions are for color, opacity, and shadow.
