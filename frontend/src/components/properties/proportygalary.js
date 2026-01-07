// frontend/src/components/properties/PropertyGallery.jsx
import { motion } from "framer-motion";

export default function PropertyGallery({ images }) {
  return (
    <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[600px] rounded-3xl overflow-hidden">
      {/* Main Hero Image */}
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="col-span-2 row-span-2 relative overflow-hidden cursor-pointer"
      >
        <img src={images[0]?.url} className="object-cover w-full h-full" alt="Hero" />
      </motion.div>

      {/* Secondary Images */}
      {images.slice(1, 5).map((img, index) => (
        <div key={index} className="relative overflow-hidden cursor-pointer">
          <motion.img 
            whileHover={{ scale: 1.1 }}
            src={img.url} 
            className="object-cover w-full h-full transition-transform duration-500" 
          />
        </div>
      ))}
    </div>
  );
}