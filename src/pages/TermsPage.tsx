import { Layout } from '@/components/layout/Layout';

const TermsPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">Terms of Use</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: February 9, 2026</p>

        <div className="space-y-10 text-sm sm:text-base text-muted-foreground leading-relaxed">
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using TixOrbit.com (the "Site"), mobile applications, or any related services (collectively, the "Services"), you agree to be bound by these Terms of Use ("Terms"). If you do not agree to all of these Terms, do not use the Services. TixOrbit reserves the right to modify these Terms at any time. Your continued use of the Services after any changes constitutes your acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">2. About TixOrbit</h2>
            <p>
              TixOrbit is an independent online resale marketplace for live event tickets. <strong className="text-foreground">TixOrbit is not a primary ticket seller and is not affiliated with, endorsed by, or connected to any venue, box office, promoter, artist, team, or event organizer.</strong> Tickets listed on TixOrbit are sold by third-party sellers and may be priced above or below the original face value.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">3. Eligibility</h2>
            <p>
              You must be at least 18 years of age (or the age of legal majority in your jurisdiction) to use the Services. By using the Services, you represent and warrant that you meet this requirement and have the legal capacity to enter into these Terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">4. Account Registration</h2>
            <p>
              To access certain features, you may need to create an account. You agree to provide accurate and complete information, keep your login credentials confidential, and notify us immediately of any unauthorized use. You are solely responsible for all activity under your account.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">5. Ticket Purchases & Pricing</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>All ticket prices are set by individual sellers and may differ from the original face value of the ticket.</li>
              <li>Prices displayed include the ticket cost. Applicable service fees, delivery fees, and taxes will be shown before checkout.</li>
              <li>All sales are final. No refunds, exchanges, or cancellations except as stated in our Buyer Guarantee.</li>
              <li>TixOrbit does not guarantee the accuracy of event information (dates, times, lineups) and is not responsible for event changes or cancellations by organizers.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">6. Buyer Guarantee</h2>
            <p>
              TixOrbit's Buyer Guarantee ensures that tickets purchased through our platform will be valid for entry to the event. If an event is cancelled and not rescheduled, you will receive a full refund. If your tickets are not delivered before the event or are invalid at the venue, TixOrbit will work to provide comparable replacement tickets or issue a full refund at our discretion.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">7. Seller Obligations</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Sellers must ensure that all listed tickets are authentic, valid, and available for transfer.</li>
              <li>Sellers must fulfill orders within the specified delivery window.</li>
              <li>Sellers may not list tickets they do not possess or cannot guarantee delivery of.</li>
              <li>TixOrbit reserves the right to cancel listings, suspend accounts, or charge penalties for seller violations.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">8. Prohibited Conduct</h2>
            <p className="mb-2">You agree not to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Use the Services for any unlawful purpose or in violation of any applicable laws.</li>
              <li>Post fraudulent, misleading, or inaccurate listings.</li>
              <li>Interfere with, disrupt, or attempt to gain unauthorized access to the Services or related systems.</li>
              <li>Use automated tools, bots, or scrapers to access the Services without prior written consent.</li>
              <li>Circumvent fees, transfer restrictions, or security measures.</li>
              <li>Harass, threaten, or impersonate other users or TixOrbit staff.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">9. Intellectual Property</h2>
            <p>
              All content on the Services — including text, graphics, logos, icons, images, software, and trademarks — is the property of TixOrbit or its licensors and is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without prior written permission.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">10. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, TixOrbit shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Services. TixOrbit's total liability shall not exceed the amount you paid for the specific transaction giving rise to the claim. TixOrbit is not responsible for event cancellations, postponements, venue changes, or artist/team lineup changes.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">11. Disclaimers</h2>
            <p>
              The Services are provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement. TixOrbit does not warrant that the Services will be uninterrupted, error-free, or secure.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">12. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless TixOrbit, its officers, directors, employees, agents, and affiliates from and against any claims, liabilities, damages, losses, costs, or expenses (including reasonable attorneys' fees) arising from your use of the Services, violation of these Terms, or infringement of any third-party rights.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">13. Dispute Resolution & Arbitration</h2>
            <p>
              Any disputes arising from these Terms or the Services shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. You agree to waive any right to a jury trial or participation in a class action. Arbitration shall take place in New York, New York, and the arbitrator's decision shall be final and binding.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">14. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">15. Termination</h2>
            <p>
              TixOrbit may suspend or terminate your access to the Services at any time, with or without cause or notice. Upon termination, your right to use the Services immediately ceases. Provisions that by their nature should survive termination (including limitation of liability, indemnification, and dispute resolution) shall survive.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">16. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <ul className="mt-2 space-y-1">
              <li><strong className="text-foreground">Email:</strong> legal@tixorbit.com</li>
              <li><strong className="text-foreground">Phone:</strong> 1-800-TICKETS</li>
              <li><strong className="text-foreground">Address:</strong> TixOrbit Inc., New York, NY 10001</li>
            </ul>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default TermsPage;
