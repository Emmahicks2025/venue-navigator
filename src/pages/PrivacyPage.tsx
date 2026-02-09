import { Layout } from '@/components/layout/Layout';

const PrivacyPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: February 9, 2026</p>

        <div className="space-y-10 text-sm sm:text-base text-muted-foreground leading-relaxed">
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">1. Introduction</h2>
            <p>
              TixOrbit Inc. ("TixOrbit", "we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website, mobile applications, or use our services (collectively, the "Services").
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">2. Information We Collect</h2>
            <h3 className="font-semibold text-foreground mt-4 mb-2">Personal Information</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Name, email address, phone number, and billing/shipping address when you create an account or make a purchase.</li>
              <li>Payment information (credit card numbers, billing details) processed securely through our payment providers.</li>
              <li>Date of birth for age verification purposes.</li>
            </ul>
            <h3 className="font-semibold text-foreground mt-4 mb-2">Automatically Collected Information</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Device information (browser type, operating system, device identifiers).</li>
              <li>Usage data (pages visited, time spent, click patterns, search queries).</li>
              <li>IP address and approximate geolocation.</li>
              <li>Cookies and similar tracking technologies (see our Cookie Policy below).</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Process transactions, deliver tickets, and provide customer support.</li>
              <li>Personalize your experience and show relevant events and recommendations.</li>
              <li>Send transactional communications (order confirmations, delivery updates).</li>
              <li>Send marketing communications (with your consent, which you may withdraw at any time).</li>
              <li>Detect and prevent fraud, unauthorized access, and other illegal activities.</li>
              <li>Analyze usage trends to improve our Services.</li>
              <li>Comply with legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">4. Sharing Your Information</h2>
            <p className="mb-2">We may share your information with:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-foreground">Service Providers:</strong> Payment processors, delivery partners, analytics providers, and hosting services that help us operate.</li>
              <li><strong className="text-foreground">Sellers:</strong> Limited information necessary to fulfill your ticket order.</li>
              <li><strong className="text-foreground">Legal Compliance:</strong> When required by law, court order, or governmental authority.</li>
              <li><strong className="text-foreground">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets.</li>
            </ul>
            <p className="mt-3">We do not sell your personal information to third parties for their own marketing purposes.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">5. Cookies & Tracking Technologies</h2>
            <p className="mb-2">We use the following types of cookies:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-foreground">Essential Cookies:</strong> Required for core functionality (authentication, security, checkout).</li>
              <li><strong className="text-foreground">Performance Cookies:</strong> Help us understand how visitors interact with our site to improve performance.</li>
              <li><strong className="text-foreground">Functional Cookies:</strong> Remember your preferences (language, region, recently viewed events).</li>
              <li><strong className="text-foreground">Advertising Cookies:</strong> Used to deliver relevant advertisements and measure campaign effectiveness.</li>
            </ul>
            <p className="mt-3">You can manage your cookie preferences through the cookie consent banner or your browser settings.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">6. Data Security</h2>
            <p>
              We implement industry-standard security measures including encryption, secure socket layer (SSL) technology, and regular security audits to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">7. Data Retention</h2>
            <p>
              We retain your personal information for as long as your account is active or as needed to provide Services, comply with legal obligations, resolve disputes, and enforce our agreements. You may request deletion of your account and associated data at any time.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">8. Your Rights</h2>
            <p className="mb-2">Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Access the personal information we hold about you.</li>
              <li>Request correction or deletion of your personal information.</li>
              <li>Object to or restrict processing of your data.</li>
              <li>Data portability (receive your data in a structured format).</li>
              <li>Withdraw consent for marketing communications.</li>
              <li>Lodge a complaint with a supervisory authority.</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, contact us at privacy@tixorbit.com.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">9. Children's Privacy</h2>
            <p>
              Our Services are not directed to individuals under 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately and we will take steps to delete such information.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">10. International Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy and applicable data protection laws.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on our Site and updating the "Last updated" date. Your continued use of the Services after changes constitutes acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">12. Contact Us</h2>
            <p>For privacy-related inquiries, contact us at:</p>
            <ul className="mt-2 space-y-1">
              <li><strong className="text-foreground">Email:</strong> privacy@tixorbit.com</li>
              <li><strong className="text-foreground">Phone:</strong> 1-800-TICKETS</li>
              <li><strong className="text-foreground">Address:</strong> TixOrbit Inc., New York, NY 10001</li>
            </ul>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPage;
