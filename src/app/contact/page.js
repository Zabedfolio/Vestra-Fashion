'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiClient } from '../../lib/apiClient';
import { useAuth } from '../../lib/auth-context';

export default function ContactPage() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name && email && subject && message) {
      setSubmitting(true);
      const toastId = toast.loading('Sending message...');
      try {
        await apiClient.post('/api/contacts', { name, email, phone, subject, message });
        toast.success('Message sent successfully! We will get back to you soon.', { id: toastId });
        setName(user?.name || '');
        setEmail(user?.email || '');
        setPhone(user?.phone || '');
        setSubject('');
        setMessage('');
      } catch (err) {
        console.error(err);
        toast.error('Failed to send message. Please try again.', { id: toastId });
      } finally {
        setSubmitting(false);
      }
    } else {
      toast.error('Please fill in all fields.');
    }
  };

  return (
    <main className="w-full bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-16 border-b border-zinc-100 pb-8 text-center max-w-3xl mx-auto">
          <p className="text-[10px] font-heading font-bold tracking-[0.25em] text-zinc-400 uppercase mb-3">
            Get In Touch
          </p>
          <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-dark uppercase tracking-tight leading-none mb-4">
            Contact <span className="text-[#C9FA75]">Us</span>
          </h1>
          <p className="font-body text-zinc-500 text-sm sm:text-base leading-relaxed">
            Have questions about fit, orders, or shipping? Reach out and our team will get back to you shortly.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 lg:gap-16 items-start">
          
          {/* Contact Form */}
          <div className="bg-zinc-50 border border-zinc-150 rounded-2xl p-6 sm:p-10">
            <h2 className="font-heading font-bold text-xl text-dark uppercase tracking-wide mb-6">
              Send Message
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label htmlFor="name" className="block text-xs font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-dark rounded-xl text-sm font-body outline-none transition-colors duration-200"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-dark rounded-xl text-sm font-body outline-none transition-colors duration-200"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-xs font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    Mobile Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+8801XXXXXXXXX"
                    className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-dark rounded-xl text-sm font-body outline-none transition-colors duration-200"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-xs font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Order Question / General Fit"
                  className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-dark rounded-xl text-sm font-body outline-none transition-colors duration-200"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows="5"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message here..."
                  className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-dark rounded-xl text-sm font-body outline-none transition-colors duration-200 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-dark text-white hover:bg-[#C9FA75] hover:text-dark font-heading font-bold text-xs tracking-widest uppercase rounded-xl transition-all duration-200 active:scale-95 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Sending...' : 'Send Message'}
                {!submitting && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                )}
              </button>
            </form>
          </div>

          {/* Contact Details Panel */}
          <div className="space-y-8 bg-zinc-50 border border-zinc-150 rounded-2xl p-6 sm:p-8">
            <h2 className="font-heading font-bold text-lg text-dark uppercase tracking-wide pb-4 border-b border-zinc-200/60">
              Details Info
            </h2>
            
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-heading font-bold tracking-wider text-zinc-400 uppercase mb-1.5">HQ Address</p>
                <p className="font-body text-zinc-600 text-sm leading-relaxed">
                  VESTRA Flagship Store<br />
                  Road 11, Banani, Dhaka, Bangladesh
                </p>
              </div>

              <div>
                <p className="text-[10px] font-heading font-bold tracking-wider text-zinc-400 uppercase mb-1.5">Direct Contacts</p>
                <p className="font-body text-zinc-600 text-sm leading-relaxed">
                  Phone: +880 1234 567890<br />
                  Email: support@vestra.com
                </p>
              </div>

              <div>
                <p className="text-[10px] font-heading font-bold tracking-wider text-zinc-400 uppercase mb-1.5">Support Hours</p>
                <p className="font-body text-zinc-600 text-sm leading-relaxed">
                  Saturday – Thursday: 10:00 AM – 8:00 PM<br />
                  Friday: 2:00 PM – 8:00 PM
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
