import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-teal-400 via-purple-500 to-pink-500" />

      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/uploads/LOGO WHITE.png" className="h-32" alt="The Better Together Network Logo" />
            </div>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Connecting participants and providers through community-driven solutions
            </p>
            <div className="flex space-x-3">
              <a
                href="http://www.facebook.com/groups/bettertogethernetworkaustralia"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/groups/14784418"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/what-we-do', label: 'What We Do' },
                { to: '/subscription', label: 'Subscription Plans' },
                { to: '/business-directory', label: 'Business Directory' },
                { to: '/calendar', label: 'Calendar' },
                { to: '/blog', label: 'Blog' },
                { to: '/about', label: 'About' },
                { to: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 group-hover:bg-teal-400 transition-colors duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-5">Contact Us</h3>
            <ul className="space-y-4">
              <li>
                <a href="mailto:weare@bettertogethernetwork.com.au" className="flex items-center gap-3 group">
                  <div className="w-9 h-9 rounded-lg bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-all duration-200 flex-shrink-0">
                    <Mail className="w-4 h-4 text-gray-300" />
                  </div>
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    weare@bettertogethernetwork.com.au
                  </span>
                </a>
              </li>
              <li>
                <a href="tel:0403678767" className="flex items-center gap-3 group">
                  <div className="w-9 h-9 rounded-lg bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-all duration-200 flex-shrink-0">
                    <Phone className="w-4 h-4 text-gray-300" />
                  </div>
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">0403678767</span>
                </a>
              </li>
              <li>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-gray-300" />
                  </div>
                  <span className="text-sm text-gray-300">328 Swanston St, Melbourne VIC 3000</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Supporting Organizations */}
        <div className="border-t border-white/10 pt-10">
          <h4 className="text-center text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Supported By</h4>
          <div className="flex justify-center items-center gap-6 flex-wrap">
            <img src="/uploads/Supported by partners.png" alt="Partners" className="w-16 h-16 bg-white/10 rounded-lg" />
            <img src="/uploads/community.jpg" alt="Community" className="w-16 h-16 bg-white/10 rounded-lg" />
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-10 pt-8 text-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} The Better Together Network. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
