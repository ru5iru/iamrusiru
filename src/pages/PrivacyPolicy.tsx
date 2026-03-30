import Header from "@/components/blog/Header";
import Footer from "@/components/blog/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-display text-4xl font-bold text-display mb-8">Privacy Policy</h1>
        <p className="text-caption text-sm mb-10">Last updated: March 30, 2026</p>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8 text-body">
          <section>
            <h2 className="font-display text-2xl font-semibold text-display mb-3">1. Introduction</h2>
            <p>
              Welcome to iamrusiru.com ("the Site"), operated by Rusiru Rathmina. Your privacy is important to me. This Privacy Policy explains how I collect, use, and protect your personal information when you visit and interact with this website.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-display mb-3">2. Information I Collect</h2>
            <p>I may collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Personal Information:</strong> Name and email address when you subscribe to the newsletter or use the contact form.</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent on the site, referral sources, browser type, device information, and IP address collected automatically through analytics tools.</li>
              <li><strong>Cookies:</strong> Small files stored on your device to improve your browsing experience. See the <a href="/cookie-policy" className="text-primary hover:underline">Cookie Policy</a> for more details.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-display mb-3">3. How I Use Your Information</h2>
            <p>Your information is used to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Send newsletter updates if you have subscribed</li>
              <li>Respond to your messages via the contact form</li>
              <li>Analyze site traffic and improve content</li>
              <li>Maintain the security and performance of the site</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-display mb-3">4. Data Sharing</h2>
            <p>
              I do not sell, trade, or rent your personal information to third parties. I may share data with trusted third-party services (such as analytics providers and email services) solely to operate and improve the Site. These services are bound by their own privacy policies.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-display mb-3">5. Data Retention</h2>
            <p>
              I retain your personal information only for as long as necessary to fulfill the purposes described in this policy, or as required by law. You can request deletion of your data at any time by contacting me.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-display mb-3">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access the personal data I hold about you</li>
              <li>Request correction or deletion of your data</li>
              <li>Withdraw consent for data processing at any time</li>
              <li>Opt out of newsletter communications</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-display mb-3">7. Third-Party Links</h2>
            <p>
              The Site may contain links to external websites. I am not responsible for the privacy practices or content of those sites. I encourage you to review their privacy policies before providing any personal information.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-display mb-3">8. Security</h2>
            <p>
              I take reasonable measures to protect your personal information from unauthorized access, alteration, or destruction. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-display mb-3">9. Changes to This Policy</h2>
            <p>
              I may update this Privacy Policy from time to time. Any changes will be posted on this page with a revised "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-display mb-3">10. Contact</h2>
            <p>
              If you have any questions about this Privacy Policy, please reach out via the <a href="/contact" className="text-primary hover:underline">Contact page</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
