import { useState } from "react";

export default function TermsAndConditions() {
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
      title: "Contact",
      content:
        "For questions about these Terms & Conditions or payment disputes, contact our support team at astrospace.isa@gmail.com.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-black text-white flex justify-center p-6 mt-12 pt-12">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Terms & Conditions</h1>
        <div className="space-y-3">
          {terms.map((term, index) => (
            <div
              key={index}
              className="bg-neutral-900 rounded-md overflow-hidden border border-neutral-700"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center px-5 py-4 text-left text-lg font-medium hover:bg-neutral-800 transition"
              >
                <span>{term.title}</span>
                <svg
                  className={`w-6 h-6 transform transition-transform duration-200 ${
                    openIndex === index ? "rotate-45" : "rotate-0"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>

              {openIndex === index && (
                <div className="px-5 pb-4 text-sm text-gray-300 border-t border-neutral-700">
                  {term.content}
                </div>
              )}
            </div>
          ))}
        </div>
        <footer className="mt-10 text-center text-gray-500 text-sm">
          Last updated: October 8, 2025
        </footer>
      </div>
    </div>
  );
}