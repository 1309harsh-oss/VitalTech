import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './NearbyHospitals.css';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const hospitalIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const pharmacyIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to recenter map when location changes
function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 14);
  }, [lat, lng, map]);
  return null;
}

function NearbyHospitals() {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [hospitals, setHospitals] = useState([]);
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  const [searchRadius, setSearchRadius] = useState(3000); // meters
  const [filter, setFilter] = useState('all'); // all, hospital, pharmacy, clinic
  const [selectedHospital, setSelectedHospital] = useState(null);

  const getLocation = useCallback(() => {
    setLoadingLocation(true);
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setLoadingLocation(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoadingLocation(false);
      },
      (error) => {
        setLocationError('Unable to get your location. Please enable location services.');
        setLoadingLocation(false);
        // Fallback to a default location (New Delhi)
        setUserLocation({ lat: 28.6139, lng: 77.2090 });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  // Fetch nearby hospitals from OpenStreetMap Overpass API
  const fetchNearbyHospitals = useCallback(async () => {
    if (!userLocation) return;
    setLoadingHospitals(true);
    
    const { lat, lng } = userLocation;
    const radiusM = searchRadius;
    
    // Overpass query for hospitals, clinics, pharmacies, doctors
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="hospital"](around:${radiusM},${lat},${lng});
        node["amenity"="clinic"](around:${radiusM},${lat},${lng});
        node["amenity"="pharmacy"](around:${radiusM},${lat},${lng});
        node["amenity"="doctors"](around:${radiusM},${lat},${lng});
        way["amenity"="hospital"](around:${radiusM},${lat},${lng});
        way["amenity"="clinic"](around:${radiusM},${lat},${lng});
      );
      out center body;
    `;

    try {
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: `data=${encodeURIComponent(query)}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      const data = await response.json();
      
      const results = data.elements
        .map(el => {
          const elLat = el.lat || el.center?.lat;
          const elLng = el.lon || el.center?.lon;
          if (!elLat || !elLng) return null;
          
          const distance = getDistanceKm(lat, lng, elLat, elLng);
          return {
            id: el.id,
            name: el.tags?.name || el.tags?.['name:en'] || 'Medical Facility',
            type: el.tags?.amenity || 'hospital',
            lat: elLat,
            lng: elLng,
            phone: el.tags?.phone || el.tags?.['contact:phone'] || null,
            website: el.tags?.website || null,
            address: el.tags?.['addr:full'] || el.tags?.['addr:street'] || null,
            openingHours: el.tags?.opening_hours || null,
            emergency: el.tags?.emergency === 'yes',
            distance: distance,
          };
        })
        .filter(Boolean)
        .sort((a, b) => a.distance - b.distance);

      setHospitals(results);
    } catch (err) {
      console.error('Error fetching hospitals:', err);
      setHospitals([]);
    } finally {
      setLoadingHospitals(false);
    }
  }, [userLocation, searchRadius]);

  useEffect(() => {
    if (userLocation) {
      fetchNearbyHospitals();
    }
  }, [userLocation, searchRadius, fetchNearbyHospitals]);

  function getDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'hospital': return '🏥';
      case 'clinic': return '🏨';
      case 'pharmacy': return '💊';
      case 'doctors': return '👨‍⚕️';
      default: return '🏥';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'hospital': return 'Hospital';
      case 'clinic': return 'Clinic';
      case 'pharmacy': return 'Pharmacy';
      case 'doctors': return 'Doctor';
      default: return 'Medical';
    }
  };

  const getMarkerIcon = (type) => {
    return type === 'pharmacy' ? pharmacyIcon : hospitalIcon;
  };

  const filteredHospitals = filter === 'all' 
    ? hospitals 
    : hospitals.filter(h => h.type === filter);

  const getDirectionsUrl = (lat, lng) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  };

  if (loadingLocation && !userLocation) {
    return (
      <div className="hospitals-page">
        <div className="hospitals-loading">
          <div className="hospitals-spinner"></div>
          <h3>Getting your location...</h3>
          <p>Please allow location access to find nearby hospitals</p>
        </div>
      </div>
    );
  }

  return (
    <div className="hospitals-page">
      <div className="hospitals-header">
        <div className="header-left">
          <h1>🗺️ Nearby Medical Facilities</h1>
          <p>Find hospitals, clinics, and pharmacies near you</p>
        </div>
        <div className="header-right">
          <button onClick={getLocation} className="refresh-location-btn" disabled={loadingLocation}>
            📍 {loadingLocation ? 'Locating...' : 'Refresh Location'}
          </button>
        </div>
      </div>

      {locationError && (
        <div className="location-warning">
          ⚠️ {locationError} — Showing default location. Click "Refresh Location" to try again.
        </div>
      )}

      {/* Controls */}
      <div className="hospitals-controls">
        <div className="filter-group">
          <label>Filter:</label>
          <div className="filter-buttons">
            {[
              { key: 'all', label: 'All', icon: '🔍' },
              { key: 'hospital', label: 'Hospitals', icon: '🏥' },
              { key: 'clinic', label: 'Clinics', icon: '🏨' },
              { key: 'pharmacy', label: 'Pharmacies', icon: '💊' },
              { key: 'doctors', label: 'Doctors', icon: '👨‍⚕️' },
            ].map(f => (
              <button
                key={f.key}
                className={`filter-btn ${filter === f.key ? 'active' : ''}`}
                onClick={() => setFilter(f.key)}
              >
                {f.icon} {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="radius-group">
          <label>Radius: {(searchRadius / 1000).toFixed(1)} km</label>
          <input
            type="range"
            min="1000"
            max="10000"
            step="500"
            value={searchRadius}
            onChange={(e) => setSearchRadius(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="hospitals-layout">
        {/* Map */}
        <div className="map-container">
          {userLocation && (
            <MapContainer
              center={[userLocation.lat, userLocation.lng]}
              zoom={14}
              style={{ height: '100%', width: '100%', borderRadius: '16px' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <RecenterMap lat={userLocation.lat} lng={userLocation.lng} />
              
              {/* User location marker */}
              <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                <Popup>
                  <strong>📍 Your Location</strong><br/>
                  {userLocation.lat.toFixed(5)}, {userLocation.lng.toFixed(5)}
                </Popup>
              </Marker>

              {/* Search radius circle */}
              <Circle
                center={[userLocation.lat, userLocation.lng]}
                radius={searchRadius}
                pathOptions={{ 
                  color: '#2563eb', 
                  fillColor: '#3b82f6', 
                  fillOpacity: 0.06,
                  weight: 1.5,
                  dashArray: '6,4'
                }}
              />

              {/* Hospital markers */}
              {filteredHospitals.map(h => (
                <Marker 
                  key={h.id} 
                  position={[h.lat, h.lng]} 
                  icon={getMarkerIcon(h.type)}
                  eventHandlers={{
                    click: () => setSelectedHospital(h.id)
                  }}
                >
                  <Popup>
                    <div style={{ minWidth: '180px' }}>
                      <strong>{getTypeIcon(h.type)} {h.name}</strong><br/>
                      <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{getTypeLabel(h.type)}</span><br/>
                      <span style={{ fontSize: '0.85rem' }}>📏 {h.distance.toFixed(2)} km away</span><br/>
                      {h.phone && <span style={{ fontSize: '0.85rem' }}>📞 {h.phone}</span>}
                      {h.emergency && <><br/><span style={{ color: '#dc2626', fontWeight: 600, fontSize: '0.85rem' }}>🚑 Emergency Available</span></>}
                      <br/>
                      <a href={getDirectionsUrl(h.lat, h.lng)} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', fontWeight: 600, fontSize: '0.85rem' }}>
                        Get Directions →
                      </a>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>

        {/* Hospital List */}
        <div className="hospitals-list">
          <div className="list-header">
            <h3>
              {loadingHospitals ? 'Searching...' : `${filteredHospitals.length} Found`}
            </h3>
          </div>
          
          {loadingHospitals ? (
            <div className="list-loading">
              <div className="hospitals-spinner small"></div>
              <p>Searching nearby facilities...</p>
            </div>
          ) : filteredHospitals.length === 0 ? (
            <div className="list-empty">
              <span>🔍</span>
              <p>No facilities found. Try increasing the search radius.</p>
            </div>
          ) : (
            <div className="list-items">
              {filteredHospitals.map(h => (
                <div 
                  className={`hospital-card ${selectedHospital === h.id ? 'selected' : ''}`}
                  key={h.id}
                  onClick={() => setSelectedHospital(h.id)}
                >
                  <div className="hospital-card-header">
                    <span className="hospital-type-icon">{getTypeIcon(h.type)}</span>
                    <div className="hospital-card-info">
                      <h4>{h.name}</h4>
                      <span className="hospital-type-badge">{getTypeLabel(h.type)}</span>
                    </div>
                    <span className="hospital-distance">{h.distance.toFixed(1)} km</span>
                  </div>
                  {h.address && <p className="hospital-address">📍 {h.address}</p>}
                  {h.phone && <p className="hospital-phone">📞 {h.phone}</p>}
                  {h.emergency && <span className="emergency-badge">🚑 Emergency</span>}
                  <div className="hospital-card-actions">
                    <a 
                      href={getDirectionsUrl(h.lat, h.lng)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="directions-btn"
                    >
                      🧭 Directions
                    </a>
                    {h.phone && (
                      <a href={`tel:${h.phone}`} className="call-btn">
                        📞 Call
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NearbyHospitals;
