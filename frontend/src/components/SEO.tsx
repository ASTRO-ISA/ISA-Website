import { Helmet } from "react-helmet";

const SEO = ({
  title,
  description,
  keywords = [],
  image = "/images/isa-logo.jpeg",
  url = import.meta.env.WEB_URL
}) => {
  const combinedKeywords = [
    "ISA India",
    "ISA-India",
    "ISA",
    "ISA LNCT",
    "Interstellar Spacetech Astronomy",
    "Interstellar Spacetech Astronomy Club",
    "Interstellar Spacetech Astronomy Club LNCT",
    "Interstellar Spacetech Astronomy Club LNCT Bhopal",
    "Indian Space Academy",
    "Space Education India",
    "Astronomy Courses India",
    "Aerospace Students India",
    "ISRO Workshops",
    "Space Events India",
    "Future Space Explorers",
    "Satellite Training India",
    "Drone Education India",
    "Space Blogs",
    
    // Hindi discoverability
    "अंतरिक्ष शिक्षा",
    "भारत में अंतरिक्ष प्रशिक्षण",
    "इसरो इवेंट्स",
    "स्पेस साइंस",
    ...keywords
  ];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={combinedKeywords.join(", ")} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />

      {/* Instagram / FB */}
      <meta property="og:site_name" content="ISA-India" />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "ISA-India",
          url: "https://isa-india.org.in/",
          logo: "https://isa-india.org.in/logo.png",
          description: description,
          keywords: combinedKeywords,
          sameAs: [
            "https://abc.com" // Update when real Insta comes
          ],
        })}
      </script>
    </Helmet>
  );
};

export default SEO;