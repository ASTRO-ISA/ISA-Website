import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

const CtaSection = () => {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const handleButtonClick = () => {
    if(isLoggedIn){
      navigate('/events')
    } else {
      navigate('/login')
    }
  }
  return (
    <section className="py-20 bg-space-dark relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-purple-glow opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-space-accent/5 blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white space-glow">
            Join the ISA Community Today
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Connect with fellow space enthusiasts, access exclusive resources, and embark on an exciting journey of astronomical discovery.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="cosmic-card p-6 text-left">
              <div className="text-4xl font-bold text-space-accent mb-2">500+</div>
              <p className="text-white">Active Members</p>
            </div>
            <div className="cosmic-card p-6 text-left">
              <div className="text-4xl font-bold text-space-accent mb-2">30+</div>
              <p className="text-white">Events Per Year</p>
            </div>
            <div className="cosmic-card p-6 text-left">
              <div className="text-4xl font-bold text-space-accent mb-2">15+</div>
              <p className="text-white">Expert Speakers</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={handleButtonClick} className="bg-space-accent hover:bg-space-accent/80 text-white px-8 py-6 text-lg">
              {isLoggedIn? "Explore Events" : "Become a Member"}
            </Button>
            <Button variant="outline" className="border-space-purple text-space-light hover:bg-space-purple/20 px-8 py-6 text-lg">
              <Link to="about">
               Learn More
              </Link>
            </Button>
          </div>
          
          {/* <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="flex items-center">
              <img 
                src="/images/6e2f90e0-d9db-42ef-9c2d-def808dc9cef.png" 
                alt="NASA partnership" 
                className="h-12 w-auto"
              />
            </div>
            <div className="h-12 w-px bg-gray-700 hidden md:block"></div>
            <p className="text-gray-400">
              In collaboration with LNCT Group of Colleges and various space organizations
            </p>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
