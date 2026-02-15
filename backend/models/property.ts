import mongoose, { Schema, Document } from 'mongoose';

// 💎 THE INSTITUTIONAL SCHEMA
export interface IProperty extends Document {
  title: string;
  price: number; // Stored as number for AI sorting and filtering
  location: {
    address: string;
    coordinates: [number, number]; // [lng, lat] for the Map
  };
  images: { public_id: string; url: string }[];
  description: string;
  has3D: boolean;
  category: 'buy' | 'rent';
  companyId: string; // For Agency Isolation
}

const propertySchema = new Schema<IProperty>({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  location: {
    address: String,
    coordinates: { type: [Number], index: '2dsphere' } // Critical for the Map!
  },
  images: [{ public_id: String, url: String }],
  description: String,
  has3D: { type: Boolean, default: false },
  category: { type: String, enum: ['buy', 'rent'], default: 'buy' },
  companyId: { type: String, default: "SOVEREIGN_GLOBAL" }
}, { timestamps: true });

export const Property = mongoose.model<IProperty>("Property", propertySchema);

// 🚀 ENHANCED SEED LOGIC
// Use this to populate your "1.5M reach" network instantly
export const seedProperties = async (req: any, res: any) => {
  try {
    await Property.deleteMany({});
    
    const cities = [
      { name: "Palm Jumeirah, Dubai", coords: [55.1389, 25.1124] },
      { name: "Bel Air, Los Angeles", coords: [-118.4517, 34.0837] },
      { name: "Knightsbridge, London", coords: [-0.1633, 51.5005] }
    ];

    const dummyData = Array.from({ length: 50 }).map((_, i) => ({
      title: `Sovereign Asset ${1000 + i}`,
      price: Math.floor(Math.random() * 45000000) + 5000000, // $5M to $50M
      location: {
        address: cities[i % cities.length].name,
        coordinates: cities[i % cities.length].coords
      },
      images: [{ public_id: "seed", url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811" }],
      description: "An ultra-high-net-worth architectural masterpiece.",
      has3D: true,
      category: i % 2 === 0 ? 'buy' : 'rent',
      companyId: "SOVEREIGN_GLOBAL"
    }));

    await Property.insertMany(dummyData);
    res.json({ success: true, message: "50 Institutional Assets Synchronized." });
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};