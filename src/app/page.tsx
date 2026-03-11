import PageHeader from "@/components/PageHeader";
import ProviderSearch from "@/components/ProviderSearch";
import { getProviders } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const providers = await getProviders();

  return (
    <>
      <PageHeader
        title="NewBi"
        subtitle="Find trusted services in Sheffield"
        showJoinUs
      />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <ProviderSearch providers={providers} />
      </main>
    </>
  );
}
