"use client";

import { useState, useEffect } from 'react';
import { FaBell, FaBellSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const NotificationSettings = () => {
    const [settings, setSettings] = useState({
        foodAlerts: true,
        priceUpdates: true,
        newListings: true,
        promotions: false,
    });

    const handleSettingChange = (setting) => {
        setSettings((prev) => ({
            ...prev,
            [setting]: !prev[setting],
        }));
        toast.success(`Notification setting updated`);
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Notification Settings</h2>
            
            <div className="space-y-4">
                {Object.entries(settings).map(([key, value]) => (
                    <div
                        key={key}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <div className="flex items-center">
                            {value ? (
                                <FaBell className="h-5 w-5 text-green-500 mr-3" />
                            ) : (
                                <FaBellSlash className="h-5 w-5 text-gray-400 mr-3" />
                            )}
                            <span className="text-gray-700 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                        </div>
                        <button
                            onClick={() => handleSettingChange(key)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                value
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {value ? 'Enabled' : 'Disabled'}
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-6 text-sm text-gray-500">
                <p>Manage your notification preferences to stay updated with the latest food alerts and updates.</p>
            </div>
        </div>
    );
};

export default NotificationSettings; 