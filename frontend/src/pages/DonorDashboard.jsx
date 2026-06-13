import { useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import hospitalService from '../services/hospitalService';
import appointmentService from '../services/appointmentService';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import { MapContainer, Marker, Popup, TileLayer, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function DonorDashboard() {
  const { user, token } = useContext(AuthContext);
  const [guidelinesAccepted, setGuidelinesAccepted] = useState(false);
  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('10:00');
  const [appointments, setAppointments] = useState([]);

  const canBook = guidelinesAccepted && location && hospitals.length > 0;

  useEffect(() => {
    if (guidelinesAccepted) {
      requestLocation();
    }
  }, [guidelinesAccepted]);

  useEffect(() => {
    if (user && token) {
      appointmentService.getUserAppointments(token).then((res) => setAppointments(res.appointments)).catch(() => {});
    }
  }, [user, token]);

  const requestLocation = () => {
    setLoadingHospitals(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          radius: 5000
        };
        setLocation(coords);
        try {
          const data = await hospitalService.fetchNearby(coords);
          setHospitals(data.hospitals || []);
        } catch (error) {
          toast.error('Unable to fetch nearby hospitals. Showing fallback data.');
        } finally {
          setLoadingHospitals(false);
        }
      },
      (error) => {
        toast.error('Location permission required to show nearby hospitals.');
        setLoadingHospitals(false);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  const hospitalOptions = useMemo(() => hospitals.map((hospital) => hospital.name), [hospitals]);

  const handleBook = async (event) => {
    event.preventDefault();
    if (!selectedHospital) {
      toast.warning('Please choose a hospital.');
      return;
    }
    try {
      await appointmentService.book({ hospitalName: selectedHospital, date: appointmentDate, time: appointmentTime }, token);
      toast.success('Appointment booked successfully.');
      const res = await appointmentService.getUserAppointments(token);
      setAppointments(res.appointments);
    } catch (error) {
      toast.error(error.message || 'Booking failed.');
    }
  };

  return (
    <div className="container py-5">
      <div className="row gy-4">
        <div className="col-12">
          <div className="card section-card p-4">
            <h2>Welcome, {user?.name}</h2>
            <p className="mb-0">Role: <strong>Blood Donor</strong></p>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card section-card p-4 mb-4">
            <h4>Profile</h4>
            <p><strong>Blood Group:</strong> {user?.bloodGroup || 'N/A'}</p>
            <p><strong>Last Donation:</strong> {user?.lastDonationDate || 'Not recorded'}</p>
            <p><strong>Health status:</strong> {user?.healthStatus}</p>
          </div>

          <div className="card section-card p-4">
            <h4>Donation Guidelines</h4>
            <ul>
              <li>Age must be 18–65 years.</li>
              <li>Weight should be above 50 kg.</li>
              <li>No alcohol for 24 hours.</li>
              <li>No fever or infection.</li>
              <li>Must feel healthy.</li>
              <li>Minimum 3 months gap between donations.</li>
            </ul>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="acceptGuidelines" checked={guidelinesAccepted} onChange={(e) => setGuidelinesAccepted(e.target.checked)} />
              <label className="form-check-label" htmlFor="acceptGuidelines">I Accept All Guidelines</label>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card section-card p-4">
            <h4>Nearby Hospitals</h4>
            {loadingHospitals && <LoadingSpinner message="Fetching nearby hospitals..." />}
            {!loadingHospitals && !guidelinesAccepted && (
              <div className="alert alert-warning">Accept the guidelines to see nearby hospitals and booking options.</div>
            )}
            {!loadingHospitals && guidelinesAccepted && hospitals.length === 0 && (
              <div className="alert alert-info">No hospitals found yet. Make sure location permission is allowed.</div>
            )}
            {location && hospitals.length > 0 && (
              <div>
                <div className="row gy-3">
                  {hospitals.map((hospital) => (
                    <div key={`${hospital.name}-${hospital.latitude}`} className="col-md-6">
                      <div className="card section-card p-3 h-100">
                        <h5>{hospital.name}</h5>
                        <p className="mb-1">{hospital.address}</p>
                        <p className="mb-1"><strong>Distance:</strong> {hospital.distance} km</p>
                        <p className="mb-3"><strong>Available slots:</strong> {hospital.availableSlots}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <MapContainer center={[location.latitude, location.longitude]} zoom={13} scrollWheelZoom={false} className="mt-4">
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <CircleMarker center={[location.latitude, location.longitude]} radius={10} pathOptions={{ color: '#dc3545' }}>
                    <Popup>Your Location</Popup>
                  </CircleMarker>
                  {hospitals.map((hospital) => (
                    <Marker key={`${hospital.name}-${hospital.latitude}`} position={[hospital.latitude, hospital.longitude]}>
                      <Popup>
                        <strong>{hospital.name}</strong><br />{hospital.address}<br />Slots: {hospital.availableSlots}
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
                <div className="card section-card p-4 mt-4">
                  <h5>Book Appointment</h5>
                  <form onSubmit={handleBook}>
                    <div className="row gy-3">
                      <div className="col-md-6">
                        <label className="form-label">Hospital</label>
                        <select className="form-select" value={selectedHospital} onChange={(e) => setSelectedHospital(e.target.value)} required>
                          <option value="">Choose a hospital</option>
                          {hospitalOptions.map((name) => (
                            <option key={name} value={name}>{name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Date</label>
                        <input className="form-control" type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} required />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Time Slot</label>
                        <input className="form-control" type="time" value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} required />
                      </div>
                    </div>
                    <button className="btn btn-danger mt-3" disabled={!canBook}>Book Appointment</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="col-12">
          <div className="card section-card p-4">
            <h4>Appointment History</h4>
            {appointments.length === 0 && <p>No appointments booked yet.</p>}
            {appointments.length > 0 && (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Hospital</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((item) => (
                      <tr key={item.appointmentId}>
                        <td>{item.hospitalName}</td>
                        <td>{item.date}</td>
                        <td>{item.time}</td>
                        <td>{item.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
