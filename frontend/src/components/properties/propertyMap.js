// frontend/src/components/properties/PropertyMap.jsx
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useState } from 'react';
import { MapPin, School, Coffee, Train } from 'lucide-react';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export default function PropertyMap({ properties, center }) {
  const [selectedProp, setSelectedProp] = useState(null);
  const [viewState, setViewState] = useState({
    latitude: center?.lat || 40.7128,
    longitude: center?.lng || -74.0060,
    zoom: 13,
    pitch: 45 // 3D Perspective
  });

  return (
    <div className="h-[600px] w-full rounded-[2.5rem] overflow-hidden shadow-inner border-4 border-white dark:border-slate-800">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/navigation-night-v1" // Luxury Dark Mode
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <NavigationControl position="top-right" />

        {/* Property Markers */}
        {properties.map((prop) => (
          <Marker 
            key={prop._id} 
            latitude={prop.location.coordinates[1]} 
            longitude={prop.location.coordinates[0]}
          >
            <button 
              onClick={() => setSelectedProp(prop)}
              className="group relative flex flex-col items-center"
            >
              <div className="bg-blue-600 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg group-hover:bg-white group-hover:text-blue-600 transition-all border-2 border-transparent group-hover:border-blue-600">
                ${(prop.price / 1000).toFixed(0)}k
              </div>
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-blue-600 group-hover:border-t-white" />
            </button>
          </Marker>
        ))}

        {/* Selected Property Popup */}
        {selectedProp && (
          <Popup
            latitude={selectedProp.location.coordinates[1]}
            longitude={selectedProp.location.coordinates[0]}
            onClose={() => setSelectedProp(null)}
            closeButton={false}
            className="rounded-2xl overflow-hidden"
          >
            <div className="p-2 flex gap-3 items-center">
              <img src={selectedProp.images[0].url} className="w-16 h-16 rounded-lg object-cover" />
              <div>
                <p className="font-bold text-slate-900 text-xs">{selectedProp.title}</p>
                <p className="text-blue-600 font-bold text-sm">${selectedProp.price.toLocaleString()}</p>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}