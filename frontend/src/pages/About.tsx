import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Star,
  Users,
  Award,
  Instagram,
  MessageCircle,
  Github,
  Linkedin,
} from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const teamMembers = [
    {
      name: "Vinod Mali",
      role: "Full Stack Developer",
      image: "/images/vinod.png",
      github: "https://github.com/vinodM09",
      linkedin: "https://www.linkedin.com/in/vinodm09",
    },
    {
      name: "Suyash Nagar",
      role: "Full Stack Developer",
      image: "/images/suyash.png",
      github: "https://github.com/suysah",
      linkedin: "https://www.linkedin.com/in/suyash-nagar-867027256/",
    },
    {
      name: "Naman Meravi",
      role: "Full Stack Developer",
      image: "/images/naman.png",
      github: "https://github.com/NamanMeravi",
      linkedin: "https://www.linkedin.com/in/naman-meravi-660a1b257/",
    },
    {
      name: "Sunaina Chaurasiya",
      role: "Frontend Developer",
      image: "/images/sunaina.png",
      github: "https://github.com/Sunaina-Chaurasiya",
      linkedin: "https://www.linkedin.com/in/sunaina-chaurasiya-252a06285/",
    },
    {
      name: "Anadi Gupta",
      role: "Frontend Developer",
      image: "/images/anadi.png",
      github: "https://github.com/Anadi-Gupta1",
      linkedin: "https://www.linkedin.com/in/anadigupta/",
    },
  ];

  const clubDepartments = [
    {
      name: "Jyotsana",
      role: "Core Team Member",
      image: "/images/Jyotsana.png",
      github: "https://github.com/jyotsana20",
      linkedin: "https://www.linkedin.com/in/jyotsana-rani-3a7a18298",
    },
    {
      name: "Chanchal Bairagi",
      role: "Core Team Member",
      image: "/images/Chanchal.png",
      github: "https://github.com/lisawang",
      linkedin: "https://www.linkedin.com/in/chanchal-bairagi-1502b8293",
    },
    {
      name: "Akshay Jain",
      role: "Core Team Member",
      image: "/images/Akshay.png",
      github: "https://github.com/Akshay-Jain08",
      linkedin: "https://www.linkedin.com/in/akshay-jain-88776b20b",
    },
    {
      name: "Amit Kumar",
      role: "Core Team Member",
      image: "/images/Amit.png",
      github: "https://github.com/amitakr0027",
      linkedin: "http://www.linkedin.com/in/amitkumar0027",
    },
    {
      name: "Mayank Manan",
      role: "Core Team Member",
      image: "/images/Mayank.png",
      github: "https://github.com/MayankManan",
      linkedin: "https://in.linkedin.com/in/manan-mayank",
    },
    {
      name: "Niyati Richhariya",
      role: "Core Team Member",
      image: "/images/Niyati.png",
      linkedin: "https://www.linkedin.com/in/niyati-richhariya-83a019334",
    },
    {
      name: "Akshat Shevalkar",
      role: "Core Team Member",
      image: "/images/Akshat.png",
      linkedin: "https://www.linkedin.com/in/akshat-shevalkar-380711329",
    },
    {
      name: "Srijan Mishra",
      role: "Technical",
      image: "/images/Srijan.png",
      linkedin: "https://www.linkedin.com/in/srijan-mishra-7b95692b5",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-purple/20 via-space-dark to-space-accent/20 text-white pt-20">
      <section className="py-10">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-space-light to-space-accent bg-clip-text text-transparent"
          >
            About ISA
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-space-light max-w-3xl mx-auto leading-relaxed"
          >
            Empowering the next generation of space explorers through innovative
            education and hands-on experience
          </motion.p>
        </div>
      </section>

      {/* ISA Overview*/}
      <section className="py-20 text-white">
        <div className="container mx-auto px-4">
          {/* Rocketry & Astronomy Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {/* Rocketry */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="cosmic-card bg-gradient-to-br from-space-purple/20 to-space-dark p-6 h-full hover:scale-105 transition-transform duration-300">
                <CardContent>
                  <h3 className="text-2xl font-bold mb-2">
                    Rocketry Division (Technical)
                  </h3>
                  <p className="text-space-light mb-4">
                    The Rocketry Division of ISA focuses on the technical and
                    engineering aspects of space exploration. This section is
                    ideal for students who are interested in hands-on experience
                    with:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-space-light">
                    <li>Designing and building model rockets</li>
                    <li>
                      Understanding propulsion systems, aerodynamics, and
                      payload integration
                    </li>
                    <li>Conducting static and dynamic rocket launches</li>
                    <li>
                      Participating in national and international rocketry
                      competitions
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Astronomy */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="cosmic-card bg-gradient-to-br from-space-purple/20 to-space-dark p-6 h-full hover:scale-105 transition-transform duration-300">
                <CardContent>
                  <h3 className="text-2xl font-bold mb-2">
                    Astronomy Division (Space Knowledge & Exploration)
                  </h3>
                  <p className="text-space-light mb-4">
                    The Astronomy Division of ISA is designed for those who are
                    curious about the universe and want to dive deep into:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-space-light">
                    <li>Observation-based astronomy</li>
                    <li>
                      Learning about celestial objects, constellations, and
                      planetary science
                    </li>
                    <li>
                      Space research projects and data analysis (e.g., moon
                      mapping, black holes, galaxies)
                    </li>
                    <li>
                      Organizing and attending stargazing events and space talks
                    </li>
                    <li>Conducting awareness programs and public lectures</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* What ISA Offers */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-center mb-10">
              What ISA Offers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                "Workshops & webinars with scientists and engineers",
                "Certified space education programs",
                "Internship & research opportunities",
                "Hackathons, Rocket Launches and Astronomy nights",
                "Career roadmap guidance for space aspirants",
                "Community platform for space discussion and collaboration",
              ].map((item, idx) => (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  key={idx}
                  className="bg-space-purple/20 p-4 rounded-xl border border-space-accent/30 text-center flex items-center justify-center hover:shadow-lg transition-shadow"
                >
                  <p className="text-space-light">{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <Card className="cosmic-card p-8 bg-gradient-to-br from-space-purple/20 to-transparent border-space-accent/30">
              <CardContent className="space-y-6">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Our Mission
                </h2>
                <p className="text-xl text-space-light leading-relaxed">
                  "Empowering space explorers through education, innovation, and
                  community. We believe that the cosmos belongs to everyone, and
                  through accessible, high-quality space education, we're
                  building the foundation for humanity's multi-planetary
                  future."
                </p>
                <div className="flex justify-center space-x-8 pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-space-accent">
                      500+
                    </div>
                    <div className="text-space-light">Students Inspired</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-space-accent">
                      10+
                    </div>
                    <div className="text-space-light">Events Per Year</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-space-accent">
                      5+
                    </div>
                    <div className="text-space-light">Expert Speakers</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-10"
          >
            Meet Our Development Team
          </motion.h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="text-center"
              >
                <div className="w-28 h-28 mx-auto mb-3 rounded-full overflow-hidden border-2 border-space-purple bg-gradient-to-br from-space-purple/30 to-space-dark">
                <div className="relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    loading="lazy"
                    className="w-full h-full object-cover select-none"
                  />
                  <div className="absolute inset-0 z-10" />
                  </div>
                </div>
                <h3 className="text-base font-semibold text-white">
                  {member.name}
                </h3>
                <p className="text-sm text-space-accent">{member.role}</p>
                <div className="flex justify-center space-x-4 mt-2 cursor-pointer">
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github
                        size={18}
                        className="text-space-light hover:text-space-accent transition-colors"
                      />
                    </a>
                  )}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin
                        size={18}
                        className="text-space-light hover:text-space-accent transition-colors"
                      />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Club Department Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-10"
          >
            Core team Members
          </motion.h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
            {clubDepartments.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="text-center"
              >
                <div className="w-28 h-28 mx-auto mb-3 rounded-full overflow-hidden border-2 border-space-purple bg-gradient-to-br from-space-purple/30 to-space-dark">
                  <img
                    src={member.image}
                    alt={member.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-base font-semibold text-white">
                  {member.name}
                </h3>
                <p className="text-sm text-space-accent">{member.role}</p>
                <div className="flex justify-center space-x-4 mt-2 cursor-pointer">
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github
                        size={18}
                        className="text-space-light hover:text-space-accent transition-colors"
                      />
                    </a>
                  )}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin
                        size={18}
                        className="text-space-light hover:text-space-accent transition-colors"
                      />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join Our Online Community
            </h2>
            <p className="text-xl text-space-light mb-8 max-w-2xl mx-auto">
              Connect with ISA Club members through our social platforms for
              daily updates, discussions, and astronomy content.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
              <a
                href="https://www.instagram.com/isa.astrospace"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-gradient-to-r from-space-purple to-pink-600 hover:opacity-90 transition-opacity px-6 py-3 rounded-lg text-white font-medium shadow-md"
              >
                <Instagram size={20} />
                Follow on Instagram
              </a>

              <a
                href="https://chat.whatsapp.com/L3cBfJnQuO3BAbTnr4FbUE?fbclid=PAZXh0bgNhZW0CMTEAAabtBxDh4K2fihtHj_B3jxL87pA6nBaZurvhwesU32G5CftYqkhHFxdlicg_aem_v3_CsBh8Vl8Pxnf3HD8Ltg"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-green-600 hover:bg-green-700 transition-colors px-6 py-3 rounded-lg text-white font-medium shadow-md"
              >
                <MessageCircle size={20} />
                Join WhatsApp Group
              </a>
            </div>

            {/* <div className="mt-6">
        <img
          src="/images/6e2f90e0-d9db-42ef-9c2d-def808dc9cef.png"
          alt="Community QR Code"
          className="h-32 w-auto mx-auto border border-space-purple rounded-lg shadow-md"
        />
        <p className="text-sm text-space-light mt-2">Scan to join our WhatsApp group</p>
      </div> */}
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Explore the Cosmos?
            </h2>
            <p className="text-xl text-space-light mb-8 max-w-2xl mx-auto">
              Join our community of space enthusiasts and start your journey to
              the stars today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-space-accent hover:bg-space-accent/90 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg shadow-space-accent/30"
                >
                  Join Our Community
                </motion.button>
              </Link>
              <Link to="/training">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-space-accent text-space-accent hover:bg-space-accent hover:text-white font-bold py-4 px-8 rounded-lg transition-all duration-300"
                >
                  Explore Courses
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
