import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";

const About = () => {
  const [aboutData, setAboutData] = useState(null);

  // Fetch dynamic about content from backend
  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/about");
        setAboutData(res.data);
      } catch (error) {
        console.error("Error fetching about content:", error);
      }
    };

    fetchAboutContent();
  }, []);

  return (
    <>
      <Navbar />

      {/* Inline global font (optional — ideally move to index.css) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      {/* Top Heading Section */}
      <section className="py-16 px-6 md:px-12 text-center bg-white">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-semibold text-gray-800"
        >
          {aboutData?.title || "About Our Blog"}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mt-4 text-base text-gray-500 max-w-xl mx-auto"
        >
          {aboutData?.subtitle ||
            "Discover stories, tutorials, and developer insights — written to inspire, educate, and empower the tech community."}
        </motion.p>
      </section>

      {/* About Content Section */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-10 py-10">
        {/* 👇 Animated Image */}
        <motion.img
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full md:w-1/2 rounded-2xl shadow-lg object-cover"
          src={
            aboutData?.image ||
            "https://images.unsplash.com/photo-1522199710521-72d69614c702?q=80&w=830&h=844&auto=format&fit=crop"
          }
          alt="Team writing blog articles"
        />

        {/* 👇 Animated Text Section */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full md:w-1/2"
        >
          <h2 className="text-3xl font-semibold text-gray-800 mb-3">
            {aboutData?.sectionTitle || "Why We Write"}
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            {aboutData?.description ||
              "Our blog is a space to share what we learn every day — from code to creativity. Whether it’s debugging stories, tech deep-dives, or simple productivity hacks, we aim to keep it real, relatable, and valuable for all developers."}
          </p>

          {/* Insight Cards with subtle fade-in animation */}
          <div className="flex flex-col gap-6">
            {(aboutData?.insights || [
              {
                title: "Practical Insights",
                text: "Hands-on coding lessons and real project experiences to help you grow faster and smarter.",
                emoji:
                  "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/flashEmoji.png",
              },
              {
                title: "Clean & Engaging Reads",
                text: "We focus on clarity and simplicity — every article is crafted to be easy and enjoyable to read.",
                emoji:
                  "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/colorsEmoji.png",
              },
              {
                title: "Built for Developers",
                text: "Articles written from a developer’s perspective — honest, practical, and easy to apply in your projects.",
                emoji:
                  "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/puzzelEmoji.png",
              },
            ]).map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="flex items-start gap-4"
              >
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-indigo-50 border border-indigo-200 rounded-lg">
                  <img src={item.emoji} alt={item.title} className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-700">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <Footer />
    </>
  );
};

export default About;
