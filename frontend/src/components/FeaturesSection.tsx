
import { BookOpen, Calendar, ShoppingBag, Video, Users, Rocket } from 'lucide-react';

const features = [
  {
    icon: ShoppingBag,
    title: 'Space Marketplace',
    description: 'A dedicated e-commerce platform for space-related products, books, and specialized equipment.',
    color: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-400'
  },
  {
    icon: BookOpen,
    title: 'Training & Certification',
    description: 'Courses, workshops, and certifications in space science, satellite programming, and astrophysics.',
    color: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    textColor: 'text-purple-400'
  },
  {
    icon: Calendar,
    title: 'Astronomical Events',
    description: 'Live calendar of events such as meteor showers, eclipses, planetary transits, and more.',
    color: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    textColor: 'text-green-400'
  },
  {
    icon: Video,
    title: 'Webinars & Live Sessions',
    description: 'Interactive talks and sessions with scientists, astronauts, and industry experts.',
    color: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    textColor: 'text-red-400'
  },
  {
    icon: Users,
    title: 'Community Engagement',
    description: 'Forums and collaborative project spaces for students, researchers, and enthusiasts.',
    color: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-400'
  },
  {
    icon: Rocket,
    title: 'Hands-on Projects',
    description: 'Practical projects like rocketry, telescope building, and satellite programming challenges.',
    color: 'bg-teal-500/10',
    borderColor: 'border-teal-500/30',
    textColor: 'text-teal-400'
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-10 bg-space-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Explore ISA Club Features</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover the many ways our platform bridges the gap between passion and profession in astronomy and space science.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`cosmic-card ${feature.color} p-6 ${feature.borderColor} flex flex-col items-start animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`p-3 rounded-full ${feature.color} ${feature.borderColor} mb-6`}>
                <feature.icon className={`h-6 w-6 ${feature.textColor}`} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
