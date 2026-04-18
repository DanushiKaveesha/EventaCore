import React, { useState } from 'react';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate a network request
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  const contactDetails = [
    {
      icon: MapPinIcon,
      title: 'Our Location',
      lines: ['New Kandy Rd, Malabe 10115', 'Sri Lanka Institute of Information Technology'],
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: EnvelopeIcon,
      title: 'Email Us',
      lines: ['support@eventacore.lk', 'info@eventacore.lk'],
      color: 'bg-purple-50 text-purple-600',
    },
    {
      icon: PhoneIcon,
      title: 'Call Us',
      lines: ['+94 11 754 4801', '+94 76 123 4567'],
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      icon: ClockIcon,
      title: 'Working Hours',
      lines: ['Mon – Fri: 8:00 AM – 6:00 PM', 'Sat: 9:00 AM – 1:00 PM'],
      color: 'bg-amber-50 text-amber-600',
    },
  ];

  // SLIIT Malabe Campus coordinates: 6.9145° N, 79.9736° E
  const mapSrc =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.0157086338!2d79.97153987499!3d6.9145299930668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae256db1a6771c5%3A0x2c63e344ab9a7536!2sSri%20Lanka%20Institute%20of%20Information%20Technology%20(SLIIT)!5e0!3m2!1sen!2slk!4v1711234567890!5m2!1sen!2slk';

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-blue-500 selection:text-white">

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse delay-1000"></div>
          <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-sky-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse delay-700"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-bold tracking-wide uppercase mb-8 shadow-sm">
            <SparklesIcon className="w-5 h-5" />
            Get in Touch
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-[1.1] mb-8">
            We'd Love to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Hear From You
            </span>
          </h1>
          <p className="mt-6 text-xl text-gray-500 max-w-3xl mx-auto font-medium leading-relaxed">
            Have a question, partnership proposal, or just want to say hello? Our team at SLIIT
            Malabe is always ready to help you out.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactDetails.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 group"
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${item.color} transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
                >
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-2">{item.title}</h3>
                {item.lines.map((line, i) => (
                  <p key={i} className="text-gray-500 font-medium text-sm leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map + Form Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

            {/* Embedded Map */}
            <div className="flex flex-col">
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-3">
                  Find Us at{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    SLIIT Malabe
                  </span>
                </h2>
                <p className="text-gray-500 font-medium text-lg">
                  Located at New Kandy Rd, Malabe — Sri Lanka's premier tech university campus.
                </p>
              </div>
              <div className="relative flex-1 rounded-[2rem] overflow-hidden border border-gray-100 shadow-2xl shadow-gray-200/70 min-h-[420px]">
                <iframe
                  title="SLIIT Malabe Campus"
                  src={mapSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '420px', display: 'block' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>
              </div>
              {/* Directions CTA */}
              <a
                href="https://maps.google.com/?q=SLIIT+Malabe+Campus"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-blue-100 text-blue-600 font-bold hover:bg-blue-50 hover:border-blue-200 transition-all duration-300 self-start"
              >
                <MapPinIcon className="w-5 h-5" />
                Open in Google Maps
              </a>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-[2rem] p-8 lg:p-10 border border-gray-100 shadow-2xl shadow-gray-200/50">
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
                    <CheckCircleIcon className="w-12 h-12 text-emerald-500" />
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-3">Message Sent!</h3>
                  <p className="text-gray-500 font-medium text-lg max-w-sm">
                    Thanks for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }}
                    className="mt-8 px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-black text-gray-900 mb-2">Send a Message</h2>
                  <p className="text-gray-500 font-medium mb-8">
                    Fill in the form below and we'll respond as soon as possible.
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5" htmlFor="name">
                          Full Name
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Jane Doe"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-800 placeholder-gray-400 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5" htmlFor="email">
                          Email Address
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="jane@example.com"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-800 placeholder-gray-400 font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5" htmlFor="subject">
                        Subject
                      </label>
                      <input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help?"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-800 placeholder-gray-400 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5" htmlFor="message">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        required
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us more about your inquiry..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-800 placeholder-gray-400 font-medium resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black text-lg hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <PaperAirplaneIcon className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default ContactUs;
