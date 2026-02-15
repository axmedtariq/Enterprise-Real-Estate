'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchProperties, setFilters } from '../store/slices/propertySlice';
import { Loader2, Globe, Search, MapPin, Building2, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Dynamically import Map to avoid SSR issues with Leaflet
const MapSearch = dynamic(() => import('../components/MapSearch'), {
  ssr: false,
  loading: () => <div className="h-[600px] w-full bg-white/5 animate-pulse rounded-[2.5rem] flex items-center justify-center text-slate-500">Loading Satellite Data...</div>
});

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { properties, loading, filters } = useSelector((state: RootState) => state.properties);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  useEffect(() => {
    dispatch(fetchProperties(filters));
  }, [dispatch, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // dispatch(setFilters({ ...filters, search: searchTerm }));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pb-20">
      {/* HEADER BRANDING */}
      <div className="mb-12 flex flex-col items-center text-center mt-10">
        <div className="flex items-center gap-2 mb-4 px-4 py-1 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/5">
          <Globe className="w-3 h-3 text-[#d4af37] animate-spin-slow" />
          <span className="text-[10px] text-[#d4af37] font-black uppercase tracking-[0.3em]">
            Sovereign Global Search Active
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
          Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f1d27b]">Legacy.</span>
        </h1>

        {/* SEARCH BAR */}
        <form onSubmit={handleSearch} className="relative w-full max-w-2xl group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/20 to-[#f1d27b]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-50" />
          <div className="relative flex items-center bg-[#0f172a] border border-white/10 rounded-2xl p-2 shadow-2xl">
            <Search className="w-6 h-6 text-slate-500 ml-4" />
            <input
              type="text"
              placeholder="Search by location, keyword, or asset ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-white px-4 py-3 placeholder:text-slate-600 font-medium"
            />
            <button type="submit" className="bg-[#d4af37] text-black font-bold uppercase tracking-widest text-[10px] px-6 py-3 rounded-xl hover:bg-[#f1d27b] transition-colors">
              Access
            </button>
          </div>
        </form>

        {/* FILTERS & VIEW TOGGLE */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <button
            onClick={() => dispatch(setFilters({ type: 'buy' }))}
            className={`px-6 py-2 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all ${filters.type === 'buy' ? 'bg-[#d4af37] text-black border-[#d4af37]' : 'border-white/10 text-slate-400 hover:border-[#d4af37] hover:text-[#d4af37]'}`}
          >
            Buy Estate
          </button>
          <button
            onClick={() => dispatch(setFilters({ type: 'rent' }))}
            className={`px-6 py-2 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all ${filters.type === 'rent' ? 'bg-[#d4af37] text-black border-[#d4af37]' : 'border-white/10 text-slate-400 hover:border-[#d4af37] hover:text-[#d4af37]'}`}
          >
            Lease Asset
          </button>
          <div className="w-px h-8 bg-white/10 mx-2" />
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}
            className="px-6 py-2 rounded-full border border-white/10 text-white hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest transition-all"
          >
            {viewMode === 'grid' ? 'Show Map' : 'Show Grid'}
          </button>
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-10 h-10 text-[#d4af37] animate-spin" />
        </div>
      ) : (
        <>
          {viewMode === 'map' ? (
            <MapSearch properties={properties} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group bg-[#0f172a] rounded-[2rem] overflow-hidden border border-white/5 hover:border-[#d4af37]/50 transition-all duration-500"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={property.images?.[0]?.url || "https://images.unsplash.com/photo-1613490493576-7fde63acd811"}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                      <span className="text-[#d4af37] text-[10px] font-black uppercase tracking-widest">
                        ${property.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#d4af37] transition-colors line-clamp-1">{property.title}</h3>
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                          <MapPin className="w-3 h-3 text-[#d4af37]" />
                          {property.address}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/5">
                      <div className="flex gap-3">
                        {property.has3D && (
                          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase">
                            <Building2 className="w-3 h-3 text-[#d4af37]" /> 3D Ready
                          </div>
                        )}
                      </div>
                      <Link href={`/property/${property.id}`}>
                        <button className="text-[10px] font-black uppercase tracking-widest text-[#d4af37] flex items-center gap-2 group-hover:gap-3 transition-all">
                          View Asset <ExternalLink className="w-3 h-3" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
