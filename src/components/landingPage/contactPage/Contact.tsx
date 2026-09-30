// Update your Contact component to include all fields
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Mail,
    Phone,
    MapPin,
    Clock,
    Send,
    CheckCircle2,
    MessageSquare,
    Building,
    User,
    DollarSign,
    Briefcase
} from 'lucide-react';

interface FormData {
    name: string;
    email: string;
    message: string;
    company?: string;
    phone?: string;
    services?: string;
    budget?: string;
}

const Contact: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        message: '',
        company: '',
        phone: '',
        services: '',
        budget: ''
    });
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSending(true);
        setError(null);

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Something went wrong');

            setSuccess(true);
            setFormData({ 
                name: '', 
                email: '', 
                message: '',
                company: '',
                phone: '',
                services: '',
                budget: ''
            });
            
            // Reset success message after 5 seconds
            setTimeout(() => setSuccess(false), 5000);
        } catch (err: any) {
            setError(err.message || 'Failed to send message. Please try again later.');
        } finally {
            setSending(false);
        }
    };

    const inputClasses = "w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 text-foreground placeholder-muted-foreground";

    return (
        <div className="min-h-screen bg-white relative">
            <main className="relative z-10 pt-24">
                <div className="container max-w-[1320px] mx-auto px-4">
                    <motion.div 
                        className="max-w-3xl mx-auto text-center mb-16" 
                        initial={{ opacity: 0, y: 30 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-3xl md:text-5xl font-bold mb-6 mt-16">Contact Us</h1>
                        <p className="text-xl text-muted-foreground">
                            Reach out to <span className="font-semibold text-primary">ClickMasters</span> for inquiries or support.
                        </p>
                    </motion.div>

                    {/* Form Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start pb-20">
                        <motion.div 
                            className="relative bg-card/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 lg:p-10 border border-border/70"
                            initial={{ opacity: 0, x: -30 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            transition={{ duration: 0.6 }}
                        >
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <MessageSquare className="w-7 h-7 text-primary" />
                                    <h2 className="text-2xl font-bold text-foreground">Send us a message</h2>
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm mb-6">
                                        {error}
                                    </div>
                                )}

                                {success ? (
                                    <motion.div 
                                        className="bg-green-50 border border-green-200 rounded-xl p-6 text-center"
                                        initial={{ opacity: 0, scale: 0.9 }} 
                                        animate={{ opacity: 1, scale: 1 }}
                                    >
                                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                                        </div>
                                        <h4 className="text-xl font-bold text-foreground mb-2">Message Sent!</h4>
                                        <p className="text-muted-foreground">
                                            Thank you for contacting us! We'll get back to you within 24 hours.
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            A confirmation email has been sent to your inbox.
                                        </p>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="relative">
                                                <User className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                                                <input
                                                    type="text"
                                                    name="name"
                                                    autoComplete="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="Full Name *"
                                                    className={`${inputClasses} pl-10`}
                                                    required
                                                />
                                            </div>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    autoComplete="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="Email Address *"
                                                    className={`${inputClasses} pl-10`}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    autoComplete="tel"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    placeholder="Phone Number"
                                                    className={`${inputClasses} pl-10`}
                                                />
                                            </div>
                                            <div className="relative">
                                                <Building className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                                                <input
                                                    type="text"
                                                    name="company"
                                                    autoComplete="organization"
                                                    value={formData.company}
                                                    onChange={handleChange}
                                                    placeholder="Company Name"
                                                    className={`${inputClasses} pl-10`}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="relative">
                                                <Briefcase className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                                                <select
                                                    name="services"
                                                    value={formData.services}
                                                    onChange={handleChange}
                                                    className={`${inputClasses} pl-10 appearance-none`}
                                                >
                                                    <option value="">Select Service</option>
                                                    <option value="web-development">Web Development</option>
                                                    <option value="mobile-apps">Mobile Apps</option>
                                                    <option value="digital-marketing">Digital Marketing</option>
                                                    <option value="seo">SEO Services</option>
                                                    <option value="graphic-design">Graphic Design</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                       <div className="relative">
    <DollarSign className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
    <input
        type="text"
        name="budget"
        value={formData.budget}
        onChange={handleChange}
        placeholder="Your Budget"
        className={`${inputClasses} pl-10`}
    />
</div>
                                        </div>

                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={5}
                                            placeholder="Your message... *"
                                            className={inputClasses}
                                            required
                                        />

                                        <button
                                            type="submit"
                                            disabled={sending}
                                            className={`w-full py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                                                sending 
                                                    ? 'bg-muted cursor-not-allowed' 
                                                    : 'bg-primary text-white hover:bg-primary/90 hover:scale-[1.02]'
                                            }`}
                                        >
                                            {sending ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-5 h-5" />
                                                    Send Message
                                                </>
                                            )}
                                        </button>

                                        <p className="text-xs text-muted-foreground text-center">
                                            * Required fields. We'll get back to you within 24 hours.
                                        </p>
                                    </form>
                                )}
                            </div>
                        </motion.div>

                        {/* Contact Info Cards */}
                        <div className="space-y-6">
                            <motion.div
                                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <ContactInfoCard
                                    icon={Phone}
                                    title="Call Us"
                                    details={['+92 333-1116842', '+92 332-5394285']}
                                />
                                <ContactInfoCard
                                    icon={Mail}
                                    title="Email Us"
                                    details={['marketing@clickmasters.pk', 'info@clickmasters.pk']}
                                />
                                <ContactInfoCard
                                    icon={MapPin}
                                    title="Visit Us"
                                    details={['Main PWD Rd, Islamabad, Punjab, Pakistan']}
                                />
                                <ContactInfoCard
                                    icon={Clock}
                                    title="Business Hours"
                                    details={['Mon-Sat: 9AM - 6PM', '24/7 Support']}
                                />
                            </motion.div>

                            {/* Map */}
                            <motion.div 
                                className="relative bg-card/90 backdrop-blur-sm rounded-3xl shadow-xl p-2 h-[300px] overflow-hidden group border border-border/70"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <iframe
                                    title="ClickMasters Location"
                                       src="https://www.google.com/maps?q=Main+PWD+Rd,+PWD+Housing+Society+Sector+A+PWD+Society,+Islamabad,+Punjab+45700,+Pakistan&output=embed"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, borderRadius: '12px' }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

// Helper component for contact info cards
const ContactInfoCard: React.FC<{
    icon: React.ElementType;
    title: string;
    details: string[];
}> = ({ icon: Icon, title, details }) => {
    return (
        <div className="relative group h-full">
            <div className="absolute -inset-2 bg-gradient-to-r from-orange-500/20 to-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-card/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-border/70 h-full">
                <div className="flex items-start gap-4 h-full">
                    <div className="relative p-3 rounded-xl bg-gradient-to-r from-primary to-primary group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
                        {details.map((detail, idx) => (
                            <p key={idx} className="text-muted-foreground text-sm mb-1">{detail}</p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;