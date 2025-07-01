import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Star, Users, Award } from "lucide-react";

const About = () => {
  const teamMembers = [
    {
      name: "Rum Grok",
      role: "xAI Developer Team",
      bio: "Grok, created by xAI. We craft tools to empower space education.",
      image: "/images/ai-developer.png",
      isAI: true,
    },
    {
      name: "Dr. Sarah Chen",
      role: "Lead Astronomer",
      bio: "Expert in deep space observation with 15 years of experience. Passionate about making astronomy accessible to everyone.",
      image: "/placeholder.svg",
    },
    {
      name: "Prof. Alex Kumar",
      role: "Astrophysics Educator",
      bio: "Award-winning educator specializing in theoretical astrophysics and space technology innovations.",
      image: "/placeholder.svg",
    },
    {
      name: "Maya Rodriguez",
      role: "Mission Specialist",
      bio: "Former NASA engineer with expertise in spacecraft design and mission planning. Inspires the next generation of space explorers.",
      image: "/placeholder.svg",
    },
  ];

  const clubDepartments = [
    {
      name: "Dr. Jane Smith",
      role: "Astronomy Educator",
      bio: "Inspires students with hands-on workshops and stargazing sessions.",
      image: "/placeholder.svg",
    },
    {
      name: "Mark Johnson",
      role: "Rocket Engineering Lead",
      bio: "Expert in propulsion systems and rocket design, leading our rocketry programs.",
      image: "/placeholder.svg",
    },
    {
      name: "Lisa Wang",
      role: "Space Technology Coordinator",
      bio: "Coordinates cutting-edge space technology research and development projects.",
      image: "/placeholder.svg",
    },
  ];

  const milestones = [
    { year: "2020", title: "Club Founded", description: "ISA space education club established" },
    { year: "2021", title: "First Satellite Project", description: "Launched educational CubeSat program" },
    { year: "2022", title: "100+ Members", description: "Reached milestone of 100 active members" },
    { year: "2023", title: "Platform Launched", description: "Digital learning platform goes live" },
    { year: "2024", title: "International Recognition", description: "Awarded for excellence in space education" },
    { year: "2025", title: "Global Expansion", description: "Expanding programs worldwide" },
  ];

  return (
    <div className="min-h-screen bg-space-dark text-white pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-space-dark via-space-purple/20 to-space-dark">
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
            Empowering the next generation of space explorers through innovative education and hands-on experience
          </motion.p>
        </div>
      </section>

      {/* Mission Statement */}
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
                <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
                <p className="text-xl text-space-light leading-relaxed">
                  "Empowering space explorers through education, innovation, and community. We believe that the cosmos belongs to everyone, and through accessible, high-quality space education, we're building the foundation for humanity's multi-planetary future."
                </p>
                <div className="flex justify-center space-x-8 pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-space-accent">500+</div>
                    <div className="text-space-light">Students Inspired</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-space-accent">50+</div>
                    <div className="text-space-light">Projects Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-space-accent">15+</div>
                    <div className="text-space-light">Expert Instructors</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-gradient-to-r from-transparent via-space-purple/10 to-transparent">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12"
          >
            Our Journey
          </motion.h2>
          
          <div className="relative max-w-6xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-space-accent via-space-purple to-space-accent"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <Card className="cosmic-card p-6 hover:scale-105 transition-transform duration-300">
                      <CardContent>
                        <Badge className="bg-space-accent text-white mb-2">{milestone.year}</Badge>
                        <h3 className="text-xl font-bold text-white mb-2">{milestone.title}</h3>
                        <p className="text-space-light">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="w-2/12 flex justify-center">
                    <div className="w-4 h-4 bg-space-accent rounded-full border-4 border-space-dark shadow-lg shadow-space-accent/50"></div>
                  </div>
                  
                  <div className="w-5/12"></div>
                </motion.div>
              ))}
            </div>
          </div>
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
            className="text-4xl font-bold text-center mb-12"
          >
            Meet Our Development Team
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="cosmic-card h-full hover:border-space-accent/50 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="relative mb-6">
                      <div className={`w-48 h-48 mx-auto rounded-full overflow-hidden border-4 ${
                        member.isAI ? 'border-space-accent shadow-lg shadow-space-accent/50' : 'border-space-purple'
                      }`}>
                        {member.isAI ? (
                          <div className="w-full h-full bg-gradient-to-br from-space-accent via-space-purple to-space-dark flex items-center justify-center">
                            <div className="text-6xl">🤖</div>
                          </div>
                        ) : (
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      {member.isAI && (
                        <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-space-accent text-white">
                          AI Developer
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                    <p className="text-space-accent font-semibold mb-3">{member.role}</p>
                    <p className="text-space-light text-sm leading-relaxed">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Club Department Team */}
      <section className="py-16 bg-gradient-to-r from-transparent via-space-purple/10 to-transparent">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12"
          >
            Club Department Team
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {clubDepartments.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="cosmic-card h-full hover:border-space-accent/50 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-space-purple bg-gradient-to-br from-space-purple/30 to-space-dark">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                    <p className="text-space-accent font-semibold mb-3">{member.role}</p>
                    <p className="text-space-light text-sm leading-relaxed">{member.bio}</p>
                    <div className="flex justify-center space-x-2 mt-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={16} className="text-space-accent fill-current" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-space-purple/20 via-space-dark to-space-accent/20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Explore the Cosmos?</h2>
            <p className="text-xl text-space-light mb-8 max-w-2xl mx-auto">
              Join our community of space enthusiasts and start your journey to the stars today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-space-accent hover:bg-space-accent/90 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg shadow-space-accent/30"
              >
                Join Our Community
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-space-accent text-space-accent hover:bg-space-accent hover:text-white font-bold py-4 px-8 rounded-lg transition-all duration-300"
              >
                Explore Courses
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;