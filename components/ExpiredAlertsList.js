"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUtensils, FaClock, FaHistory } from "react-icons/fa";
import { getExpiredAlerts } from "@/utils/expiredAlerts";

export default function ExpiredAlertsList() {
    const [expiredAlerts, setExpiredAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExpiredAlerts = async () => {
            try {
                const alerts = await getExpiredAlerts();
                setExpiredAlerts(alerts);
            } catch (error) {
                console.error("Error fetching expired alerts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExpiredAlerts();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-gray-700">
                <FaHistory className="text-xl" />
                <h2 className="text-2xl font-semibold">Expired Food Alerts</h2>
            </div>

            {expiredAlerts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No expired food alerts found.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {expiredAlerts.map((alert) => (
                        <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-lg p-6"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {alert.restaurant_name}
                                    </h3>
                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                        Expired
                                    </span>
                                </div>

                                <div className="flex items-center text-gray-600">
                                    <FaClock className="mr-2" />
                                    <span>
                                        Expired: {new Date(alert.expiredAt?.toDate()).toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex items-center text-gray-600">
                                    <FaHistory className="mr-2" />
                                    <span>
                                        Posted: {new Date(alert.original_timestamp?.toDate()).toLocaleString()}
                                    </span>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <p className="text-sm text-gray-500">
                                        Alert ID: {alert.food_alert_id}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
} 