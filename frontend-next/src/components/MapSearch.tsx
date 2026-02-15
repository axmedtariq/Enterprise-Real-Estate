'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

// Fix for default Leaflet icon
const customIcon = new Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

export default function MapSearch({ properties }: { properties: any[] }) {
    // Default to Dubai center if no properties
    const center = properties[0] ? [properties[0].lat, properties[0].lng] : [25.1124, 55.1389];

    return (
        <div className="h-[600px] w-full rounded-[2.5rem] overflow-hidden border border-white/10 relative z-0">
            <MapContainer center={center as [number, number]} zoom={12} scrollWheelZoom={false} className="h-full w-full">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                {properties.map(p => (
                    <Marker key={p.id} position={[p.lat, p.lng]} icon={customIcon}>
                        <Popup>
                            <div className="text-black font-bold">
                                <h3 className="text-sm">{p.title}</h3>
                                <p className="text-[#d4af37]">${p.price.toLocaleString()}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
