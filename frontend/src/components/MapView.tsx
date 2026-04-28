import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const LocationPicker = ({ setLocation }: any) => {
  useMapEvents({
    click(e) {
      setLocation({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });
  return null;
};

export default function MapView({ setLocation }: any) {
  return (
    <MapContainer
      center={[-15.3875, 28.3228]}
      zoom={13}
      className="h-64 w-full rounded-xl"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationPicker setLocation={setLocation} />
    </MapContainer>
  );
}