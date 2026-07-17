import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter, PageHeader, Section } from "@/components/site/primitives";
import { SITE_CONTACT } from "@/lib/site-contact";

const CANONICAL = "https://qfloww.pridemarketing.co.in/privacy";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Privacy Policy — Qfloww" },
      {
        name: "description",
        content:
          "How Qfloww and Pride Marketing collect, use, store, and protect personal data. Compliant with the Digital Personal Data Protection Act, 2023 and the Information Technology Act, 2000.",
      },
      { property: "og:title", content: "Privacy Policy — Qfloww" },
      {
        property: "og:description",
        content:
          "Qfloww's privacy policy under Indian law: what data we collect, why, how long we keep it, and your rights as a Data Principal.",
      },
      { property: "og:url", content: CANONICAL },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
  }),
});

function PrivacyPage() {
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <SiteHeader />
      <main>
        <PageHeader
          index="01"
          eyebrow="Legal"
          title={<>Privacy Policy.</>}
          lede={`How ${SITE_CONTACT.legalEntity} handles personal data collected through Qfloww and its public booking pages. Written to comply with the Digital Personal Data Protection Act, 2023 (DPDP Act) and the Information Technology Act, 2000 read with the SPDI Rules, 2011.`}
        />

        <Section>
          <div className="mx-auto max-w-3xl space-y-12 font-serif text-[1.0625rem] leading-relaxed text-ink">
            <p className="section-marker font-sans">Effective {SITE_CONTACT.effectiveDate}</p>

            <Clause n="01" title="Who we are">
              <p>
                Qfloww ("Qfloww", "we", "us", "our") is a Software-as-a-Service booking and queue management
                platform operated by <strong>{SITE_CONTACT.legalEntity}</strong>, having its principal place of
                business at {SITE_CONTACT.address}. For the purposes of the DPDP Act, {SITE_CONTACT.legalEntity} is
                the <strong>Data Fiduciary</strong> in respect of personal data collected through our marketing
                website and administrative surfaces, and a <strong>Data Processor</strong> in respect of personal
                data uploaded, submitted, or received by our business customers ("Businesses") through the Qfloww
                platform.
              </p>
            </Clause>

            <Clause n="02" title="Scope of this Policy">
              <p>
                This Policy applies to (a) visitors to <code>qfloww.pridemarketing.co.in</code> and any other
                domain we operate for Qfloww, (b) end-customers who book an appointment through a Business's
                public booking page (<code>/book/&lt;business-slug&gt;</code>), and (c) staff and owners of
                Businesses who hold a Qfloww account.
              </p>
              <p>
                Where a Business uses Qfloww to collect personal data from its end-customers, that Business is
                the Data Fiduciary for such data and is independently responsible for its own privacy notice,
                lawful basis, and retention. We act on that Business's instructions.
              </p>
            </Clause>

            <Clause n="03" title="Data we collect">
              <p>We collect the categories of personal data described below.</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong>Account data</strong> (business owners and staff): name, email address, hashed
                  password, business name, business slug, business type, role, and login timestamps.
                </li>
                <li>
                  <strong>Booking data</strong> (end-customers of a Business): name, phone number, email
                  address (optional), selected service, selected slot, and booking date.
                </li>
                <li>
                  <strong>Communication data</strong>: emails we send you (transactional and authentication),
                  delivery status, and any correspondence you send to us.
                </li>
                <li>
                  <strong>Technical data</strong>: IP address, user-agent, and standard server logs, retained
                  for security and abuse-prevention purposes.
                </li>
                <li>
                  <strong>Cookies</strong>: strictly-necessary cookies for authentication and session
                  management. We do not use advertising or cross-site tracking cookies.
                </li>
              </ul>
              <p>
                We do not knowingly collect <em>sensitive personal data or information</em> as defined under
                Rule 3 of the SPDI Rules, 2011, and we do not require passwords, financial account details, or
                biometric data to use Qfloww's booking flow.
              </p>
            </Clause>

            <Clause n="04" title="Purposes and lawful basis">
              <p>
                We process personal data for the following purposes, on the lawful bases set out in Section 4
                of the DPDP Act, 2023:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong>Providing the Service</strong> — creating accounts, activating businesses, showing
                  bookings, running the reception queue, and sending confirmation emails. Basis: performance of
                  the contract with the Business, and consent of end-customers who submit a booking.
                </li>
                <li>
                  <strong>Security and abuse prevention</strong> — rate-limiting, RLS-based access control, and
                  investigating incidents. Basis: legitimate use under Section 7(a).
                </li>
                <li>
                  <strong>Legal compliance</strong> — responding to lawful requests from courts, regulators,
                  and government agencies under Section 7(c) of the DPDP Act and applicable Indian law.
                </li>
                <li>
                  <strong>Service communications</strong> — password resets, account verification, activation
                  notices, and transactional booking confirmations.
                </li>
              </ul>
              <p>
                We do not sell personal data. We do not use personal data for behavioural advertising or
                profiling.
              </p>
            </Clause>

            <Clause n="05" title="How we store and protect data">
              <p>
                Personal data is stored on managed infrastructure hosted within data centres operated by our
                cloud providers. We rely on Row-Level Security ("RLS"), least-privilege access, encrypted
                transport (HTTPS/TLS), and encrypted-at-rest storage. Passwords are stored only as salted
                hashes; we never see or log them in plaintext.
              </p>
              <p>
                We follow reasonable security practices and procedures within the meaning of Section 43A of the
                Information Technology Act, 2000 and Rule 8 of the SPDI Rules, 2011, and implement the
                organisational and technical safeguards required under Section 8 of the DPDP Act, 2023.
              </p>
            </Clause>

            <Clause n="06" title="Retention">
              <p>
                We retain personal data only for as long as it is required for the purpose for which it was
                collected, or for the period required by law.
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Booking records are retained for the operational lifetime of the Business's account.</li>
                <li>Account records are retained for the duration of the subscription and up to 12 months after termination for billing, audit, and dispute-resolution purposes.</li>
                <li>Server and security logs are retained for up to 12 months.</li>
                <li>Email delivery logs are retained for up to 6 months.</li>
              </ul>
              <p>
                When retention periods expire, data is deleted or irreversibly anonymised.
              </p>
            </Clause>

            <Clause n="07" title="Sharing and processors">
              <p>
                We do not sell personal data. We share personal data only with a limited set of processors that
                help us operate Qfloww under written contracts and confidentiality obligations:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Our managed database, authentication, and email delivery providers.</li>
                <li>Our hosting and edge-runtime provider.</li>
                <li>Law-enforcement or government authorities, where disclosure is required by a lawful order under Indian law.</li>
              </ul>
              <p>
                Some processors may store data outside India. Any cross-border transfer is carried out in
                accordance with Section 16 of the DPDP Act and applicable notifications issued by the Central
                Government.
              </p>
            </Clause>

            <Clause n="08" title="Your rights as a Data Principal">
              <p>
                If you are an identified natural person whose personal data we process, you have the following
                rights under Chapter III of the DPDP Act, 2023:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>The right to obtain a summary of the personal data we hold about you and the processing activities we carry out.</li>
                <li>The right to correction, completion, updating, and erasure of your personal data.</li>
                <li>The right to grievance redressal in respect of any act or omission by us.</li>
                <li>The right to nominate another individual to exercise these rights in the event of your death or incapacity.</li>
                <li>The right to withdraw consent at any time, on the same footing on which it was given.</li>
              </ul>
              <p>
                To exercise any of these rights, write to our Grievance Officer at{" "}
                <a className="underline" href={`mailto:${SITE_CONTACT.email}`}>{SITE_CONTACT.email}</a>. We will
                respond within the timelines prescribed under the DPDP Act and the SPDI Rules.
              </p>
            </Clause>

            <Clause n="09" title="Grievance officer">
              <p>
                In accordance with Rule 5(9) of the SPDI Rules, 2011 and Section 8(9) of the DPDP Act, 2023,
                the details of our Grievance Officer are as follows:
              </p>
              <ul className="list-none space-y-1 pl-0">
                <li><strong>Name:</strong> Grievance Officer, {SITE_CONTACT.legalEntity}</li>
                <li><strong>Email:</strong> <a className="underline" href={`mailto:${SITE_CONTACT.email}`}>{SITE_CONTACT.email}</a></li>
                <li><strong>Phone:</strong> <a className="underline" href={`tel:${SITE_CONTACT.phoneTel}`}>{SITE_CONTACT.phone}</a></li>
                <li><strong>Address:</strong> {SITE_CONTACT.address}</li>
                <li><strong>Hours:</strong> Monday to Saturday, 10:00 – 19:00 IST</li>
              </ul>
              <p>
                Complaints are acknowledged within forty-eight (48) hours and, where possible, resolved within
                thirty (30) days from the date of receipt.
              </p>
            </Clause>

            <Clause n="10" title="Children">
              <p>
                Qfloww is a business-to-business platform. We do not knowingly collect personal data of
                children under the age of eighteen (18) years without verifiable parental consent, as required
                by Section 9 of the DPDP Act, 2023. If you believe a child's data has been collected in error,
                please contact us so it can be deleted.
              </p>
            </Clause>

            <Clause n="11" title="Changes to this policy">
              <p>
                We may update this Policy from time to time to reflect changes in law, in our practices, or in
                the Qfloww service. The "Effective" date at the top of this page will always reflect the most
                recent version. Material changes will be highlighted through the platform or via email.
              </p>
            </Clause>

            <Clause n="12" title="Contact">
              <p>
                Questions about this Policy or our privacy practices can be sent to{" "}
                <a className="underline" href={`mailto:${SITE_CONTACT.email}`}>{SITE_CONTACT.email}</a> or by
                phone / WhatsApp at{" "}
                <a className="underline" href={`tel:${SITE_CONTACT.phoneTel}`}>{SITE_CONTACT.phone}</a>.
              </p>
            </Clause>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Clause({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-6 border-t border-rule pt-10 lg:grid-cols-12">
      <div className="lg:col-span-3">
        <p className="section-marker font-sans">{n}</p>
        <h2 className="mt-2 font-display text-xl tracking-tight md:text-2xl">{title}</h2>
      </div>
      <div className="space-y-4 lg:col-span-9">{children}</div>
    </section>
  );
}
