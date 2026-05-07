const URL = "https://bxngkvmdvziaxxkbuwia.supabase.co/functions/v1/verify-assessment";
const SECRET = Deno.env.get("DNA_CONNECT_SECRET") ?? "";

Deno.test("backfill hello@be.ie verified", async () => {
  const res = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-dna-connect-secret": SECRET },
    body: JSON.stringify({ email: "hello@be.ie", assessment_id: "a8e9068a-c0be-4cad-84eb-e48b6d0cebbf" }),
  });
  const json = await res.json();
  console.log("STATUS", res.status, "BODY", JSON.stringify(json));
});
