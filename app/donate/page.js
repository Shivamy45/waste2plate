import { Heart } from 'lucide-react';

export default function QRDonationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <Heart className="mx-auto text-blue-600" size={36} />
          <h1 className="text-3xl font-bold text-gray-800 mt-4">Support Our Cause</h1>
          <p className="text-gray-600 mt-2">
            Scan the QR code below to make your donation
          </p>
        </div>
        
        {/* QR Code Placeholder */}
        <div className="w-64 h-64 mx-auto border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-6">
          <div className="text-gray-500">
          </div>
          
          {
          <img 
            src="/payment_qr.jpg" 
            alt="Donation QR Code" 
            className="w-full h-full object-contain"
          />
          }
        </div>
        
        <p className="text-gray-700 font-medium">
          Thank you for your generosity!
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Your support makes our work possible
        </p>
      </div>
      
      <footer className="mt-8 text-center text-gray-500 text-sm">
        © 2025 Your Organization. All rights reserved.
      </footer>
    </div>
  );
}