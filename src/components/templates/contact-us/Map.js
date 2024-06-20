"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./map.module.css";

export default function Map({ position, center, children }) {

  return (
    <MapContainer center={center} zoom={16} scrollWheelZoom={true} className={styles.map}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>Set Coffee</Popup>
      </Marker>
      <div className={styles.details}>{children}</div>
    </MapContainer>
  );
}
