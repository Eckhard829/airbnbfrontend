import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white text-black py-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Support */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Support</h3>
          <ul className="space-y-2">
            <li><Link to="#" className="hover:text-gray-700">Help Center</Link></li>
            <li><Link to="#" className="hover:text-gray-700">AirCover</Link></li>
            <li><Link to="#" className="hover:text-gray-700">Anti-discrimination</Link></li>
            <li><Link to="#" className="hover:text-gray-700">Disability support</Link></li>
            <li><Link to="#" className="hover:text-gray-700">Cancellation options</Link></li>
            <li><Link to="#" className="hover:text-gray-700">Report neighborhood concern</Link></li>
          </ul>
        </div>
        
        {/* Center Column: Hosting */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Hosting</h3>
          <ul className="space-y-2">
            <li><Link to="#" className="hover:text-gray-700">Airbnb your home</Link></li>
            <li><Link to="#" className="hover:text-gray-700">Airbnb your experience</Link></li>
            <li><Link to="#" className="hover:text-gray-700">Airbnb your service</Link></li>
            <li><Link to="#" className="hover:text-gray-700">AirCover for Hosts</Link></li>
            <li><Link to="#" className="hover:text-gray-700">Hosting resources</Link></li>
            <li><Link to="#" className="hover:text-gray-700">Community forum</Link></li>
            <li><Link to="#" className="hover:text-gray-700">Hosting responsibly</Link></li>
            <li><Link to="#" className="hover:text-gray-700">Join a free Hosting class</Link></li>
            <li><Link to="#" className="hover:text-gray-700">Find a co-host</Link></li>
          </ul>
        </div>
        
        {/* Right Column: Airbnb */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Airbnb</h3>
          <ul className="space-y-2">
            <li><Link to="#" className="hover:text-gray-700">2025 Summer Release</Link></li>
            <li><Link to="#" className="hover:text-gray-700">Newsroom</Link></li>
            <li><Link to="#" className="hover:text-gray-700">Careers</Link></li>
            <li><Link to="#" className="hover:text-gray-700">Investors</Link></li>
            <li><Link to="#" className="hover:text-gray-700">Airbnb.org emergency stays</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-8 border-t border-gray-300 pt-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Left: Copyright */}
          <div>
            <p className="mb-0">© 2025 Airbnb, Inc. | Privacy | Terms | Sitemap</p>
          </div>
          
          {/* Right: Language and Currency selectors */}
          <div className="flex space-x-4">
            <select className="p-2 bg-white border border-gray-300 rounded">
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
            <select className="p-2 bg-white border border-gray-300 rounded">
              <option value="usd">USD</option>
              <option value="eur">EUR</option>
              <option value="gbp">GBP</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;