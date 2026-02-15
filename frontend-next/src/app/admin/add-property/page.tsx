'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, ShieldCheck, Box, Image as ImageIcon, Sparkles } from 'lucide-react';

export default function AddProperty() {
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploadStep, setUploadStep] = useState("");
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        category: 'buy',
        threeDUrl: '',
        location: { address: 'Palm Jumeirah, Dubai', lat: 25.1124, lng: 55.1389 }
    });

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setImages([]);
            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = () => {
                    if (reader.readyState === 2 && typeof reader.result === 'string') {
                        setImages(old => [...old, reader.result as string]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            setUploadStep("Encrypting & Uploading Assets...");
            // Mock upload for now or implement real upload endpoint
            // const { data: imgData } = await axios.post('/api/v1/admin/upload', { images });
            const mockImages = images.map((img, i) => ({ public_id: `mock_${i}`, url: img }));

            setUploadStep("Syncing with Global Atlas...");
            const finalData = {
                ...formData,
                price: Number(formData.price),
                has3D: !!formData.threeDUrl,
                images: mockImages
            };

            await axios.post('http://localhost:5000/api/v1/admin/property/new', finalData);

            setUploadStep("Listing Live.");
            alert("Sovereign Asset Published Successfully.");
        } catch (err) {
            console.error(err);
            setUploadStep("Error in Sync.");
            alert("Failed to publish asset.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto my-12 p-10 bg-[#020617] rounded-[2.5rem] border border-[#d4af37]/20 shadow-2xl">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Register Asset</h2>
                    <p className="text-[#d4af37] text-[10px] font-bold tracking-[0.3em] uppercase">Sovereign Admin Terminal</p>
                </div>
                <ShieldCheck className="w-10 h-10 text-[#d4af37] opacity-50" />
            </div>

            <form onSubmit={submitHandler} className="grid gap-6">
                {/* TITLE & PRICE */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-slate-500 text-[10px] font-bold uppercase ml-2">Asset Identity</label>
                        <input type="text" placeholder="e.g. The Glass Pavilion" required
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-[#d4af37] outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-slate-500 text-[10px] font-bold uppercase ml-2">Valuation ($)</label>
                        <input type="number" placeholder="50000000" required
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-[#d4af37] outline-none transition-all" />
                    </div>
                </div>

                {/* 🚀 3D TOUR & CATEGORY */}
                <div className="p-6 bg-[#d4af37]/5 rounded-3xl border border-[#d4af37]/20 border-dashed group">
                    <div className="flex items-center gap-3 mb-4">
                        <Box className="w-5 h-5 text-[#d4af37]" />
                        <label className="text-[#d4af37] font-black text-xs uppercase tracking-widest">Digital Twin (3D Matterport)</label>
                    </div>
                    <input type="text" placeholder="https://my.matterport.com/show/..."
                        onChange={(e) => setFormData({ ...formData, threeDUrl: e.target.value })}
                        className="w-full bg-transparent text-white text-sm outline-none border-b border-white/10 focus:border-[#d4af37] pb-2" />
                </div>

                {/* 🖼️ MEDIA UPLOAD */}
                <div className="space-y-4">
                    <label className="text-slate-500 text-[10px] font-bold uppercase ml-2 flex items-center gap-2">
                        <ImageIcon className="w-3 h-3" /> 4K Visual Assets
                    </label>
                    <div className="flex flex-wrap gap-4">
                        {images.map((img, i) => (
                            <div key={i} className="relative group w-24 h-24">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={img} alt="Preview" className="w-full h-full rounded-2xl object-cover border border-white/10" />
                                {i === 0 && <span className="absolute top-1 left-1 bg-[#d4af37] text-[8px] font-bold px-2 py-0.5 rounded-md">HERO</span>}
                            </div>
                        ))}
                        <label className="w-24 h-24 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#d4af37] transition-all bg-white/5">
                            <UploadCloud className="text-slate-500 w-6 h-6" />
                            <span className="text-[8px] font-bold text-slate-500 mt-1 uppercase">Add Media</span>
                            <input type="file" multiple hidden onChange={onChange} />
                        </label>
                    </div>
                </div>

                {/* SUBMIT BUTTON */}
                <button type="submit" disabled={loading} className="group relative mt-4 overflow-hidden rounded-2xl">
                    <div className={`absolute inset-0 bg-gradient-to-r from-[#d4af37] to-[#f1d27b] transition-transform duration-500 ${loading ? 'translate-y-0' : 'translate-y-full group-hover:translate-y-0'}`} />
                    <div className={`relative w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border border-[#d4af37] transition-colors duration-500
            ${loading ? 'text-black' : 'text-[#d4af37] group-hover:text-black'}`}>
                        {loading ? (
                            <span className="flex items-center justify-center gap-3">
                                <Sparkles className="w-4 h-4 animate-pulse" /> {uploadStep}
                            </span>
                        ) : "Publish to Global Network"}
                    </div>
                </button>
            </form>
        </div>
    );
}
