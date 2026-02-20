'use client';

import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchProperties } from '../../store/slices/propertySlice';
import { Heart, MessageCircle, Share2, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function VideoFeed() {
    const dispatch = useDispatch<AppDispatch>();
    const { properties } = useSelector((state: RootState) => state.properties);
    // Mock videos for demo purposes since we just added the field
    const MOCK_VIDEOS = [
        "https://assets.mixkit.co/videos/preview/mixkit-modern-luxury-apartment-interior-check-26955-large.mp4",
        "https://assets.mixkit.co/videos/preview/mixkit-living-room-with-a-view-of-the-ocean-4158-large.mp4",
        "https://assets.mixkit.co/videos/preview/mixkit-view-of-a-modern-building-with-a-pool-22763-large.mp4"
    ];

    useEffect(() => {
        dispatch(fetchProperties({ type: 'buy' }));
    }, [dispatch]);

    return (
        <div className="h-screen w-full bg-black overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar">
            {properties.map((property, index) => (
                <div key={property.id} className="relative h-screen w-full snap-start flex items-center justify-center bg-black">
                    {/* VIDEO PLAYER */}
                    <video
                        className="h-full w-full object-cover md:max-w-md md:rounded-3xl"
                        src={MOCK_VIDEOS[index % MOCK_VIDEOS.length]}
                        autoPlay
                        loop
                        muted
                        playsInline
                    />

                    {/* OVERLAY CONTENT */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 md:max-w-md md:left-1/2 md:-translate-x-1/2 rounded-3xl pointer-events-none" />

                    {/* INFO SIDEBAR */}
                    <div className="absolute bottom-24 left-4 md:left-[calc(50%-13rem)] text-white w-3/4 max-w-xs z-10 pointer-events-auto">
                        <div className="mb-2 flex items-center gap-2">
                            <span className="bg-[#d4af37] text-black text-[10px] font-black px-2 py-1 uppercase rounded-md">
                                Sovereign Showcase
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold mb-1 drop-shadow-lg">{property.title}</h2>
                        <p className="text-slate-200 text-sm flex items-center gap-1 mb-2">
                            <MapPin className="w-3 h-3 text-[#d4af37]" /> {property.address}
                        </p>
                        <p className="text-xl font-black text-[#d4af37] drop-shadow-md">
                            ${property.price.toLocaleString()}
                        </p>
                        <Link href={`/property/${property.id}`}>
                            <button className="mt-4 bg-white/20 backdrop-blur-md border border-white/30 text-white px-6 py-2 rounded-full text-xs font-bold uppercase hover:bg-[#d4af37] hover:text-black transition-all">
                                View Details
                            </button>
                        </Link>
                    </div>

                    {/* ACTIONS SIDEBAR */}
                    <div className="absolute bottom-24 right-4 md:right-[calc(50%-13rem)] flex flex-col gap-6 items-center z-10 pointer-events-auto">
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:scale-110 transition-transform cursor-pointer">
                                <Heart className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-[10px] font-bold">12.4k</span>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                            <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:scale-110 transition-transform cursor-pointer">
                                <MessageCircle className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-[10px] font-bold">842</span>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                            <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:scale-110 transition-transform cursor-pointer">
                                <Share2 className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-[10px] font-bold">Share</span>
                        </div>
                    </div>

                </div>
            ))}
        </div>
    );
}
