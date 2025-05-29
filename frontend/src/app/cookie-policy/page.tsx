import Container from "@/components/layout/Container";

export const metadata = {
  title: "Cookie Policy | SBC Kenya",
  description:
    "Learn how SBC Kenya uses cookies and similar technologies on our website.",
};

export default function CookiePolicy() {
  return (
    <main className="py-16">
      <Container>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Cookie Policy</h1>
          <p className="text-gray-600 mb-8 text-center">
            Last Updated: May 21, 2025
          </p>

          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                1. What Are Cookies?
              </h2>
              <p className="mb-4">
                Cookies are small text files that are placed on your device when
                you visit our website. They help us understand how you interact
                with our site and improve your experience.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                2. How We Use Cookies
              </h2>
              <p className="mb-4">
                We use cookies for various purposes, including:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>
                  <strong>Essential Cookies:</strong> Necessary for the website
                  to function properly
                </li>
                <li>
                  <strong>Performance Cookies:</strong> Help us understand how
                  visitors use our site
                </li>
                <li>
                  <strong>Functionality Cookies:</strong> Remember your
                  preferences and settings
                </li>
                <li>
                  <strong>Targeting/Advertising Cookies:</strong> Used to
                  deliver relevant ads
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                3. Types of Cookies We Use
              </h2>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">
                  a. Session Cookies
                </h3>
                <p>
                  Temporary cookies that are deleted when you close your
                  browser.
                </p>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">
                  b. Persistent Cookies
                </h3>
                <p>
                  Remain on your device for a set period or until you delete
                  them.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  c. Third-Party Cookies
                </h3>
                <p>
                  Placed by third-party services we use, such as analytics
                  providers.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                4. Managing Cookies
              </h2>
              <p className="mb-4">
                You can control and/or delete cookies as you wish. Most web
                browsers allow you to:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>
                  See what cookies you've got and delete them on an individual
                  basis
                </li>
                <li>Block third-party cookies</li>
                <li>Block cookies from specific sites</li>
                <li>Block all cookies</li>
                <li>Delete all cookies when you close your browser</li>
              </ul>
              <p>
                Please note that if you disable cookies, some features of our
                website may not function properly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                5. Your Cookie Choices
              </h2>
              <p className="mb-4">
                When you first visit our website, you'll see a cookie consent
                banner where you can manage your cookie preferences. You can
                also adjust these settings at any time by clicking the "Cookie
                Settings" link in the website footer.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                6. Changes to This Policy
              </h2>
              <p className="mb-4">
                We may update this Cookie Policy from time to time. We will
                notify you of any changes by updating the "Last Updated" date at
                the top of this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about our use of cookies, please
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
