import React from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const PublicInfoPage = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
      className="flex items-center justify-center min-h-screen 
      bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200
      dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
      p-6"
    >
      {/* Glassmorphic Card */}
      <motion.div
        variants={fadeUp}
        className="relative w-full max-w-4xl p-10 rounded-3xl 
        backdrop-blur-2xl bg-white/40 dark:bg-gray-800/40
        border border-white/30 dark:border-gray-700/40 shadow-2xl"
      >
        {/* Title */}
        <motion.h1
          variants={fadeUp}
          className="text-center text-4xl font-extrabold mb-10
          text-indigo-700 dark:text-indigo-300 drop-shadow-sm"
        >
          Public Health Information
        </motion.h1>

        {/* === SECTION TEMPLATE === */}
        {/* COVID-19 */}
        <motion.div variants={fadeUp} className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            COVID-19 Updates
          </h2>

          <p className="text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">
            Stay updated with official global COVID-19 vaccination guidelines,
            safety recommendations, and trusted health information.
          </p>

          <a
            href="https://www.who.int/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 font-semibold text-indigo-600 
            dark:text-indigo-400 hover:underline"
          >
            Read More →
          </a>
        </motion.div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-300/40 dark:bg-gray-700/40 my-6"></div>

        {/* FLU SECTION */}
        <motion.div variants={fadeUp} className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Seasonal Flu Prevention
          </h2>

          <p className="text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">
            Learn essential steps for flu prevention, including vaccination,
            hygiene practices, and effective immunity-boosting habits.
          </p>

          <a
            href="https://www.cdc.gov/flu/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 font-semibold text-indigo-600 
            dark:text-indigo-400 hover:underline"
          >
            Read More →
          </a>
        </motion.div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-300/40 dark:bg-gray-700/40 my-6"></div>

        {/* MENTAL HEALTH */}
        <motion.div variants={fadeUp} className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Mental Health Awareness
          </h2>

          <p className="text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">
            Access trusted mental health resources, support services, and
            guidance for maintaining emotional well-being.
          </p>

          <a
            href="https://www.nami.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 font-semibold text-indigo-600 
            dark:text-indigo-400 hover:underline"
          >
            Read More →
          </a>
        </motion.div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-300/40 dark:bg-gray-700/40 my-6"></div>

        {/* PRIVACY BOX */}
        <motion.div
          variants={fadeUp}
          className="p-6 rounded-2xl bg-white/40 dark:bg-gray-700/40 
          border border-white/30 dark:border-gray-600/40"
        >
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Privacy Notice
          </h3>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
            Your privacy is important. All information shown here is public,
            verified, and does not include or collect any personal user data.
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PublicInfoPage;
