import { useEffect, useRef, useState } from 'react';
import { BookOpen, Calendar, ShoppingBag, Video, Users, Rocket } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'Training & Certification',
    description: 'Courses, workshops, and certifications in space science, satellite programming, and astrophysics.',
    color: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    textColor: 'text-purple-400',
  },
  {
    icon: Calendar,
    title: 'Astronomical Events',
    description: 'Live calendar of events such as meteor showers, eclipses, planetary transits, and more.',
    color: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    textColor: 'text-green-400',
  },
  {
    icon: Video,
    title: 'Webinars & Live Sessions',
    description: 'Interactive talks and sessions with scientists, astronauts, and industry experts.',
    color: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    textColor: 'text-red-400',
  },
  {
    icon: Users,
    title: 'Community Engagement',
    description: 'Forums and collaborative project spaces for students, researchers, and enthusiasts.',
    color: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-400',
  },
  {
    icon: Rocket,
    title: 'Hands-on Projects',
    description: 'Practical projects like rocketry, telescope building, and satellite programming challenges.',
    color: 'bg-teal-500/10',
    borderColor: 'border-teal-500/30',
    textColor: 'text-teal-400',
  },
  {
    icon: ShoppingBag,
    title: 'Space Marketplace',
    description: 'A dedicated e-commerce platform for space-related products, books, and specialized equipment.',
    color: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-400',
  },
];

const FeaturesSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) {
          const index = Number(visible.target.getAttribute('data-index'));
          setActiveIndex(index);
        }
      },
      {
        root: containerRef.current,
        threshold: 0.5,
      }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      cardRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <section className="py-10 bg-space-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Explore ISA Club Features</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover the many ways our platform bridges the gap between passion and profession in astronomy and space science.
          </p>
        </div>

        {/* Scrollable Feature Cards */}
        <div
          ref={containerRef}
          className="overflow-x-auto md:overflow-visible scrollbar-hide scroll-smooth snap-x snap-mandatory"
        >
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 min-w-[640px] md:min-w-0">
            {features.map((feature, index) => (
              <div
                key={index}
                data-index={index}
                ref={(el) => (cardRefs.current[index] = el)}
                className={`cosmic-card ${feature.color} p-6 ${feature.borderColor} flex-shrink-0 md:flex-shrink md:w-auto w-72 flex flex-col items-start animate-fade-in snap-start`}
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

        {/* Dot Indicators */}
        <div className="flex md:hidden justify-center gap-2 mt-6">
          {features.map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                i === activeIndex ? 'bg-white scale-110' : 'bg-gray-500'
              }`}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
