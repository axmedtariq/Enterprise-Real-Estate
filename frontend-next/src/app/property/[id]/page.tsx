'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { MapPin, Building2, ShieldCheck, Star } from 'lucide-react';
import BookingWidget from '@/components/BookingWidget';

export default function PropertyDetails() {
    const { id } = useParams();
    const [property, setProperty] = useState<any>(null);

    useEffect(() => {
        // In a real app, use SWR or React Query
        // Mocking the fetch for now if API isn't live
        const fetchProp = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/v1/property/${id}`);
                setProperty(data.data);
            } catch (err) {
                // Fallback for demo
                setProperty({
                    id: '1', title: 'The Royal Atlantis Penthouse', price: 15000000,
                    address: 'Palm Jumeirah, Dubai',
                    description: 'Experience the pinnacle of luxury living in this ultra-modern penthouse.',
                    images: [{ url: 'https://images.unsplash.com/photo-1600596542815-2a4d9fdb2529' }],
                    lat: 25.1124, lng: 55.1389
                });
            }
        };
        if (id) fetchProp();
    }, [id]);

    if (!property) return <div className="min-h-screen pt-32 text-center text-white">Loading Asset...</div>;

    return (
        <div className="min-h-screen pb-20">
            {/* HERO IMAGE */}
            <div className="relative h-[60vh] w-full">
                <img src={property.images?.[0]?.url} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-black/30" />
                <div className="absolute bottom-10 left-6 md:left-20 text-white">
                    <div className="flex items-center gap-2 mb-2 text-[#d4af37] font-bold uppercase tracking-widest text-sm">
                        <ShieldCheck className="w-4 h-4" /> Sovereign Verified
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">{property.title}</h1>
                    <div className="flex items-center gap-6 text-lg font-medium text-slate-300">
                        <span className="flex items-center gap-2"><MapPin className="w-5 h-5 text-[#d4af37]" /> {property.address}</span>
                        <span className="flex items-center gap-2"><Star className="w-5 h-5 text-[#d4af37]" /> 4.9 (12 Reviews)</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* LEFT CONTENT */}
                <div className="lg:col-span-2 space-y-12">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-widest">About this Asset</h2>
                        <p className="text-slate-400 leading-relaxed text-lg">
                            {property.description || "Entering this estate feels like stepping into a private realm of tranquility..."}
                        </p>
                    </div>

                    {/* AMENITIES */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-widest">Elite Amenities</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {['Private Beach', 'Helipad', 'Smart Home', 'Cinema', 'Wine Cellar', 'Spa'].map(a => (
                                <div key={a} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <Building2 className="w-5 h-5 text-[#d4af37]" />
                                    <span className="text-white font-medium">{a}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDEBAR - BOOKING */}
                <div>
                    <BookingWidget property={property} />
                </div>
            </div>
        </div>
    );
}
