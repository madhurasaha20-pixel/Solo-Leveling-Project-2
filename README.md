# Solo-Leveling-Project-2

## Run the frontend

Use Node 24.21.0 and npm 11.19.0. Angular and Angular CLI are pinned to 22.2.1.

```powershell
cd bank-of-cli-frontend
npm.cmd ci
npm.cmd start
```

Open http://localhost:4200. Run `npm.cmd run build` for a production build.

## Header and page headings

The theme comes from the supplied Angular/Tailwind starter. Its rules are preserved
in `bank-of-cli-frontend/docs/design-system.md`; `src/styles.css` contains the exact theme.

`bc-app-header` receives `userName` and navigation `links`, and emits `signOut`.
The app shell connects those inputs to the existing AuthService. Signed-out users
see Sign in; signed-in users see their initials, name, and Sign out.

`bc-page-heading` accepts `title` and optional `description`. Place feature content
below it with `mt-8`, as required by the style guide. The dashboard, move-money,
and login routes currently provide headings only; their forms and cards belong
to the respective feature implementations.

The header and heading components live in `src/app/shared/ui/`. Header links and
controls have a minimum 40 px height on every viewport. Sign-out immediately
clears the local session and shows confirmation on the sign-in route.

The more recent style specification at
https://claude.ai/artifact/SDS7j8JGyZndwwusj9Fg1g takes precedence over the ZIP's
examples: route titles use `·`, header controls use 40 px rather than the starter's
32 px, and pages include a description and favicon. The existing merged API
contracts remain the team's source of truth; adopting the reference's different
user, account, and transaction models requires coordinated service changes.
