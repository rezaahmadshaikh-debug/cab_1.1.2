import React from 'react';
import { ArrowRight, MapPin, Clock, Shield, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';  // ✅ import useNavigate

const Hero: React.FC = () => {
  const navigate = useNavigate(); // ✅ useNavigate hook

  const handleBookNow = () => {
    navigate('/services'); // ✅ redirect to /services
  };

  return (
    <section className="relative min-h-screen pt-16 flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Premium cab in city"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 via-navy-800/80 to-primary-900/70"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/50 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-5xl mx-auto">

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-white leading-tight mb-6"
          >
            Book Your Ride
            <span className="block bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">
              Instantly
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl sm:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Safe & Reliable Cabs in Mumbai & Major Cities.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {/* ✅ Updated Book Now Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBookNow}   // ✅ same as Header
              className="group bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-12 py-5 rounded-2xl font-display font-bold text-xl flex items-center space-x-3 transition-all duration-300 shadow-2xl"
            >
              <span>Book Now</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <Link to="/services">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-5 rounded-2xl font-display font-semibold text-lg flex items-center space-x-3 hover:bg-white/20 transition-all duration-300"
              >
                <Play className="w-5 h-5" />
                <span>View Services</span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
