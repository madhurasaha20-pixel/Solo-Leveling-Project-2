# core/: Services, Models, Contracts (owner: Joshua Easo)

**Read `contracts/CONTRACTS.md` first.** It lists every endpoint, every JSON shape and every error code.

## Rules
- Components **never** use HttpClient or the mock JSON directly. Call a service.
- Import types from `core/models` (`import { Account, Transaction, ApiError } from '../core/models';`).
- Every service method returns an `Observable`. On failure it errors with an `ApiError`,
  so `err.message` can go straight into a toast and `err.field` tells you which input to highlight.
- Need a new field or endpoint? Message me, and we'll update CONTRACTS.md, the model and the mock together.

## Setup (one time, whoever owns AppModule)
```ts
import { provideCore } from './core/core.providers';

@NgModule({ ..., providers: [provideCore()] })
```

## Cheat sheet
| I'm building... | Use |
|---|---|
| Login page | `auth.login({ email, password })` |
| Register page | `auth.register({ name, email, password })` |
| Header / Nav (user name, logout) | `auth.currentUser$`, `auth.logout()` |
| Route guard | `auth.isLoggedIn()` |
| Balance card | `accounts.loadMyAccount()` once, then `accounts.account$` |
| Transaction history card | `transactions.loadRecent(accountId, 10)` once, then `transactions.recent$` |
| Deposit / Withdraw / Transfer forms | `transactions.deposit / withdraw / transfer(accountId, { amount, ... })` |

`account$` and `recent$` refresh automatically after any deposit, withdraw or transfer.

## Test logins
`user@example.com` / `password` (normal), `sam@example.com` / `password123` ($25, for insufficient funds).
Transfer target: `ACC-1002`. Full list in CONTRACTS.md.

## How the mock works
`interceptors/mock-backend.interceptor.ts` pretends to be the server, with a ~0.7 to 1 second delay
so loading states show. Data starts from `src/assets/mock-data/*.json` and changes are kept until the tab closes.
When the real backend exists, set `useMockBackend: false` in `environments/environment.ts`. Nothing else changes.
