const URL = "https://bxngkvmdvziaxxkbuwia.supabase.co/functions/v1/verify-assessment";
const SECRET = Deno.env.get("DNA_CONNECT_SECRET") ?? "";

Deno.test("rich payload returned for backfilled hello@be.ie", async () => {
  const res = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-dna-connect-secret": SECRET },
    body: JSON.stringify({
      email: "hello@be.ie",
      assessment_id: "a8e9068a-c0be-4cad-84eb-e48b6d0cebbf",
    }),
  });
  const json = await res.json();
  console.log("STATUS", res.status);
  console.log("RESPONSE", JSON.stringify(json, null, 2).slice(0, 4000));
  console.log("KEYS", Object.keys(json));
  console.log("dim_count", json.dimension_scores ? Object.keys(json.dimension_scores).length : 0);
  console.log("matching_keys", json.matching_results ? Object.keys(json.matching_results) : null);
  console.log("comp_keys", json.comprehensive_scores ? Object.keys(json.comprehensive_scores).length : 0);
  if (!json.verified) throw new Error("not verified");
});
