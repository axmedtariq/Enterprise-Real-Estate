'use client';

import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchProperties } from '../../store/slices/propertySlice';
import { Heart, MessageCircle, Share2, MapPin, Loader2, Volume2, VolumeX } from 'lucide-react';
import Link from 'next/link';

// Component for individual video to handle Intersection Observer (auto-play when in view)
const VideoPost = ({ property, videoSrc }: { property: any, videoSrc: string }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(true);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        videoRef.current?.play().catch(() => { });
                    } else {
                        videoRef.current?.pause();
                    }
                });
            },
            { threshold: 0.6 }
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, []);

    const toggleMute = () => {
        setIsMuted(!isMuted);
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
        }
    };

    return (
        <div className="relative h-screen w-full snap-start flex items-center justify-center bg-black">
            {/* VIDEO PLAYER */}
            <video
                ref={videoRef}
                className="h-full w-full object-cover md:max-w-md md:rounded-3xl cursor-pointer shadow-2xl"
                src={videoSrc}
                loop
                muted={isMuted}
                playsInline
                onClick={toggleMute}
            />

            {/* OVERLAY CONTENT */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 md:max-w-md md:left-1/2 md:-translate-x-1/2 rounded-3xl pointer-events-none" />

            {/* FLOATING HEADER */}
            <div className="absolute top-24 left-4 md:top-6 md:left-[calc(50%-13rem)] z-10">
                <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2 cursor-pointer transition-all hover:bg-black/70" onClick={toggleMute}>
                    {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
                    <span className="text-white text-[10px] font-bold uppercase">{isMuted ? 'Sound Off' : 'Sound On'}</span>
                </div>
            </div>

            {/* INFO SIDEBAR */}
            <div className="absolute bottom-24 left-4 md:left-[calc(50%-13rem)] text-white w-3/4 max-w-xs z-10 pointer-events-auto">
                <div className="mb-2 flex items-center gap-2">
                    <span className="bg-[#d4af37] text-black text-[10px] font-black px-2 py-1 uppercase rounded-md shadow-[0_0_10px_rgba(212,175,55,0.4)]">
                        Sovereign Reel
                    </span>
                </div>
                <h2 className="text-2xl font-bold mb-1 drop-shadow-lg">{property.title}</h2>
                <p className="text-slate-300 text-sm flex items-center gap-1 mb-2">
                    <MapPin className="w-3 h-3 text-[#d4af37]" /> {property.address}
                </p>
                <p className="text-xl font-black text-[#d4af37] drop-shadow-lg">
                    ${Number(property.price).toLocaleString()}
                </p>
                <Link href={!property.id?.includes('dummy') ? `/property/${property.id}` : '#'}>
                    <button className="mt-4 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-2 rounded-full text-xs font-bold uppercase hover:bg-[#d4af37] hover:text-black hover:border-transparent transition-all shadow-xl">
                        View Estate
                    </button>
                </Link>
            </div>

            {/* ACTIONS SIDEBAR */}
            <div className="absolute bottom-24 right-4 md:right-[calc(50%-13rem)] flex flex-col gap-6 items-center z-10 pointer-events-auto">
                <div className="flex flex-col items-center gap-1 group">
                    <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:border-[#d4af37]/50 group-hover:bg-[#d4af37]/20 transition-all cursor-pointer">
                        <Heart className="w-6 h-6 text-white group-hover:text-[#d4af37] group-hover:fill-[#d4af37] transition-all" />
                    </div>
                    <span className="text-[10px] font-bold text-white shadow-black drop-shadow-md">12.4k</span>
                </div>

                <div className="flex flex-col items-center gap-1 group">
                    <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:border-blue-400/50 group-hover:bg-blue-400/20 transition-all cursor-pointer">
                        <MessageCircle className="w-6 h-6 text-white group-hover:text-blue-400 group-hover:fill-blue-400 transition-all" />
                    </div>
                    <span className="text-[10px] font-bold text-white shadow-black drop-shadow-md">842</span>
                </div>

                <div className="flex flex-col items-center gap-1 group">
                    <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:border-green-400/50 group-hover:bg-green-400/20 transition-all cursor-pointer">
                        <Share2 className="w-6 h-6 text-white group-hover:text-green-400 transition-all" />
                    </div>
                    <span className="text-[10px] font-bold text-white shadow-black drop-shadow-md">Share</span>
                </div>
            </div>
        </div>
    );
};

export default function VideoFeed() {
    const dispatch = useDispatch<AppDispatch>();
    const { properties, loading } = useSelector((state: RootState) => state.properties);

    const MOCK_VIDEOS = [
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
    ];

    // Dummy properties in case database is empty or still loading
    const dummyProperties = [
        { id: 'dummy-1', title: 'Skyline Penthouse', address: 'New York, NY', price: 8500000 },
        { id: 'dummy-2', title: 'Serene Villa', address: 'Malibu, CA', price: 14200000 },
        { id: 'dummy-3', title: 'Modern Retreat', address: 'Austin, TX', price: 3400000 },
        { id: 'dummy-4', title: 'Oceanfront Estate', address: 'Miami, FL', price: 21000000 },
        { id: 'dummy-5', title: 'Desert Oasis', address: 'Scottsdale, AZ', price: 6700000 }
    ];

    useEffect(() => {
        dispatch(fetchProperties({ type: 'buy' }));
    }, [dispatch]);

    const displayItems = properties && properties.length > 0 ? properties : dummyProperties;

    return (
        <div className="h-screen w-full bg-black overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar">
            {loading && properties.length === 0 && (
                <div className="h-screen w-full snap-start flex items-center justify-center bg-black">
                    <Loader2 className="w-10 h-10 text-[#d4af37] animate-spin" />
                </div>
            )}

            {!loading && displayItems.map((property, index) => (
                <VideoPost
                    key={property.id}
                    property={property}
                    videoSrc={MOCK_VIDEOS[index % MOCK_VIDEOS.length]}
                />
            ))}
        </div>
    );
}
