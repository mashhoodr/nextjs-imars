import Layout from "../components/layout";
import Seo, { breadcrumb } from "../components/seo";
import utilStyles from "../styles/utils.module.css";

export default function Privacy() {
  return (
    <Layout>
      <Seo
        title="Privacy policy"
        description="How karachiwala.dev handles the small amount of data it collects."
        path="/privacy"
        jsonLd={[breadcrumb([{ name: "Privacy policy", path: "/privacy" }])]}
      />
      {/* A trust signal worth keeping indexable, so no noindex here. */}
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h1 className={utilStyles.headingXl}>Privacy Policy</h1>
        <p><strong>Last updated:</strong> February 7, 2026</p>

        <h2 className={utilStyles.headingLg}>Introduction</h2>
        <p>
          Welcome to karachiwala.dev ("we," "our," or "us"). We are committed to protecting your privacy
          and ensuring you have a positive experience on our website. This Privacy Policy explains how we
          collect, use, disclose, and safeguard your information when you visit our website.
        </p>

        <h2 className={utilStyles.headingLg}>Information We Collect</h2>

        <h3><strong>Information Automatically Collected</strong></h3>
        <p>When you visit our website, we may automatically collect certain information, including:</p>
        <ul className={utilStyles.list}>
          <li className={utilStyles.listItem}>Device information (browser type, operating system)</li>
          <li className={utilStyles.listItem}>IP address and approximate location</li>
          <li className={utilStyles.listItem}>Pages visited and time spent on pages</li>
          <li className={utilStyles.listItem}>Referring website or source</li>
          <li className={utilStyles.listItem}>Date and time of your visit</li>
        </ul>

        <h3><strong>Information You Provide</strong></h3>
        <p>We may collect information you voluntarily provide, such as:</p>
        <ul className={utilStyles.list}>
          <li className={utilStyles.listItem}>Email address (if you contact us or subscribe to updates)</li>
          <li className={utilStyles.listItem}>Name and contact information (if you request mentoring sessions)</li>
          <li className={utilStyles.listItem}>Any other information you choose to share with us</li>
        </ul>

        <h2 className={utilStyles.headingLg}>How We Use Your Information</h2>
        <p>We use the collected information for various purposes:</p>
        <ul className={utilStyles.list}>
          <li className={utilStyles.listItem}>To provide and maintain our website</li>
          <li className={utilStyles.listItem}>To analyze website usage and improve user experience</li>
          <li className={utilStyles.listItem}>To respond to your inquiries and requests</li>
          <li className={utilStyles.listItem}>To send periodic communications (with your consent)</li>
          <li className={utilStyles.listItem}>To detect, prevent, and address technical issues</li>
        </ul>

        <h2 className={utilStyles.headingLg}>Cookies and Tracking Technologies</h2>
        <p>
          Our website may use cookies and similar tracking technologies to enhance your browsing experience.
          Cookies are small data files stored on your device. We may use:
        </p>
        <ul className={utilStyles.list}>
          <li className={utilStyles.listItem}><strong>Essential cookies:</strong> Required for the website to function properly</li>
          <li className={utilStyles.listItem}><strong>Analytics cookies:</strong> Help us understand how visitors interact with our website</li>
          <li className={utilStyles.listItem}><strong>Third-party cookies:</strong> Set by external services like social media platforms</li>
        </ul>
        <p>
          You can control cookie preferences through your browser settings. Note that disabling certain
          cookies may affect website functionality.
        </p>

        <h2 className={utilStyles.headingLg}>Third-Party Services</h2>
        <p>Our website may contain links to or integrate with third-party services, including:</p>
        <ul className={utilStyles.list}>
          <li className={utilStyles.listItem}><strong>Social Media Platforms:</strong> Twitter, Facebook, LinkedIn, Instagram, GitHub</li>
          <li className={utilStyles.listItem}><strong>Analytics Services:</strong> Google Analytics or similar services</li>
          <li className={utilStyles.listItem}><strong>Content Platforms:</strong> Substack, Anchor.fm (Spotify), Goodreads, YouTube</li>
          <li className={utilStyles.listItem}><strong>Mentoring Platforms:</strong> ADPList</li>
        </ul>
        <p>
          These third parties have their own privacy policies governing their use of your information.
          We encourage you to review their privacy policies before interacting with these services.
        </p>

        <h2 className={utilStyles.headingLg}>Data Sharing and Disclosure</h2>
        <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
        <ul className={utilStyles.list}>
          <li className={utilStyles.listItem}>With service providers who assist in operating our website</li>
          <li className={utilStyles.listItem}>To comply with legal obligations or respond to lawful requests</li>
          <li className={utilStyles.listItem}>To protect our rights, privacy, safety, or property</li>
          <li className={utilStyles.listItem}>With your explicit consent</li>
        </ul>

        <h2 className={utilStyles.headingLg}>Data Retention</h2>
        <p>
          We retain your information only for as long as necessary to fulfill the purposes outlined in this
          Privacy Policy, unless a longer retention period is required by law.
        </p>

        <h2 className={utilStyles.headingLg}>Your Rights</h2>
        <p>Depending on your location, you may have certain rights regarding your personal information:</p>
        <ul className={utilStyles.list}>
          <li className={utilStyles.listItem}><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
          <li className={utilStyles.listItem}><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
          <li className={utilStyles.listItem}><strong>Deletion:</strong> Request deletion of your personal information</li>
          <li className={utilStyles.listItem}><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
          <li className={utilStyles.listItem}><strong>Data Portability:</strong> Request transfer of your data to another service</li>
        </ul>
        <p>To exercise these rights, please contact us using the information provided below.</p>

        <h2 className={utilStyles.headingLg}>Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your personal information
          against unauthorized access, alteration, disclosure, or destruction. However, no method of
          transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
        </p>

        <h2 className={utilStyles.headingLg}>International Data Transfers</h2>
        <p>
          Your information may be transferred to and processed in countries other than your country of
          residence. These countries may have different data protection laws. By using our website, you
          consent to the transfer of your information to these countries.
        </p>

        <h2 className={utilStyles.headingLg}>Children's Privacy</h2>
        <p>
          Our website is not intended for children under 13 years of age. We do not knowingly collect
          personal information from children under 13. If you believe we have collected information from
          a child under 13, please contact us immediately.
        </p>

        <h2 className={utilStyles.headingLg}>Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes by
          posting the new Privacy Policy on this page and updating the "Last updated" date. You are
          advised to review this Privacy Policy periodically for any changes.
        </p>

        <h2 className={utilStyles.headingLg}>Contact Us</h2>
        <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
        <ul className={utilStyles.list}>
          <li className={utilStyles.listItem}><strong>Email:</strong> Contact via social media links on the homepage</li>
          <li className={utilStyles.listItem}><strong>Twitter:</strong> <a href="https://twitter.com/mashhoodr" target="_blank" rel="noopener noreferrer">@mashhoodr</a></li>
          <li className={utilStyles.listItem}><strong>LinkedIn:</strong> <a href="https://linkedin.com/in/mashhoodr" target="_blank" rel="noopener noreferrer">linkedin.com/in/mashhoodr</a></li>
        </ul>

        <h2 className={utilStyles.headingLg}>Consent</h2>
        <p>
          By using our website, you consent to this Privacy Policy and agree to its terms.
        </p>
      </section>
    </Layout>
  );
}
