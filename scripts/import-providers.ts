import { createClient } from "@supabase/supabase-js";
import providers from "./providers.json";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  console.log(`Importing ${providers.length} provider(s)...`);

  const { data, error } = await supabase
    .from("providers")
    .upsert(providers, { onConflict: "name" })
    .select("id, name");

  if (error) {
    console.error("Import failed:", error.message);
    process.exit(1);
  }

  console.log(`Done! Imported ${data.length} provider(s):`);
  data.forEach((p) => console.log(`  [${p.id}] ${p.name}`));
}

main();
