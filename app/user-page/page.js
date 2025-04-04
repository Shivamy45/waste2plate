import React from 'react';

const main_page = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white py-4 px-6 flex justify-between items-center shadow-sm">
        <div className="flex items-center">
          <div className="mr-4">
            <div className="relative">
              <div className="bg-green-800 text-white font-bold p-2 rounded-lg transform rotate-6">
                <span className="text-xs">FREE FOOD</span>
                <br />
                <span className="text-lg">ALERT!</span>
              </div>
              <div className="absolute -right-2 -bottom-4">
                <div className="bg-orange-400 h-6 w-3 rounded-full transform rotate-12"></div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-6 text-gray-600">
            <span className="cursor-pointer">FAQs</span>
            <span className="cursor-pointer flex items-center">
              Alliance
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </span>
            <span className="cursor-pointer flex items-center">
              Free Food
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </span>
            <span className="cursor-pointer">Terms & Conditions</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="bg-green-800 text-white px-6 py-2 rounded-full hover:bg-green-700 transition">
            Sign in
          </button>
          <span className="text-gray-600 cursor-pointer">Contact Us</span>
        </div>
      </nav>
      
      {/* Hero Section */}
      <div className="relative">
        <div className="w-full h-96 bg-blue-50 overflow-hidden">
          {/* Food images background */}
          <div className="absolute inset-0 flex">
            <div className="w-1/3 h-full overflow-hidden">
              <div className="w-64 h-64 bg-red-300 rounded-full -ml-16 mt-20 overflow-hidden relative">
                {/* Left food image placeholder */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-50 opacity-30"></div>
              </div>
            </div>
            <div className="w-2/3 h-full flex justify-end">
              <div className="w-96 h-96 mt-12 mr-8 overflow-hidden relative">
                {/* Right food image placeholder */}
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-blue-50 opacity-20"></div>
              </div>
            </div>
          </div>
          
          {/* Hero Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="bg-white p-8 ml-24 w-96 rounded-lg shadow-md">
              <h1 className="text-5xl font-bold text-gray-800 mb-4">Free Food Now.</h1>
              <p className="text-gray-600 mb-6">Sign up to receive alerts about free food on campus.</p>
              <button className="bg-green-800 text-white px-6 py-3 rounded-md hover:bg-green-700 transition">
                Start Now
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tagline Section */}
      <div className="text-center py-12">
        <h2 className="text-5xl font-bold text-green-800">Sick of Food Waste? Same here.</h2>
      </div>
      
      {/* Feature Icons (Simplified) */}
      <div className="flex justify-center space-x-16 py-8">
        <div className="bg-green-800 w-20 h-20 rounded-full flex items-center justify-center"></div>
        <div className="bg-green-800 w-20 h-20 rounded-full flex items-center justify-center"></div>
        <div className="bg-green-800 w-20 h-20 rounded-full flex items-center justify-center"></div>
        <div className="bg-green-800 w-20 h-20 rounded-full flex items-center justify-center"></div>
      </div>
    </div>
  );
};

export default main_page;