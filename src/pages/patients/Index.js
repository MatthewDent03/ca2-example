import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';
import '../../styles/patients.scss';

const PatientsContainer = ({ children }) => (
  <div className="patients-container">
    {children}
  </div>
);

const PatientIndex = () => {
  const [patients, setPatients] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    axios.get('https://fed-medical-clinic-api.vercel.app/patients')
      .then(response => setPatients(response.data))
      .catch(err => console.error('Error fetching patients:', err));
  }, []);

  const handleDelete = (id) => {
    if (!token) {
      alert('Unauthorized! Login to delete');
      return;
    }

    axios.delete(`https://fed-medical-clinic-api.vercel.app/patients/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => setPatients(patients.filter(patient => patient.id !== id)));
  };

  if (!patients) return <p>Loading...</p>;

  return (
    <PatientsContainer>
      <Link className="btn btn-primary mb-3" to="/patients/create">Create</Link>
      {patients.map(({ id, first_name, last_name, email, phone }) => (
        <div key={id} className="patient-card">
          <Link to={`/patients/${id}`}>
            <h1>{first_name} {last_name}</h1>
          </Link>
          <p>{email} / {phone}</p>
          <button
            className="btn btn-delete"
            onClick={() => {
              if (window.confirm('Are you sure?')) handleDelete(id);
            }}
          >
            Delete 🗑️
          </button>
        </div>
      ))}
    </PatientsContainer>
  );
};

export default PatientIndex;
