'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { MapPin, Building2, ShieldCheck, Star, ThumbsUp, MessageSquare, ImageIcon, Check } from 'lucide-react';
import BookingWidget from '@/components/BookingWidget';

export default function PropertyDetails() {
    const { id } = useParams();
    const [property, setProperty] = useState<any>(null);
    const [newReview, setNewReview] = useState('');
    const [mockReviews, setMockReviews] = useState([
        { id: 1, user: 'Eleanor Vance', rating: 5, date: 'October 2025', text: 'Stunning property with absolute perfection in every detail. The rooms are exactly as showcased.', imgUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=600' },
        { id: 2, user: 'David Chen', rating: 5, date: 'September 2025', text: 'An unparalleled luxury experience. The concierge was fantastic, and the views are breathing taking without doubt.' }
    ]);

    useEffect(() => {
        const fetchProp = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/v1/property/${id}`);
                // Assuming API returns property and its reviews included or separate
                if (data.data) {
                    setProperty(data.data);
                }
            } catch (err) {
                // Fallback for demo
                setProperty({
                    id: '1', title: 'The Royal Atlantis Penthouse Suite', price: 15000,
                    address: 'Palm Jumeirah, Dubai',
                    description: 'Experience the pinnacle of luxury living in this ultra-modern penthouse. Perfectly designed for the elite, featuring state of the art amenities, a wrap-around balcony, and 24/7 world-class concierge service.',
                    images: [
                        { url: 'https://images.unsplash.com/photo-1600596542815-2a4d9fdb2529?w=1200&q=80' },
                        { url: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80' },
                        { url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80' },
                        { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80' },
                        { url: 'https://images.unsplash.com/photo-1502672260266-1c158bf8be4f?w=800&q=80' }
                    ],
                    lat: 25.1124, lng: 55.1389
                });
            }
        };
        if (id) fetchProp();
    }, [id]);

    if (!property) return <div className="min-h-screen flex items-center justify-center text-white"><span className="text-xl animate-pulse">Loading Asset...</span></div>;

    const handleAddReview = () => {
        if (!newReview.trim()) return;
        setMockReviews([{
            id: Date.now(),
            user: 'Guest User',
            rating: 5,
            date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            text: newReview,
        }, ...mockReviews]);
        setNewReview('');
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white pb-32">
            {/* Nav Spacing */}
            <div className="h-24"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2 text-[#d4af37] font-bold uppercase tracking-widest text-xs">
                        <ShieldCheck className="w-5 h-5 text-blue-400" /> Sovereign Verified Asset
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">{property.title}</h1>
                    <div className="flex items-center gap-4 text-sm font-medium text-slate-300">
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-[#d4af37]" /> {property.address}</span>
                        <span className="flex items-center gap-1 font-bold underline cursor-pointer hover:text-white transition"><Star className="w-4 h-4 text-[#d4af37] fill-[#d4af37]" /> 4.9 ({mockReviews.length} Reviews)</span>
                    </div>
                </div>

                {/* Booking.com / Airbnb Style Image Gallery Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-3 h-[50vh] md:h-[65vh] rounded-3xl overflow-hidden mb-12">
                    <div className="md:col-span-2 md:row-span-2 relative group cursor-pointer" onClick={() => alert("Open full gallery functionality")}>
                        <img src={property.images?.[0]?.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Main property view" />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition"></div>
                    </div>
                    {property.images?.slice(1, 5).map((img: any, idx: number) => (
                        <div key={idx} className="hidden md:block relative group cursor-pointer overflow-hidden">
                            <img src={img.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={`Room view ${idx}`} />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition"></div>
                        </div>
                    ))}
                    <div className="md:hidden absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold border border-white/20">
                        1 / {property.images?.length || 1}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* LEFT CONTENT */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Description */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 uppercase tracking-wider">About this Asset</h2>
                            <p className="text-slate-400 leading-relaxed text-lg whitespace-pre-wrap">
                                {property.description}
                            </p>
                        </div>

                        {/* Top Amenities */}
                        <div>
                            <h2 className="text-2xl font-bold mb-6 uppercase tracking-wider">Elite Amenities</h2>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4">
                                {['Private Beach Access', 'Infinity Pool', 'Smart Home Integration', 'Private Cinema', 'Temperature-controlled Wine Cellar', 'On-call Spa'].map(a => (
                                    <div key={a} className="flex items-center gap-3">
                                        <Check className="w-6 h-6 text-[#d4af37]" />
                                        <span className="text-slate-200 font-medium text-sm">{a}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="pt-12 border-t border-white/10">
                            <div className="flex items-center gap-3 mb-8">
                                <Star className="w-8 h-8 text-[#d4af37] fill-[#d4af37]" />
                                <h2 className="text-3xl font-black">4.9 · {mockReviews.length} Reviews</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                {mockReviews.map((review) => (
                                    <div key={review.id} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#d4af37] to-yellow-700 flex items-center justify-center font-bold text-lg">
                                                {review.user.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-lg">{review.user}</div>
                                                <div className="text-xs text-slate-400">{review.date}</div>
                                            </div>
                                        </div>
                                        <p className="text-slate-300 text-sm leading-relaxed mb-4">{review.text}</p>
                                        {review.imgUrl && (
                                            <div className="mt-4 rounded-xl overflow-hidden h-32 w-48 border border-white/10">
                                                <img src={review.imgUrl} className="w-full h-full object-cover" alt="Review attachment" />
                                            </div>
                                        )}
                                        <div className="flex items-center gap-4 mt-6 text-xs font-bold text-slate-400">
                                            <button className="flex items-center gap-1 hover:text-[#d4af37] transition"><ThumbsUp className="w-4 h-4" /> Helpful</button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add a Review */}
                            <div className="bg-[#0f172a] rounded-3xl p-6 md:p-8 border border-white/5">
                                <h3 className="text-xl font-bold mb-4">Leave a Review</h3>
                                <textarea
                                    value={newReview}
                                    onChange={(e) => setNewReview(e.target.value)}
                                    placeholder="Describe your experience with this property..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#d4af37] min-h-[120px] mb-4"
                                />
                                <div className="flex justify-between items-center">
                                    <button className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition">
                                        <ImageIcon className="w-5 h-5" /> Attach Image
                                    </button>
                                    <button
                                        onClick={handleAddReview}
                                        className="bg-[#d4af37] text-black px-6 py-3 rounded-lg font-bold uppercase tracking-wide hover:bg-yellow-500 transition"
                                    >
                                        Submit Review
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR - BOOKING WITH CALCULATOR */}
                    <div className="relative">
                        <BookingWidget property={property} />
                    </div>
                </div>
            </div>
        </div>
    );
}
