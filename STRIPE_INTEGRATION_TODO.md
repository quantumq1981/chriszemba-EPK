# Stripe Checkout (embedded form): remaining setup

Single source of truth for finishing the Stripe Checkout integration. Everything below is still
to do unless marked done.

> **Important: this needs Cloudflare Pages.** The site is live on GitHub Pages, which only serves
> static files and cannot run the `/api/create-checkout-session` endpoint. Until the site is served
> by Cloudflare Pages (steps in [HOSTING.md](HOSTING.md)), `/pay/checkout/` shows a fallback message
> pointing clients to their invoice link and [/pay/](pay/index.html). Stripe **invoices** (Dashboard)
> keep working either way and remain the main way to bill a gig.

## Values to Replace

The following values are placeholders and must be updated before going live.

**Files containing placeholders:**
- [functions/api/create-checkout-session.js](functions/api/create-checkout-session.js)
- [pay/checkout/index.html](pay/checkout/index.html)

| Field | Current Value | What to Set |
|-------|--------------|-------------|
| mode | payment | Keep `"payment"` for one-time charges (a retainer, balance, or deposit). Use `"subscription"` only for recurring billing, which this business does not currently use. |
| line_items[].price | price_... | Your actual Stripe Price ID from the Dashboard (https://dashboard.stripe.com/prices) or API, e.g. a fixed "Booking deposit" price. Gig fees vary per quote, so a fixed price only fits a standard amount; for custom amounts keep using Stripe invoices. |
| STRIPE_PUBLISHABLE_KEY (in the page script) | pk_test_... | Your publishable key from https://dashboard.stripe.com/apikeys (`pk_test_…` while testing, `pk_live_…` in production). Publishable keys are safe in page code. |
| STRIPE_SECRET_KEY (environment variable) | not set | Your secret key (`sk_test_…` / `sk_live_…`), set in **Cloudflare Pages → Settings → Variables and Secrets** as a *secret*, never in this repo. For local testing, copy [.dev.vars.example](.dev.vars.example) to `.dev.vars` (git-ignored). |

## Configured Parameters

These parameters were configured in Checkout Studio and are already set correctly.

**Files containing these parameters:**
- [functions/api/create-checkout-session.js](functions/api/create-checkout-session.js)

| Parameter | Value |
|-----------|-------|
| ui_mode | form |
| billing_address_collection | required |
| phone_number_collection | `{ enabled: false }` |
| automatic_tax | `{ enabled: false }` |
| submit_type | auto |
| name_collection | `{ individual: { enabled: true } }` |
| integration_identifier | custom_embedded_web_0002 |
| payment_method_collection | always (applied only when `mode` is `"subscription"`, per Stripe's rules) |

Client appearance (theme `night`, spaced inputs, 4px radius, and the configured colors) is set in
[pay/checkout/index.html](pay/checkout/index.html).

## Setup

1. **Dependencies:** `stripe@23.0.0` is in `package.json` (`npm install`). It pins Stripe API
   version `2026-09-30.endive`, which is later than the `2026-03-25.dahlia` minimum for
   `ui_mode: "form"`.
2. **Hosting:** connect the repo to Cloudflare Pages per [HOSTING.md](HOSTING.md) (build command
   `npm run build`, output directory `/`). Cloudflare picks up the `functions/` folder automatically.
3. **Secret key:** in Cloudflare Pages → Settings → Variables and Secrets, add `STRIPE_SECRET_KEY`
   as a secret for Production (live key) and Preview (test key).
4. **Publishable key and price:** replace the placeholders in the table above.
5. **Local test (optional):** `cp .dev.vars.example .dev.vars`, add a test key, then run
   `npx wrangler pages dev .` and open `http://localhost:8788/pay/checkout/`.

## Files added

```
functions/api/create-checkout-session.js   Cloudflare Pages Function: POST -> { client_secret }
pay/checkout/index.html                    Embedded Checkout form page (noindex, not linked yet)
.dev.vars.example                          Local env template (real .dev.vars is git-ignored)
STRIPE_INTEGRATION_TODO.md                 This file
```

## How it works

1. A client opens `/pay/checkout/`. The page loads Stripe.js from `js.stripe.com/dahlia`
   (required for PCI; never bundle it).
2. The page POSTs to `/api/create-checkout-session`. The Cloudflare Function creates a Checkout
   Session with the configured parameters and returns `{ client_secret }` as JSON.
3. `stripe.initCheckoutFormSdk({ clientSecret, appearance })` renders the embedded form, which
   collects the client's name, billing address, and payment details inside Stripe's iframe.
4. On submit, the form's `confirm` event calls `actions.confirm(...)` and Stripe completes the
   payment. The payment then appears in the Stripe Dashboard, and Stripe emails a receipt if
   receipts are enabled.
5. If the endpoint is unreachable (e.g. still on GitHub Pages), the page shows a fallback message
   instead of a blank form.

## Testing

Use **test mode** keys (`pk_test_…` / `sk_test_…`) and these cards with any future expiry date,
any CVC, and any postal code:

| Card number | Result |
|-------------|--------|
| 4242 4242 4242 4242 | Payment succeeds |
| 4000 0025 0000 3155 | Requires 3D Secure authentication |
| 4000 0000 0000 9995 | Declined (insufficient funds) |

More: https://docs.stripe.com/testing

## Next steps

- **Link the page** from [/pay/](pay/index.html) only after the Cloudflare cutover and a successful
  test payment.
- **Fulfillment / records:** there is no webhook handler yet (the site has no database). Payments
  are visible in the Stripe Dashboard. If you want automatic booking updates, add a
  `checkout.session.completed` webhook function (with `STRIPE_WEBHOOK_SECRET`) later.
- **Products:** create a Price for each fixed amount you want to sell online (e.g. a standard
  booking deposit). Custom gig fees should keep going through Stripe invoices.
- **Return page (optional):** the form confirms in place. Add a `return_url` only if you enable
  payment methods that redirect away from the page.

## Resources

- Stripe support: https://support.stripe.com
- Stripe MCP / docs for AI tools: https://docs.stripe.com/mcp
- Embedded form quickstart: https://docs.stripe.com/checkout/form/quickstart
