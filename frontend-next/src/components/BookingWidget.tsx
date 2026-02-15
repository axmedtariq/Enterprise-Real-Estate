'use client';

import { useState } from 'react';
import { format, differenceInDays } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function BookingWidget({ property }: { property: any }) {
    const [range, setRange] = useState<any>();
    const [loading, setLoading] = useState(false);

    const nights = range?.from && range?.to ? differenceInDays(range.to, range.from) : 0;
    const totalPrice = nights * property.price;

    const handleBooking = async () => {
        if (!range?.from || !range?.to) return;
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/v1/bookings', {
                propertyId: property.id,
                startDate: range.from,
                endDate: range.to,
                totalPrice,
                guestId: "GUEST_USER" // In real app, get from Redux auth
            });
            alert("Booking Confirmed! Welcome to the Elite.");
        } catch (err) {
            alert("Dates unavailable. Please choose another range.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sticky top-24">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <span className="text-3xl font-black text-white">${property.price.toLocaleString()}</span>
                    <span className="text-slate-400 text-sm font-medium"> / night</span>
                </div>
                <div className="flex items-center gap-1 text-[#d4af37] text-xs font-bold uppercase tracking-widest">
                    <CalendarIcon className="w-4 h-4" /> Check Availability
                </div>
            </div>

            <div className="bg-[#020617] rounded-2xl p-4 border border-white/10 mb-6 flex justify-center">
                <DayPicker
                    mode="range"
                    selected={range}
                    onSelect={setRange}
                    styles={{
                        head_cell: { color: '#d4af37' },
                        day: { color: 'white' },
                        day_selected: { backgroundColor: '#d4af37', color: 'black' }
                    }}
                />
            </div>

            <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm text-slate-400">
                    <span>{nights} nights x ${property.price.toLocaleString()}</span>
                    <span className="text-white">${totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-400">
                    <span>Sovereign Concierge Fee</span>
                    <span className="text-white">$5,000</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-white pt-4 border-t border-white/10">
                    <span>Total</span>
                    <span className="text-[#d4af37]">${(totalPrice + 5000).toLocaleString()}</span>
                </div>
            </div>

            <button
                onClick={handleBooking}
                disabled={loading || nights === 0}
                className="w-full bg-[#d4af37] text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Request Reservation"}
            </button>
        </div>
    );
}
