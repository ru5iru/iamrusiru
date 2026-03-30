import Header from "@/components/blog/Header";
import Footer from "@/components/blog/Footer";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-display text-4xl font-bold text-display mb-8">Cookie Policy</h1>
        <p className="text-caption text-sm mb-10">Last updated: March 30, 2026</p>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8 text-body">
          <section>
            <h2 className="font-display text-2xl font-semibold text-display mb-3">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files placed on your device when you visit a website. They help the site remember your preferences and understand how you interact with it. Cookies are widely used to make websites work more efficiently and provide useful information to site owners.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-display mb-3">2. How I Use Cookies</h2>
            <p>This website uses cookies for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for basic site functionality such as remembering your theme preference (light/dark mode).</li>
              <li><strong>Analytics Cookies:</strong> Used to understand how visitors interact with the site, which pages are most popular, and how users navigate. This helps me improve the content and user experience.</li>
              <li><strong>Preference Cookies:</strong> Store your settings and choices to provide a more personalized experience on return visits.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-display mb-3">3. Cookies Used on This Site</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-divider rounded-lg">
                <thead>
                  <tr className="bg-muted">
                    <th className="text-left p-3 font-medium text-display">Cookie</th>
                    <th className="text-left p-3 font-medium text-display">Purpose</th>
                    <th className="text-left p-3 font-medium text-display">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-divider">
                    <td className="p-3 font-mono text-xs">theme</td>
                    <td className="p-3">Stores your light/dark mode preference</td>
                    <td className="p-3">Persistent</td>
                  </tr>
                  <tr className="border-t border-divider">
                    <td className="p-3 font-mono text-xs">_ga / _gid</td>
                    <td className="p-3">Google Analytics tracking</td>
                    <td className="p-3">Up to 2 years</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-display mb-3">4. Third-Party Cookies</h2>
            <p>
              Some cookies may be set by third-party services used on this site, such as analytics providers. These cookies are governed by the respective third party's privacy and cookie policies. I do not have direct control over these cookies.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-display mb-3">5. Managing Cookies</h2>
            <p>
              You can control and manage cookies through your browser settings. Most browsers allow you to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>View and delete existing cookies</li>
              <li>Block all or specific cookies</li>
              <li>Set preferences for certain websites</li>
              <li>Receive notifications when a cookie is set</li>
            </ul>
            <p className="mt-3">
              Please note that disabling certain cookies may affect the functionality of this website.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-display mb-3">6. Changes to This Policy</h2>
            <p>
              I may update this Cookie Policy from time to time to reflect changes in technology or legal requirements. Any updates will be posted on this page with a revised "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-display mb-3">7. Contact</h2>
            <p>
              If you have questions about this Cookie Policy, please reach out via the <a href="/contact" className="text-primary hover:underline">Contact page</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CookiePolicy;
