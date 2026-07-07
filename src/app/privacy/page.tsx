import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Privacy Policy - NewBi",
  description: "How NewBi collects, uses, and protects your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader
        title="Privacy Policy"
        subtitle="Last updated 7 July 2026"
        backHref="/"
        backLabel="Back to all businesses"
      />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-[#FFF5F0] rounded-2xl border border-[#2D1A1F]/10 p-6 sm:p-8 flex flex-col gap-6 text-sm text-[#2D1A1F]/90 leading-relaxed">
          <p>
            NewBi (&quot;we&quot;, &quot;us&quot;) operates newbi.co.uk and the NewBi mobile app.
            This policy explains what data we collect and how we use it.
          </p>

          <section>
            <h2 className="text-lg font-bold text-[#2D1A1F] mb-2">What we collect</h2>
            <p>Depending on how you use NewBi, we may collect:</p>
            <ul className="list-disc pl-5 mt-2 flex flex-col gap-1">
              <li>Name, date of birth, phone number, email address, and location</li>
              <li>Account details you provide when signing up or logging in</li>
              <li>Business listings, contacts, and reviews you add to the site</li>
              <li>Your Instagram account, if you choose to connect it</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#2D1A1F] mb-2">How we use it</h2>
            <p>
              We use your data to run your account, show and manage business listings and reviews,
              send you emails related to your activity on NewBi (e.g. confirmations and updates),
              and, if you connect Instagram, to access your Instagram account on your behalf.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#2D1A1F] mb-2">Who we share it with</h2>
            <p>
              We don&apos;t sell your data. We share it only with the service providers that help us
              run NewBi: Supabase (database and authentication), Resend (email delivery), Vercel
              (hosting and analytics), and Meta/Instagram (only if you connect your Instagram account).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#2D1A1F] mb-2">Instagram data</h2>
            <p>
              If you connect your Instagram account, we store an access token so the app can act on
              your behalf. You can disconnect Instagram at any time from your account settings, which
              removes our access.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#2D1A1F] mb-2">Your rights</h2>
            <p>
              You can ask us to access, correct, or delete your data at any time by contacting us
              below.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#2D1A1F] mb-2">Contact us</h2>
            <p>
              For any privacy questions or requests, email{" "}
              <a href="mailto:privacy@newbi.co.uk" className="text-[#C4909A] font-semibold hover:underline">
                privacy@newbi.co.uk
              </a>
              .
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
