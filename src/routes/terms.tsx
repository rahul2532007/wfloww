import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter, PageHeader, Section } from "@/components/site/primitives";
import { SITE_CONTACT } from "@/lib/site-contact";

const CANONICAL = "https://qfloww.pridemarketing.co.in/terms";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Qfloww" },
      {
        name: "description",
        content:
          "The terms on which Pride Marketing offers Qfloww — a SaaS booking and queue management platform — to businesses in India. Governed by the laws of India.",
      },
      { property: "og:title", content: "Terms & Conditions — Qfloww" },
      {
        property: "og:description",
        content:
          "The user agreement governing your access to and use of Qfloww, drafted for compliance with Indian law.",
      },
      { property: "og:url", content: CANONICAL },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
  }),
});

function TermsPage() {
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <SiteHeader />
      <main>
        <PageHeader
          index="01"
          eyebrow="Legal"
          title={<>Terms &amp; Conditions.</>}
          lede={`These Terms form a binding electronic contract between you and ${SITE_CONTACT.legalEntity}. They are published in accordance with Rule 3(1)(a) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 and Section 10A of the Information Technology Act, 2000.`}
        />

        <Section>
          <div className="mx-auto max-w-3xl space-y-12 font-serif text-[1.0625rem] leading-relaxed text-ink">
            <p className="section-marker font-sans">Effective {SITE_CONTACT.effectiveDate}</p>

            <Clause n="01" title="Definitions">
              <p>
                "Qfloww", "we", "us", or "our" means <strong>{SITE_CONTACT.legalEntity}</strong>, a business
                operating from {SITE_CONTACT.address}. "You" or "User" means (a) a business that creates an
                account with Qfloww ("Business Customer"), (b) any staff member the Business Customer
                authorises to use the platform, or (c) an end-customer who books an appointment through a
                Business Customer's public booking page.
              </p>
              <p>
                "Service" means the Qfloww web application, its public booking pages, staff panels, admin
                surfaces, APIs, and all associated content.
              </p>
            </Clause>

            <Clause n="02" title="Acceptance and electronic contract">
              <p>
                By accessing or using the Service, you agree to be bound by these Terms and by our{" "}
                <a className="underline" href="/privacy">Privacy Policy</a>. If you do not agree, you must not
                use the Service. These Terms constitute an electronic record within the meaning of the
                Information Technology Act, 2000 and do not require a physical signature.
              </p>
            </Clause>

            <Clause n="03" title="Eligibility">
              <p>
                You represent that you are at least eighteen (18) years old and competent to contract under
                Section 11 of the Indian Contract Act, 1872. If you are using the Service on behalf of a
                business, you further represent that you are authorised to bind that business to these Terms.
              </p>
            </Clause>

            <Clause n="04" title="Accounts">
              <p>
                Business Customers create an account by providing an email address, password, business name,
                and business slug, and by confirming their email. We may verify, activate, suspend, or
                terminate any account at our sole discretion, particularly where we suspect fraud, misuse, or
                breach of these Terms. You are responsible for all activity that occurs under your account.
              </p>
            </Clause>

            <Clause n="05" title="The Service">
              <p>Qfloww provides Business Customers with:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>A branded public booking page at <code>/book/&lt;business-slug&gt;</code>.</li>
                <li>A reception panel for check-ins, walk-ins, and queue advancement.</li>
                <li>An owner (management) panel with history and billing state.</li>
                <li>Automated transactional emails for booking confirmations and authentication.</li>
              </ul>
              <p>
                The Service is offered on an "as-is" and "as-available" basis. We do not warrant uninterrupted
                or error-free operation and may perform maintenance without prior notice.
              </p>
            </Clause>

            <Clause n="06" title="Plans, fees, and taxes">
              <p>
                Qfloww is offered under a trial, monthly, or yearly plan. Applicable fees, plan expiry, and
                grace-period behaviour are communicated to you during onboarding and reflected in the owner
                panel. All fees are exclusive of GST and any other applicable Indian taxes, which will be
                charged in addition where required.
              </p>
              <p>
                Except where required under the Consumer Protection Act, 2019 or other applicable law, fees
                once paid are non-refundable. Failure to pay may result in warning, grace, or locked states
                that limit access to owner-facing surfaces.
              </p>
            </Clause>

            <Clause n="07" title="Acceptable use">
              <p>
                You agree not to use the Service in a manner that violates Rule 3(1)(b) of the Information
                Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021. In particular,
                you must not host, display, upload, modify, publish, transmit, store, or share any information
                that:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Belongs to another person and to which you do not have a right;</li>
                <li>Is defamatory, obscene, pornographic, paedophilic, invasive of privacy, insulting or harassing on the basis of gender, libellous, racially or ethnically objectionable, or otherwise unlawful;</li>
                <li>Harms minors in any way;</li>
                <li>Infringes any patent, trademark, copyright, or other proprietary rights;</li>
                <li>Violates any law for the time being in force;</li>
                <li>Deceives or misleads the addressee about the origin of a message, or knowingly communicates any information which is patently false or grossly offensive;</li>
                <li>Impersonates another person;</li>
                <li>Threatens the unity, integrity, defence, security or sovereignty of India, friendly relations with foreign states, public order, or causes incitement to commission of any cognisable offence;</li>
                <li>Contains software viruses, worms, or any other malicious code;</li>
                <li>Is patently false or untrue and is written or published in any form with the intent to mislead or harass a person for financial gain, or to cause injury to any person.</li>
              </ul>
              <p>
                You further agree not to attempt to gain unauthorised access to any part of the Service,
                probe or scan for vulnerabilities without our written consent, use the Service to send unsolicited
                communications ("spam"), or use it in a way that harms the operation of the platform.
              </p>
            </Clause>

            <Clause n="08" title="Content and data">
              <p>
                Business Customers retain ownership of the personal data of their end-customers that is
                submitted through Qfloww. By using the Service, you grant us a limited, non-exclusive licence
                to host, store, process, transmit, and display that data solely to operate the Service for you.
                Our processing of personal data is governed by our{" "}
                <a className="underline" href="/privacy">Privacy Policy</a>.
              </p>
            </Clause>

            <Clause n="09" title="Intellectual property">
              <p>
                All rights, title, and interest in and to the Service, including the Qfloww name, logo, source
                code, design, and content (other than user-generated content), are and will remain the
                exclusive property of {SITE_CONTACT.legalEntity} and its licensors. Nothing in these Terms
                grants you any right in our trademarks or other brand elements.
              </p>
            </Clause>

            <Clause n="10" title="Third-party services">
              <p>
                The Service relies on third-party infrastructure providers (including our managed database and
                email delivery providers). Their availability, terms of use, and privacy practices are outside
                our control. We are not liable for acts or omissions of any third-party provider.
              </p>
            </Clause>

            <Clause n="11" title="Disclaimer of warranties">
              <p>
                To the maximum extent permitted by law, the Service is provided without any warranties,
                whether express or implied, including any implied warranties of merchantability, fitness for a
                particular purpose, or non-infringement. We do not warrant that the Service will be
                uninterrupted, secure, or error-free, or that any defects will be corrected.
              </p>
            </Clause>

            <Clause n="12" title="Limitation of liability">
              <p>
                To the maximum extent permitted by law, {SITE_CONTACT.legalEntity} and its officers,
                employees, and agents will not be liable for any indirect, incidental, consequential, special,
                or exemplary damages arising out of or in connection with your use of the Service. Our
                aggregate liability under these Terms, howsoever arising, will not exceed the total fees paid
                by you to us in the twelve (12) months preceding the event giving rise to the claim, or Indian
                Rupees Five Thousand (INR 5,000), whichever is higher.
              </p>
            </Clause>

            <Clause n="13" title="Indemnity">
              <p>
                You agree to indemnify and hold harmless {SITE_CONTACT.legalEntity} and its officers,
                employees, and agents from and against any claim, demand, loss, or damage (including
                reasonable legal fees) arising from your breach of these Terms, your misuse of the Service, or
                your violation of any law or third-party right.
              </p>
            </Clause>

            <Clause n="14" title="Suspension and termination">
              <p>
                We may suspend or terminate your access to the Service, in whole or in part, without prior
                notice, if we reasonably believe that you have breached these Terms, that your account is
                being used unlawfully, or that continued access threatens the security of the Service. You may
                stop using the Service at any time by writing to{" "}
                <a className="underline" href={`mailto:${SITE_CONTACT.email}`}>{SITE_CONTACT.email}</a>. Clauses
                that by their nature survive termination (including 8, 9, 11, 12, 13, 15, and 16) will do so.
              </p>
            </Clause>

            <Clause n="15" title="Governing law and jurisdiction">
              <p>
                These Terms are governed by and construed in accordance with the laws of the Republic of
                India, without regard to its conflict-of-laws principles. Subject to the arbitration clause
                below, courts at {SITE_CONTACT.jurisdiction.split(",")[0].trim()}, Madhya Pradesh, India, will
                have exclusive jurisdiction over any dispute arising out of or in connection with these Terms.
              </p>
            </Clause>

            <Clause n="16" title="Dispute resolution">
              <p>
                Any dispute, controversy, or claim arising out of or relating to these Terms, or the breach,
                termination, or invalidity thereof, will first be attempted to be resolved amicably. If not
                resolved within thirty (30) days of written notice, the dispute will be referred to and
                finally resolved by arbitration under the Arbitration and Conciliation Act, 1996, by a sole
                arbitrator appointed by {SITE_CONTACT.legalEntity}. The seat of arbitration will be{" "}
                {SITE_CONTACT.jurisdiction.split(",")[0].trim()}, India, and the language will be English.
              </p>
            </Clause>

            <Clause n="17" title="Grievance officer">
              <p>
                In accordance with Rule 3(2) of the Information Technology (Intermediary Guidelines and
                Digital Media Ethics Code) Rules, 2021, the name and contact details of our Grievance Officer
                are:
              </p>
              <ul className="list-none space-y-1 pl-0">
                <li><strong>Name:</strong> Grievance Officer, {SITE_CONTACT.legalEntity}</li>
                <li><strong>Email:</strong> <a className="underline" href={`mailto:${SITE_CONTACT.email}`}>{SITE_CONTACT.email}</a></li>
                <li><strong>Phone:</strong> <a className="underline" href={`tel:${SITE_CONTACT.phoneTel}`}>{SITE_CONTACT.phone}</a></li>
                <li><strong>Address:</strong> {SITE_CONTACT.address}</li>
              </ul>
            </Clause>

            <Clause n="18" title="Changes">
              <p>
                We may amend these Terms from time to time. The "Effective" date at the top of this page
                reflects the current version. Continued use of the Service after any change constitutes
                acceptance of the revised Terms.
              </p>
            </Clause>

            <Clause n="19" title="Miscellaneous">
              <p>
                These Terms, together with our Privacy Policy, form the entire agreement between you and us
                with respect to the Service. If any provision is held to be invalid or unenforceable, the
                remaining provisions will continue in full force and effect. Our failure to enforce any right
                or provision will not be considered a waiver of that right or provision.
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
