import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import hospitalService from '../services/hospitalService';
import bloodService from '../services/bloodService';
import LoadingSpinner from '../components/LoadingSpinner';
import { MapContainer, Marker, Popup, TileLayer, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function AcceptorDashboard() {
  const { user } = useContext(AuthContext);
  const [coords, setCoords] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [inventory, setInventory] = useState({});
  const [loading, setLoading] = useState(true);
  const [bloodGroup, setBloodGroup] = useState('');
  const [hospitalFilter, setHospitalFilter] = useState('');

  const fetchNearby = async (latitude, longitude) => {
    try {
      const response = await hospitalService.fetchNearby({ latitude, longitude });
      setHospitals(response.hospitals || []);
    } catch (error) {
      setHospitals([]);
    }
  };

  const fetchInventory = async () => {
    try {
      const response = await bloodService.search({ bloodGroup, hospital: hospitalFilter });
      setInventory(response.inventory || {});
    } catch (error) {
      setInventory({});
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        fetchNearby(position.coords.latitude, position.coords.longitude);
      },
      () => {
        setCoords(null);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
    fetchInventory().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [bloodGroup, hospitalFilter]);

  return (
    <div className="container py-5">
      <div className="row gy-4">
        <div className="col-12">
          <div className="card section-card p-4">
            <h2>Welcome, {user?.name}</h2>
            <p className="mb-0">Role: <strong>Blood Acceptor</strong></p>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card section-card p-4 mb-4">
            <h5>Request Info</h5>
            <p><strong>Required Blood Group:</strong> {user?.requiredBloodGroup || 'Any'}</p>
            <p><strong>Hospital Preference:</strong> {user?.hospitalPreference || 'Any'}</p>
          </div>

          <div className="card section-card p-4">
            <h5>Filters</h5>
            <div className="mb-3">
              <label className="form-label">Blood Group</label>
              <select className="form-select" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
                <option value="">All groups</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>O+</option>
                <option>O-</option>
                <option>AB+</option>
                <option>AB-</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Hospital Search</label>
              <input className="form-control" value={hospitalFilter} onChange={(e) => setHospitalFilter(e.target.value)} placeholder="Search hospital" />
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card section-card p-4 mb-4">
            <h4>Nearby Hospitals</h4>
            {coords ? (
              <p>Your current location: {coords.latitude.toFixed(4)}, {coords.longitude.toFixed(4)}</p>
            ) : (
              <div className="alert alert-warning">Location permission is needed to show nearby hospitals.</div>
            )}
            {coords && (
              <MapContainer center={[coords.latitude, coords.longitude]} zoom={13} scrollWheelZoom={false} className="mt-3">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <CircleMarker center={[coords.latitude, coords.longitude]} radius={10} pathOptions={{ color: '#dc3545' }}>
                  <Popup>Your Location</Popup>
                </CircleMarker>
                {hospitals.map((hospital) => (
                  <Marker key={`${hospital.name}-${hospital.latitude}`} position={[hospital.latitude, hospital.longitude]}>
                    <Popup>
                      <strong>{hospital.name}</strong><br />{hospital.address}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </div>

          <div className="card section-card p-4">
            <h4>Blood Inventory</h4>
            {loading && <LoadingSpinner />}
            {!loading && Object.keys(inventory).length === 0 && (
              <div className="alert alert-info">No inventory matches your search.</div>
            )}
            {!loading && Object.entries(inventory).map(([hospitalName, items]) => (
              <div key={hospitalName} className="card section-card p-3 mb-3">
                <h5>{hospitalName}</h5>
                {items.map((item) => (
                  <div key={`${hospitalName}-${item.bloodGroup}`} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                    <div>
                      <strong>{item.bloodGroup}</strong> - {item.availableUnits} units
                    </div>
                    <span className={`badge ${parseInt(item.availableUnits, 10) > 0 ? 'bg-success' : 'bg-secondary'}`}>
                      {parseInt(item.availableUnits, 10) > 0 ? 'Available' : 'Not Available'}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
