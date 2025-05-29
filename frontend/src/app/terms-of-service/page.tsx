import Container from "@/components/layout/Container";

export const metadata = {
  title: 'Terms of Service | SBC Kenya',
  description: 'Terms and conditions governing the use of SBC Kenya\'s website and services.',
};

export default function TermsOfService() {
  return (
    <main className="py-16">
      <Container>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Terms of Service</h1>
          <p className="text-gray-600 mb-8 text-center">
            Last Updated: May 21, 2025
          </p>

          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing and using the SBC Kenya website ("Service"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Use of Service</h2>
              <p className="mb-4">You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Use the Service in any way that violates any applicable laws or regulations</li>
                <li>Engage in any conduct that restricts or inhibits anyone's use of the Service</li>
                <li>Attempt to gain unauthorized access to any part of the Service</li>
                <li>Use the Service to transmit any viruses or malicious code</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Product Information</h2>
              <p className="mb-4">
                We make every effort to display our products as accurately as possible. However, we cannot guarantee that your device's display of colors or product details will be completely accurate.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Pricing and Payment</h2>
              <p className="mb-4">All prices are in Kenyan Shillings (KES) and are subject to change without notice. We reserve the right to modify or discontinue any product at any time.</p>
              <p>We accept various payment methods including credit/debit cards and mobile money. All payments are processed securely through our payment processors.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Shipping and Delivery</h2>
              <p className="mb-4">We aim to process and ship orders within 2-3 business days. Delivery times may vary depending on your location and other factors beyond our control.</p>
              <p>Risk of loss and title for items purchased pass to you upon delivery to the carrier.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Returns and Refunds</h2>
              <p className="mb-4">Please review our Return Policy for detailed information about returning products and requesting refunds.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
              <p className="mb-4">
                SBC Kenya shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
              <p className="mb-4">
                We reserve the right to modify these Terms of Service at any time. We will notify you of any changes by updating the "Last Updated" date. Your continued use of the Service constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <address className="not-italic">
                SBC Kenya Limited<br />
                Baba Dogo, Ruaraka Nairobi<br />
                Kenya<br />
                Email: info@sbckenya.com<br />
                Phone: +254 722 000 000
              </address>
            </section>
          </div>
        </div>
      </Container>
    </main>
  );
}
