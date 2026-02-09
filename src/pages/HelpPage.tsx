import { Layout } from '@/components/layout/Layout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Mail, Phone, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    q: 'What is TixOrbit?',
    a: 'TixOrbit is an independent online resale marketplace where fans can buy and sell tickets to live events. We are not affiliated with any venue, box office, or primary ticket seller. Prices may be above or below face value.',
  },
  {
    q: 'Are the tickets on TixOrbit authentic?',
    a: 'Yes. Every order is backed by our Buyer Guarantee, which ensures valid tickets for entry. If tickets are invalid or not delivered, we will provide comparable replacements or a full refund.',
  },
  {
    q: 'Why are prices different from the original face value?',
    a: 'TixOrbit is a resale marketplace. Ticket prices are set by individual sellers based on supply, demand, and market conditions — similar to how stock prices fluctuate. Prices may be higher or lower than the original face value.',
  },
  {
    q: 'How do I receive my tickets?',
    a: 'Tickets are delivered electronically to your account. You can access them from your Dashboard under "My Tickets." Most tickets are delivered within minutes of purchase, though some may take up to 24 hours.',
  },
  {
    q: 'Can I get a refund?',
    a: 'All sales are final. However, if an event is cancelled and not rescheduled, you will receive a full refund. If an event is postponed, your tickets remain valid for the new date.',
  },
  {
    q: 'How do I track my order?',
    a: 'Log in to your account and visit your Dashboard. You can view all your orders, ticket details, and delivery status there. You can also contact our support team with your order number.',
  },
  {
    q: 'What if the event is cancelled or postponed?',
    a: 'If an event is cancelled and not rescheduled, you will receive a full refund. If the event is rescheduled or postponed, your tickets will be valid for the new date. We will notify you of any changes via email.',
  },
  {
    q: 'How do I sell tickets on TixOrbit?',
    a: 'Currently, TixOrbit operates as a buyer-facing marketplace. If you are interested in selling tickets, please contact our support team for more information.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover) and other secure payment methods. All transactions are processed with industry-standard encryption.',
  },
  {
    q: 'How do I contact customer support?',
    a: 'You can reach us via live chat (click the chat icon), email at support@tixorbit.com, or call 1-800-TICKETS. Our support team is available 24/7.',
  },
];

const HelpPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">Help Center</h1>
        <p className="text-muted-foreground mb-10">Find answers to common questions about TixOrbit.</p>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="font-display text-xl font-semibold text-foreground mb-6">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-xl px-4">
                <AccordionTrigger className="text-sm sm:text-base font-medium text-foreground hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Contact Section */}
        <section>
          <h2 className="font-display text-xl font-semibold text-foreground mb-6">Still Need Help?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border border-border rounded-xl p-5 text-center space-y-2">
              <MessageCircle className="w-6 h-6 text-primary mx-auto" />
              <h3 className="font-semibold text-foreground text-sm">Live Chat</h3>
              <p className="text-xs text-muted-foreground">Click the chat icon in the bottom-right corner for instant support.</p>
            </div>
            <div className="border border-border rounded-xl p-5 text-center space-y-2">
              <Mail className="w-6 h-6 text-primary mx-auto" />
              <h3 className="font-semibold text-foreground text-sm">Email</h3>
              <p className="text-xs text-muted-foreground">support@tixorbit.com<br />We respond within 24 hours.</p>
            </div>
            <div className="border border-border rounded-xl p-5 text-center space-y-2">
              <Phone className="w-6 h-6 text-primary mx-auto" />
              <h3 className="font-semibold text-foreground text-sm">Phone</h3>
              <p className="text-xs text-muted-foreground">1-800-TICKETS<br />Available 24/7.</p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HelpPage;
