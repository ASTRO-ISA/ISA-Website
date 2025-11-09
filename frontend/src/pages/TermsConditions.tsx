import React from "react";
import { Helmet } from "react-helmet-async";

const TermsAndConditions: React.FC = () => {
  const terms = [
    {
      title: "Acceptance of Terms",
      content:
        "By accessing or using this website (the 'Site'), you agree to be bound by these Terms & Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing the Site.",
    },
    {
      title: "User Conduct & Content",
      content:
        "You may submit content to the Site (including images for features such as 'Featured Image of the Day'). You represent and warrant that you own or have the necessary rights to submit such content and that your content does not violate any third-party rights, laws, or regulations.",
    },
    {
      title: "Featured Images & Licensing",
      content:
        "By submitting an image for consideration as a featured image, you grant the Site a perpetual, worldwide, non-exclusive, royalty-free license to use, reproduce, publish, and display the image on the Site and in promotional materials related to it.",
    },
    {
      title: "Payments & Fees",
      content:
        "All payments made on the Site are final and non-refundable, except where required by applicable law. By completing a purchase or payment, you acknowledge that you understand and accept our non-refundable payment policy.",
    },
    {
      title: "Privacy",
      content:
        "Use of the Site is also governed by our Privacy Policy, which explains how we collect, store, and use your personal information. By using the Site, you consent to those practices.",
    },
    {
      title: "Intellectual Property",
      content:
        "All content on the Site (text, graphics, logos, and software) is the property of the Site or its suppliers and is protected by intellectual property laws.",
    },
    {
      title: "Limitation of Liability",
      content:
        "In no event will the Site or its affiliates be liable for any indirect, incidental, or consequential damages arising from your use of the Site.",
    },
    {
      title: "Modifications to Terms",
      content:
        "We reserve the right to revise these Terms & Conditions at any time without prior notice. By continuing to use the Site, you agree to be bound by the latest version of these Terms.",
    },
    {
      title: "Governing Law",
      content:
        "These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.",
    },
    {
      title: "Contact",
      content:
        "For questions about these Terms & Conditions or payment disputes, contact our support team at astrospace.isa@gmail.com.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black via-[#0b0f2f] to-black text-gray-300 overflow-hidden">
      <Helmet>
        <title>Terms & Conditions | ISA-India</title>
        <meta name="description" content="Terms & Conditions for ISA-India." />
      </Helmet>
      {/* Stars Background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>

      {/* Floating Glow Effects */}
      <div className="absolute -top-20 left-0 w-96 h-96 bg-indigo-600 rounded-full filter blur-[160px] opacity-25 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600 rounded-full filter blur-[160px] opacity-25 animate-pulse"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4 mt-10">
          Terms & Conditions
        </h1>
        <p className="text-center text-sm text-gray-400 mb-12">
          Effective Date: 01st Nov 2025 • Last Updated: 01st Nov 2025
        </p>

        <div className="space-y-10 text-justify leading-relaxed">
          {terms.map((term, index) => (
            <section key={index}>
              <h2 className="text-2xl text-indigo-400 font-semibold mb-2">
                {index + 1}. {term.title}
              </h2>
              <p>{term.content}</p>
            </section>
          ))}
        </div>

        <footer className="mt-16 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} ISA-India. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default TermsAndConditions;