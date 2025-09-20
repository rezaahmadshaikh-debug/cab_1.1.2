import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, MapPin, LifeBuoy } from 'lucide-react';

// Define an interface for the form data
interface IFormData {
    name: string;
    email: string;
    phone: string;
    vehicle: string;
}

const DriveWithUs: React.FC = () => {
    const [formData, setFormData] = useState<IFormData>({
        name: '',
        email: '',
        phone: '',
        vehicle: ''
    });

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { name, email, phone, vehicle } = formData;

        const message = `Hello Saffari, I'm interested in becoming a driver partner.

*Name:* ${name}
*Email:* ${email}
*Phone:* ${phone}
*Vehicle Info:* ${vehicle}

Please provide me with the next steps.`;

        const encodedMessage = encodeURIComponent(message);
        const clientWhatsAppNumber = '918265036513'; // Your client's WhatsApp number
        const whatsappURL = `https://wa.me/${clientWhatsAppNumber}?text=${encodedMessage}`;

        window.open(whatsappURL, '_blank');

        // Reset form after submission
        setFormData({ name: '', email: '', phone: '', vehicle: '' });
    };

    return (
        <section id="drive-with-us" className="py-20 sm:py-28 bg-[#0B1120] text-gray-200">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    {/* Info Section */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.7 }}
                        className="text-center md:text-left"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-white">Partner with Saffari</h2>
                        <p className="mt-4 text-gray-400">
                            Join the forefront of autonomous transportation. We're looking for professional autonomous vehicle operators to expand our premium network.
                        </p>
                        <ul className="mt-6 space-y-4 text-left">
                            <li className="flex items-start space-x-3">
                                <DollarSign className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                                <span><span className="font-semibold text-white">Competitive Earnings:</span> Maximize your vehicle's potential.</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <MapPin className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                                <span><span className="font-semibold text-white">Flexible Routes:</span> Operate in high-demand zones across the state.</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <LifeBuoy className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                                <span><span className="font-semibold text-white">24/7 Support:</span> Our operations team is always here to assist you.</span>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Form Section */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.7 }}
                        className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6 sm:p-8 shadow-2xl"
                    >
                        <h3 className="text-2xl font-semibold text-white mb-6">Become a Driver Partner</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                                />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                                />
                            </div>
                            <div>
                                <label htmlFor="vehicle" className="block text-sm font-medium text-gray-400 mb-1">Tell us about your vehicle</label>
                                <textarea
                                    id="vehicle"
                                    name="vehicle"
                                    value={formData.vehicle}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-transform duration-300 hover:scale-105 shadow-lg shadow-blue-600/30"
                            >
                                Submit Application
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default DriveWithUs;
