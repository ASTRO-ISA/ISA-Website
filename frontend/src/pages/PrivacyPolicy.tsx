import React from "react";
import { Helmet } from "react-helmet-async";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black via-[#0b0f2f] to-black text-gray-300 overflow-hidden">
      <Helmet>
        <title>Privacy Policy | ISA-India</title>
        <meta name="description" content="Privacy Policy for ISA-India." />
      </Helmet>
      {/* Stars Background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>

      {/* Floating Glow Effect */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500 rounded-full filter blur-[160px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-[160px] opacity-20 animate-pulse"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4 mt-10">
          Privacy Policy
        </h1>
        <p className="text-center text-sm text-gray-400 mb-12">
          Effective Date: 01st Nov 2025 • Last Updated: 01st Nov 2025
        </p>

        <div className="space-y-10 text-justify leading-relaxed">
          <section>
            <p>
              Welcome to <span className="text-indigo-400 font-semibold">ISA-India</span> (“we,” “our,” “us”). Your privacy is important to us. This
              Privacy Policy explains how we collect, use, disclose, and protect your personal information when you access or use our website{" "}
              <a href="https://isa-india.in" className="text-indigo-400 hover:underline">
                isa.org.in
              </a>{" "}
              (“Platform”) and related services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-indigo-400 font-semibold mb-2">1. Information We Collect</h2>
            <h3 className="font-semibold">a. Information You Provide:</h3>
            <ul className="list-disc ml-6 mb-3">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Payment information (processed via our payment gateway)</li>
              <li>Any additional details you submit when registering, enrolling in courses, applying for internships, or contacting us.</li>
            </ul>

            <h3 className="font-semibold">b. Automatically Collected Data:</h3>
            <ul className="list-disc ml-6 mb-3">
              <li>Cookies and similar technologies (used to store session tokens and improve user experience)</li>
              <li>Device information, browser type, IP address, and usage statistics</li>
            </ul>

            <h3 className="font-semibold">c. Third-Party Content and APIs:</h3>
            <p>
              Our platform integrates content such as space-related blogs, news, and pictures from trusted third-party APIs. These sources may have
              their own privacy policies, which we encourage you to review.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-indigo-400 font-semibold mb-2">2. How We Use Your Information</h2>
            <ul className="list-disc ml-6">
              <li>Create and manage your account</li>
              <li>Provide access to courses, webinars, and hosted events</li>
              <li>Process payments securely via PhonePe Payment Gateway</li>
              <li>Send updates, newsletters, and promotional communications (only with your consent)</li>
              <li>Improve platform performance, functionality, and security</li>
              <li>Comply with legal and regulatory requirements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-indigo-400 font-semibold mb-2">3. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies to maintain your login session, enhance personalization, and collect analytical data. You can modify your browser settings to
              control or delete cookies, but some features may not function properly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-indigo-400 font-semibold mb-2">4. Data Sharing and Disclosure</h2>
            <p>
              We do not sell or rent your personal information. However, we may share it with:
            </p>
            <ul className="list-disc ml-6">
              <li>Payment processors (PhonePe)</li>
              <li>Service providers (hosting, analytics, communication tools)</li>
              <li>Government authorities if required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-indigo-400 font-semibold mb-2">5. Data Security</h2>
            <p>
              We implement reasonable technical and organizational measures to protect your information, but no method is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-indigo-400 font-semibold mb-2">6. Data Retention</h2>
            <p>
              Your personal data is retained only for as long as necessary to fulfill the purposes outlined in this policy or as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-indigo-400 font-semibold mb-2">7. Your Rights</h2>
            <p>
              Under the Digital Personal Data Protection Act, 2023, you have the right to access or correct your data; withdraw consent; and file
              complaints with the Data Protection Board of India.
            </p>
          </section>

          {/* <section>
            <h2 className="text-2xl text-indigo-400 font-semibold mb-2">8. Children’s Privacy</h2>
            <p>
              Our services are for users aged 13 and above. We do not knowingly collect data from children without parental consent.
            </p>
          </section> */}

          <section>
            <h2 className="text-2xl text-indigo-400 font-semibold mb-2">8. Third-Party Links</h2>
            <p>
              Our website may contain external links or APIs (for news, blogs, research, etc.). We are not responsible for their privacy practices or
              content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-indigo-400 font-semibold mb-2">9. Updates to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically to reflect changes in our practices or legal obligations. Updates will be posted on this
              page with a revised effective date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-indigo-400 font-semibold mb-2">10. Contact Us</h2>
            <p>
              If you have questions, concerns, or requests regarding this Privacy Policy, please contact:
            </p>
            <div className="mt-3">
              <p className="text-gray-200 font-semibold">ISA-India</p>
              <p>Email: astrospace.isa@gmail.com</p>
              {/* <p>Phone: [Insert contact number]</p>
              <p>Address: [Insert physical address]</p> */}
            </div>
          </section>
        </div>

        <footer className="mt-16 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} ISA-India. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default PrivacyPolicy;