import Container from "@/components/layout/Container";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | SBC Kenya",
  description:
    "Learn how SBC Kenya collects, uses, and protects your personal information.",
};

export default function PrivacyPolicy() {
  return (
    <main className="py-16">
      <Container>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">
            Privacy Policy
          </h1>
          <p className="text-gray-600 mb-8 text-center">
            Last Updated: May 21, 2025
          </p>

          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="mb-4">
                Welcome to SBC Kenya. We are committed to protecting your
                privacy and ensuring the security of your personal information.
                This Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you visit our website or use our
                services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                2. Information We Collect
              </h2>
              <p className="mb-4">
                We may collect the following types of information:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>
                  <strong>Personal Information:</strong> Name, email address,
                  phone number, and shipping address when you make a purchase or
                  create an account.
                </li>
                <li>
                  <strong>Payment Information:</strong> Credit card details or
                  other payment information, which is processed securely through
                  our payment processors.
                </li>
                <li>
                  <strong>Usage Data:</strong> Information about how you
                  interact with our website, including IP address, browser type,
                  and pages visited.
                </li>
                <li>
                  <strong>Cookies:</strong> We use cookies to enhance your
                  experience on our website.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                3. How We Use Your Information
              </h2>
              <p className="mb-4">We may use your information to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Process and fulfill your orders</li>
                <li>Communicate with you about your orders and account</li>
                <li>Improve our website and services</li>
                <li>Send you marketing communications (with your consent)</li>
                <li>Prevent fraud and enhance security</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                4. Information Sharing
              </h2>
              <p className="mb-4">We may share your information with:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>
                  Service providers who assist with our business operations
                </li>
                <li>Payment processors to complete transactions</li>
                <li>
                  Law enforcement or government agencies when required by law
                </li>
                <li>Business partners with your consent</li>
              </ul>
              <p>We do not sell your personal information to third parties.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
              <p className="mb-4">
                We implement appropriate security measures to protect your
                personal information. However, no method of transmission over
                the internet is 100% secure, and we cannot guarantee absolute
                security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Access and receive a copy of your personal data</li>
                <li>Rectify any inaccurate personal data</li>
                <li>Request deletion of your personal data</li>
                <li>Object to or restrict processing of your data</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p>
                To exercise these rights, please contact us using the
                information below.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                7. Changes to This Policy
              </h2>
              <p className="mb-4">
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last Updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about this Privacy Policy, please
                contact us at:
              </p>
              <address className="not-italic">
                SBC Kenya Limited
                <br />
                Baba Dogo, Ruaraka Nairobi
                <br />
                Kenya
                <br />
                Email: info@sbckenya.com
                <br />
                Phone: +254 722 000 000
              </address>
            </section>
          </div>
        </div>
      </Container>
    </main>
  );
}
