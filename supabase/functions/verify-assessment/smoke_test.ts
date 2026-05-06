// Smoke tests for verify-assessment. Runs against the deployed function
// using DNA_CONNECT_SECRET from the function runtime env.

const URL =
  "https://bxngkvmdvziaxxkbuwia.supabase.co/functions/v1/verify-assessment";
const SECRET = Deno.env.get("DNA_CONNECT_SECRET") ?? "";
const REAL_ID = "507ac74e-b8e3-46a5-86c0-cc8ee762c740";
const REAL_EMAIL = "verify-test@synthetic.example";

async function call(
  headers: Record<string, string>,
  body: unknown | null,
): Promise<{ status: number; json: any }> {
  const res = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: body === null ? undefined : JSON.stringify(body),
  });
  let json: any = null;
  try {
    json = await res.json();
  } catch { /* ignore */ }
  return { status: res.status, json };
}

Deno.test("auth: no header -> 401", async () => {
  const r = await call({}, { email: REAL_EMAIL, assessment_id: REAL_ID });
  console.log("[no-header]", r);
  if (r.status !== 401) throw new Error(`expected 401 got ${r.status}`);
});

Deno.test("auth: wrong secret -> 401", async () => {
  const r = await call(
    { "x-dna-connect-secret": "obviously-wrong-value-xxxxxxxxxxxxxx" },
    { email: REAL_EMAIL, assessment_id: REAL_ID },
  );
  console.log("[wrong-secret]", r);
  if (r.status !== 401) throw new Error(`expected 401 got ${r.status}`);
});

Deno.test("auth: correct secret + no body -> 400", async () => {
  const r = await call({ "x-dna-connect-secret": SECRET }, null);
  console.log("[no-body]", r);
  if (r.status !== 400) throw new Error(`expected 400 got ${r.status}`);
});

Deno.test("happy path: verified=true", async () => {
  const r = await call(
    { "x-dna-connect-secret": SECRET },
    { email: REAL_EMAIL, assessment_id: REAL_ID },
  );
  console.log("[happy]", r);
  if (r.status !== 200 || r.json?.verified !== true) {
    throw new Error(`expected verified=true, got ${JSON.stringify(r)}`);
  }
});

Deno.test("not_found path", async () => {
  const r = await call(
    { "x-dna-connect-secret": SECRET },
    {
      email: REAL_EMAIL,
      assessment_id: "00000000-0000-0000-0000-000000000000",
    },
  );
  console.log("[not-found]", r);
  if (r.json?.reason !== "assessment_not_found") {
    throw new Error(`expected assessment_not_found, got ${JSON.stringify(r)}`);
  }
});

Deno.test("email_mismatch path", async () => {
  const r = await call(
    { "x-dna-connect-secret": SECRET },
    { email: "wrong-email@synthetic.example", assessment_id: REAL_ID },
  );
  console.log("[mismatch]", r);
  if (r.json?.reason !== "email_mismatch") {
    throw new Error(`expected email_mismatch, got ${JSON.stringify(r)}`);
  }
});

Deno.test("invalid uuid format -> 400", async () => {
  const r = await call(
    { "x-dna-connect-secret": SECRET },
    { email: REAL_EMAIL, assessment_id: "not-a-uuid" },
  );
  console.log("[bad-uuid]", r);
  if (r.status !== 400) throw new Error(`expected 400 got ${r.status}`);
});
