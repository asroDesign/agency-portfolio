// Zarinpal payment integration with graceful sandbox/mock fallback.
// When ZARINPAL_MERCHANT_ID is not configured, payments are simulated locally
// so the full flow remains functional in the demo environment.

const MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID || "";
const SANDBOX = process.env.ZARINPAL_SANDBOX === "true" || !MERCHANT_ID;

export function getRequestOrigin(req: Request): string {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
  const proto = req.headers.get("x-forwarded-proto") || "http";
  return `${proto}://${host}`;
}

const BASE = SANDBOX
  ? "https://sandbox.zarinpal.com/pg"
  : "https://api.zarinpal.com/pg";

export interface PaymentRequest {
  amount: number; // toman
  description: string;
  callbackUrl: string;
}

export interface PaymentResult {
  mock: boolean;
  authority: string;
  redirectUrl: string;
}

export async function requestPayment(
  req: PaymentRequest,
): Promise<PaymentResult> {
  if (SANDBOX && !MERCHANT_ID) {
    // Mock mode: generate a fake authority and redirect straight to callback.
    const authority = `MOCK-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    return {
      mock: true,
      authority,
      redirectUrl: `${req.callbackUrl}?Authority=${authority}&Status=OK`,
    };
  }

  const res = await fetch(`${BASE}/v4/payment/request.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      merchant_id: MERCHANT_ID,
      amount: req.amount,
      callback_url: req.callbackUrl,
      description: req.description,
    }),
  });
  const data = await res.json();
  const { code, authority } = data?.data ?? {};

  if (code !== 100 || !authority) {
    throw new Error("خطا در اتصال به درگاه پرداخت");
  }

  return {
    mock: false,
    authority,
    redirectUrl: `${SANDBOX ? "https://sandbox.zarinpal.com" : "https://www.zarinpal.com"}/pg/StartPay/${authority}`,
  };
}

export interface VerifyResult {
  refId: string;
}

export async function verifyPayment(authority: string, amount: number): Promise<VerifyResult> {
  if (SANDBOX && !MERCHANT_ID) {
    return { refId: `REF-${Date.now()}` };
  }

  const res = await fetch(`${BASE}/v4/payment/verify.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ merchant_id: MERCHANT_ID, amount, authority }),
  });
  const data = await res.json();
  const { code, ref_id } = data?.data ?? {};

  if (code !== 100 && code !== 101) {
    throw new Error("پرداخت تأیید نشد");
  }
  return { refId: String(ref_id) };
}
