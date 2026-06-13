import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const initialDonor = {
  name: '',
  age: '',
  gender: 'Male',
  mobile: '',
  email: '',
  address: '',
  bloodGroup: 'A+',
  lastDonationDate: '',
  healthStatus: '',
  password: ''
};

const initialAcceptor = {
  name: '',
  mobile: '',
  email: '',
  address: '',
  requiredBloodGroup: 'A+',
  hospitalPreference: '',
  password: ''
};

export default function RegisterPage() {
  const [role, setRole] = useState('donor');
  const [donorForm, setDonorForm] = useState(initialDonor);
  const [acceptorForm, setAcceptorForm] = useState(initialAcceptor);
  const [loading, setLoading] = useState(false);
  const { registerDonor, registerAcceptor } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (role === 'donor') {
        const result = await registerDonor(donorForm);
        toast.success('Donor registered successfully.');
        navigate('/donor');
      } else {
        const result = await registerAcceptor(acceptorForm);
        toast.success('Blood acceptor registered successfully.');
        navigate('/acceptor');
      }
    } catch (error) {
      toast.error(error.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-xl-10">
          <div className="card section-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Register</h2>
              <div>
                <button className={`btn btn-sm me-2 ${role === 'donor' ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => setRole('donor')}>
                  Donor
                </button>
                <button className={`btn btn-sm ${role === 'acceptor' ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => setRole('acceptor')}>
                  Acceptor
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              {role === 'donor' ? (
                <>
                  <div className="row gy-3">
                    <div className="col-md-6">
                      <label className="form-label">Full Name</label>
                      <input type="text" className="form-control" value={donorForm.name} onChange={(e) => setDonorForm({ ...donorForm, name: e.target.value })} required />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Age</label>
                      <input type="number" className="form-control" value={donorForm.age} onChange={(e) => setDonorForm({ ...donorForm, age: e.target.value })} required min="18" max="65" />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Gender</label>
                      <select className="form-select" value={donorForm.gender} onChange={(e) => setDonorForm({ ...donorForm, gender: e.target.value })}>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Mobile Number</label>
                      <input type="tel" className="form-control" value={donorForm.mobile} onChange={(e) => setDonorForm({ ...donorForm, mobile: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-control" value={donorForm.email} onChange={(e) => setDonorForm({ ...donorForm, email: e.target.value })} required />
                    </div>
                    <div className="col-md-12">
                      <label className="form-label">Address</label>
                      <input type="text" className="form-control" value={donorForm.address} onChange={(e) => setDonorForm({ ...donorForm, address: e.target.value })} required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Blood Group</label>
                      <select className="form-select" value={donorForm.bloodGroup} onChange={(e) => setDonorForm({ ...donorForm, bloodGroup: e.target.value })}>
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
                    <div className="col-md-4">
                      <label className="form-label">Last Donation Date</label>
                      <input type="date" className="form-control" value={donorForm.lastDonationDate} onChange={(e) => setDonorForm({ ...donorForm, lastDonationDate: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Health Status</label>
                      <input type="text" className="form-control" value={donorForm.healthStatus} onChange={(e) => setDonorForm({ ...donorForm, healthStatus: e.target.value })} required />
                    </div>
                    <div className="col-md-12">
                      <label className="form-label">Password</label>
                      <input type="password" className="form-control" value={donorForm.password} onChange={(e) => setDonorForm({ ...donorForm, password: e.target.value })} required minLength="6" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="row gy-3">
                    <div className="col-md-6">
                      <label className="form-label">Full Name</label>
                      <input type="text" className="form-control" value={acceptorForm.name} onChange={(e) => setAcceptorForm({ ...acceptorForm, name: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Mobile Number</label>
                      <input type="tel" className="form-control" value={acceptorForm.mobile} onChange={(e) => setAcceptorForm({ ...acceptorForm, mobile: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-control" value={acceptorForm.email} onChange={(e) => setAcceptorForm({ ...acceptorForm, email: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Hospital Preference</label>
                      <input type="text" className="form-control" value={acceptorForm.hospitalPreference} onChange={(e) => setAcceptorForm({ ...acceptorForm, hospitalPreference: e.target.value })} />
                    </div>
                    <div className="col-md-12">
                      <label className="form-label">Address</label>
                      <input type="text" className="form-control" value={acceptorForm.address} onChange={(e) => setAcceptorForm({ ...acceptorForm, address: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Required Blood Group</label>
                      <select className="form-select" value={acceptorForm.requiredBloodGroup} onChange={(e) => setAcceptorForm({ ...acceptorForm, requiredBloodGroup: e.target.value })}>
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
                    <div className="col-md-6">
                      <label className="form-label">Password</label>
                      <input type="password" className="form-control" value={acceptorForm.password} onChange={(e) => setAcceptorForm({ ...acceptorForm, password: e.target.value })} required minLength="6" />
                    </div>
                  </div>
                </>
              )}

              <button className="btn btn-danger mt-4 w-100" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
