// import { motion } from "framer-motion";
// import { FaGithub, FaLinkedin } from "react-icons/fa";

// export default function TeamsSection({ department, teamName }) {
//   return (
//     <section className="py-16">
//       <div className="container mx-auto px-4">
//         <motion.h2
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           viewport={{ once: true }}
//           className="text-3xl md:text-4xl font-bold text-center mb-10"
//         >
//           {teamName}
//         </motion.h2>

//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
//           {department.map((member, index) => (
//             <motion.div
//               key={member.name}
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: index * 0.1 }}
//               viewport={{ once: true }}
//               whileHover={{ y: -4 }}
//               className="text-center"
//             >
//               <div className="w-28 h-28 mx-auto mb-3 rounded-full overflow-hidden border-2 border-space-purple bg-gradient-to-br from-space-purple/30 to-space-dark">
//                 <img
//                   src={member.image}
//                   alt={member.name}
//                   loading="lazy"
//                   className="w-full h-full object-cover"
//                 />
//               </div>

//               <h3 className="text-base font-semibold text-white">
//                 {member.name}
//               </h3>
//               <p className="text-sm text-space-accent">{member.role}</p>

//               <div className="flex justify-center space-x-4 mt-2 cursor-pointer">
//                 {member.github && (
//                   <a
//                     href={member.github}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
// <FaGithub className="w-5 h-5 text-space-light hover:text-space-accent transition-colors" />
//                   </a>
//                 )}
//                 {member.linkedin && (
//                   <a
//                     href={member.linkedin}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
// <FaLinkedin className="w-5 h-5 text-space-light hover:text-space-accent transition-colors" />
//                   </a>
//                 )}
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function TeamsSection({ department, teamName }) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-10 text-white"
        >
          {teamName}
        </motion.h2>

        {/* Flex Container */}
        <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
          {department.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="flex flex-col items-center text-center w-40 sm:w-44 md:w-48"
            >
              {/* Profile Image */}
              <div className="w-28 h-28 mb-3 rounded-full overflow-hidden border-2 border-space-purple bg-gradient-to-br from-space-purple/30 to-space-dark">
                <img
                  src={member.image}
                  alt={member.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Name + Role */}
              <h3 className="text-base font-semibold text-white">{member.name}</h3>
              <p className="text-sm text-space-accent">{member.role}</p>

              {/* Socials */}
              <div className="flex justify-center space-x-4 mt-2 cursor-pointer">
                {member.github && (
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-space-accent"
                  >
                    <FaGithub className="w-5 h-5 text-space-light hover:text-space-accent transition-colors" />
                  </a>
                )}
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-space-accent"
                  >
                    <FaLinkedin className="w-5 h-5 text-space-light hover:text-space-accent transition-colors" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}