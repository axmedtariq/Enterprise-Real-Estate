// frontend/src/components/properties/ContactCard.jsx
export default function ContactCard({ price, agent }) {
  return (
    <div className="sticky top-24 p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl">
      <div className="mb-6">
        <span className="text-slate-500 text-sm font-medium">Guide Price</span>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          ${price?.toLocaleString()}
        </h2>
      </div>

      <form className="space-y-4">
        <input type="text" placeholder="Full Name" className="w-full p-4 rounded-xl border border-slate-200 dark:bg-slate-800 dark:border-none" />
        <input type="email" placeholder="Email Address" className="w-full p-4 rounded-xl border border-slate-200 dark:bg-slate-800 dark:border-none" />
        <textarea placeholder="I'm interested in this property..." rows="4" className="w-full p-4 rounded-xl border border-slate-200 dark:bg-slate-800 dark:border-none" />
        
        <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all transform hover:scale-[1.02]">
          Schedule a Private Tour
        </button>
      </form>

      <div className="mt-6 flex items-center gap-4 pt-6 border-t border-slate-100">
        <img src={agent.avatar} className="w-12 h-12 rounded-full object-cover" alt="Agent" />
        <div>
          <p className="font-bold text-sm">{agent.name}</p>
          <p className="text-xs text-blue-600 font-medium">Verified Platinum Agent</p>
        </div>
      </div>
    </div>
  );
}