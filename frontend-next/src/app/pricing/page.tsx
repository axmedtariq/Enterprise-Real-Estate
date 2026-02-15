'use client';

import { Check, Crown, Gem, Shield } from 'lucide-react';

export default function Pricing() {
    const tiers = [
        {
            name: 'Access',
            price: 'Free',
            features: ['Global Market View', 'Basic Asset Search', 'Monthly Newsletter'],
            icon: Shield,
        },
        {
            name: 'Vanguard',
            price: '$5,000/mo',
            features: ['Priority Concierge', 'Off-Market Listings', 'Legal Advisory'],
            icon: Gem,
            popular: true,
        },
        {
            name: 'Sovereign',
            price: 'Invite Only',
            features: ['Private Island Acquisitions', 'Government Relations', 'Full Anonymity'],
            icon: Crown,
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="text-center mb-20">
                <h1 className="text-5xl font-black text-white mb-6 uppercase tracking-tighter">
                    Elevate Your <span className="text-[#d4af37]">Status</span>
                </h1>
                <p className="text-slate-400 max-w-2xl mx-auto">
                    Choose the tier that matches your influence. From priority access to sovereign anonymity.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {tiers.map((tier) => (
                    <div key={tier.name} className={`relative p-8 rounded-[2.5rem] border ${tier.popular ? 'border-[#d4af37] bg-[#d4af37]/5' : 'border-white/10 bg-white/5'} hover:transform hover:-translate-y-2 transition-all duration-300`}>
                        {tier.popular && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#d4af37] text-black text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full">
                                Most Desired
                            </div>
                        )}

                        <div className="mb-8">
                            <tier.icon className={`w-12 h-12 mb-6 ${tier.popular ? 'text-[#d4af37]' : 'text-slate-500'}`} />
                            <h3 className="text-2xl font-bold text-white uppercase tracking-widest mb-2">{tier.name}</h3>
                            <div className="text-4xl font-black text-white">{tier.price}</div>
                        </div>

                        <ul className="space-y-4 mb-8">
                            {tier.features.map((feature) => (
                                <li key={feature} className="flex items-center gap-3 text-sm text-slate-400">
                                    <Check className="w-4 h-4 text-[#d4af37]" /> {feature}
                                </li>
                            ))}
                        </ul>

                        <button className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors ${tier.popular ? 'bg-[#d4af37] text-black hover:bg-white' : 'bg-white/10 text-white hover:bg-white hover:text-black'}`}>
                            Request Access
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
