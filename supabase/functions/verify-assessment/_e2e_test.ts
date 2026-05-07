const URL = "https://bxngkvmdvziaxxkbuwia.supabase.co/functions/v1/verify-assessment";
const SECRET = Deno.env.get("DNA_CONNECT_SECRET") ?? "";

Deno.test("e2e prog-test", async () => {
  const res = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-dna-connect-secret": SECRET },
    body: JSON.stringify({
      email: "prog-test-2026-05-07@be.ie",
      assessment_id: "86297828-dbea-42c6-a6e1-f8a40016a810",
    }),
  });
  console.log("STATUS", res.status);
  console.log("BODY", await res.text());
});
