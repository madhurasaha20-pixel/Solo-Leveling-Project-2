# Bank of CLI — Angular + Tailwind starter

Drop-in theme, shared components, mock services and three page templates for the Bank of CLI Part 2 SPA. Built and tested on Angular 21 with Tailwind CSS 4. It should also work on Angular 19 or 20 without changes.

Demo login: `demo@bankofcli.dev` / `password123`. Any other password shows the invalid-credentials state.

## Adding it to your team's project

1. Install Tailwind (or run `ng add tailwindcss`):
   ```
   npm install -D tailwindcss @tailwindcss/postcss postcss
   ```
2. Copy these into your project:
   - `.postcssrc.json` → project root
   - `src/styles.css` → replaces yours (this is the theme)
   - `src/index.html` → the `<meta>` tags and the Google Fonts `<link>`s
   - `src/app/core/`, `src/app/shared/` → as is
   - `public/mock/` → the mock JSON the services read
   - `src/app/features/` → optional; these are reference pages to copy from
3. In `app.config.ts`, add `provideHttpClient()`. Add `withComponentInputBinding()` to `provideRouter(...)` too.
4. Put `<bc-toast-region />` once in your root component.

## Folder layout

```
src/app/
  core/
    models/contract.ts        ← the API contract (the "Contract Layer")
    services/                 ← AccountService, AuthService, ToastService (the "Service Layer")
  shared/
    ui/                       ← bc-* components (the "Component Layer") — never fetch data
    pipes/money.pipe.ts       ← {{ value | money }}, the only way to format money
    validators/               ← amountValidator, fieldError
  features/                   ← pages: compose shared/ui + call services
public/mock/*.json            ← mock responses matching contract.ts exactly
```

Components receive data through inputs and emit events. Pages call services. Services return Observables with a simulated ~900 ms delay. When the real backend lands, only the service method bodies change.

## Tailwind rules for this project

`styles.css` removes Tailwind's default palette, radii, shadows and text sizes. `bg-purple-500`, `rounded-2xl`, `shadow-lg` and `text-xl` don't exist here and will do nothing. Use only the classes below.

| Need | Use | Never |
|---|---|---|
| Page background | `bg-surface` (set on `<html>` already) | `bg-gray-*`, `bg-white` |
| Cards, inputs, modals | `bg-surface-raised` | |
| Table headers, skeletons, tab rail | `bg-surface-sunken` | |
| Text | `text-ink`, secondary `text-ink-muted` | any other gray |
| Accent / primary action | `bg-brand text-on-brand`, hover `bg-brand-hover`, tint `bg-brand-tint` | gradients, glows |
| Money in | `text-credit`, `bg-credit-tint` (always with `+` and a label) | |
| Errors / destructive | `text-debit`, `bg-debit-tint`, `bg-debit text-on-debit` | red for normal spending |
| Pending / warning | `text-pending`, `bg-pending-tint` | |
| Borders | `border` (defaults to the hairline), controls `border-border-strong` | |
| Radius | `rounded-md` for everything, `rounded-sm` for badges, `rounded-full` for spinner/avatar | `rounded-lg`, `rounded-xl`… |
| Elevation | `shadow-raised` (cards), `shadow-overlay` (toasts, modals) | anything else |
| Type | `text-heading-1/2/3`, `text-body`, `text-body-sm`, `text-label` | |
| Money / IDs | `font-mono tabular-nums` + `text-amount`, `text-amount-display`, `text-code` | |
| Weights | `font-medium` (labels, amounts), `font-semibold` (headings) | `font-bold`, `font-light` |
| Widths | `max-w-content` (1120px page), `max-w-form` (440px forms) | |

**Spacing (4-point scale).** Use only these steps: `1` (4px), `2` (8px), `3` (12px), `4` (16px), `6` (24px), `8` (32px), `12` (48px) and `16` (64px). That applies to `p-`, `m-`, `gap-`, `px-` and so on. Card padding is `p-4 sm:p-6`, the gap between cards is `gap-6`, and the page title sits `mt-8` above the first card. `p-5`, `gap-7` and arbitrary values like `p-[18px]` are off-grid.

**Dark mode is automatic.** It follows the OS setting. Set `<html data-theme="dark">` or `"light"` to override. Don't write `dark:` classes; the color tokens switch on their own.

**Motion.** Use `transition-colors duration-[120ms]` on interactive things and nothing else. No `hover:scale-*`, `hover:-translate-y-*`, `animate-bounce` or `animate-pulse` on content.

**Focus.** A global 2px `brand` outline is already applied. Never add `outline-none` without a replacement.

## Component cheat sheet

```html
<bc-button (click)="save()">Save</bc-button>
<bc-button variant="secondary|ghost|danger" size="sm" fullWidth [loading]="busy()" type="submit">…</bc-button>

<bc-text-field label="Amount" type="amount" formControlName="amount" [hint]="…" [error]="amountError()" />
<bc-select label="From account" [options]="opts()" formControlName="from" placeholder="Choose an account" />

<bc-card title="Recent transactions" flush>
  <bc-button cardAction variant="ghost" size="sm">View all</bc-button>
  <bc-transaction-list [transactions]="txns()" [loading]="loading()" />
</bc-card>

<bc-amount [value]="balance()" size="display" />
<bc-amount [value]="-84.2" signed />
<bc-badge tone="credit|debit|pending|neutral">Deposit</bc-badge>
<bc-alert tone="error" title="Email or password is incorrect">Check both and try again.</bc-alert>
<bc-tabs label="Transaction type" [tabs]="tabs" [(value)]="mode" />
<bc-skeleton width="200px" [height]="36" />
<bc-modal [open]="confirming()" title="Confirm transfer" [busy]="busy()" (closed)="confirming.set(false)">…</bc-modal>
```

Toasts: `inject(ToastService).success('Deposit complete', 'Checking •••• 4417 is now $12,600.52.')`.

## UX rules the pages follow

- Every service call sets a loading state, either a button's `[loading]` or skeletons, and ends in a toast or an inline error.
- Validation messages appear on blur or submit, not while typing. Use `fieldError(control, submitted)`.
- Every transfer, and any deposit or withdrawal over $1,000, opens a confirmation modal first.
- There is one primary button per screen, and button labels name the result ("Deposit $120.00").
- No emoji, sparkles, purple, gradients, fake testimonials or `href="#"` links.
