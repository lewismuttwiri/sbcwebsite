"use client";

import { motion } from "framer-motion";

const Stats = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Discover the scale of our operations and impact in Kenya
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="text-4xl font-bold text-blue-600 mb-2">100+</div>
            <div className="text-gray-600">Distributors Nationwide</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center"
          >
            <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-gray-600">Employees</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <div className="text-4xl font-bold text-blue-600 mb-2">1M+</div>
            <div className="text-gray-600">Customers Served</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center"
          >
            <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
            <div className="text-gray-600">Quality Assurance</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
