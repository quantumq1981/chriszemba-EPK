// Cloudflare Pages Function: POST /api/create-checkout-session
// Creates a Stripe Checkout Session for the embedded payment form on /pay/checkout/.
//
// This site is static. GitHub Pages ignores this folder; the endpoint only runs once the site is
// served by Cloudflare Pages (see HOSTING.md). The secret key comes from the Cloudflare Pages
// environment (Settings -> Variables and Secrets), never from this repo.
import Stripe from "stripe";

export async function onRequestPost({ env }) {
  if (!env.STRIPE_SECRET_KEY) {
    return json({ error: "Stripe is not configured on this deployment." }, 503);
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2026-09-30.endive" });

  // TODO(STRIPE_INTEGRATION_TODO.md): "payment" is right for one-time charges such as a gig
  // retainer or balance. payment_method_collection only applies to "subscription" mode.
  const mode = "payment";

  const sessionParams = {
    // Configured in Checkout Studio (fixed_by_ui): keep as-is.
    ui_mode: "form",
    billing_address_collection: "required",
    phone_number_collection: { enabled: false },
    automatic_tax: { enabled: false },
    submit_type: "auto",
    name_collection: { individual: { enabled: true } },
    integration_identifier: "custom_embedded_web_0002",
    // Placeholders (sample_only): replace per STRIPE_INTEGRATION_TODO.md.
    mode,
    line_items: [{ price: "price_...", quantity: 1 }],
  };
  if (mode === "subscription") {
    sessionParams.payment_method_collection = "always";
  }

  try {
    const session = await stripe.checkout.sessions.create(sessionParams);
    return json({ client_secret: session.client_secret });
  } catch (err) {
    console.error("Checkout Session creation failed:", err.message);
    return json({ error: "Could not start checkout." }, 500);
  }
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
