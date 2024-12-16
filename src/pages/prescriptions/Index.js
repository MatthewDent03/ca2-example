import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';
import '../../styles/prescriptions.scss';

const PrescriptionsContainer = ({ children }) => (
  <div className="prescriptions-container">
    {children}
  </div>
);

const PrescriptionIndex = () => {
  const [prescriptions, setPrescriptions] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      axios.get('https://fed-medical-clinic-api.vercel.app/prescriptions', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          console.log('Prescriptions data:', response.data);
          setPrescriptions(response.data);
        })
        .catch(err => {
          console.error('Error fetching prescriptions:', err);
        });
    }
  }, [token]);

  const handleDelete = (id) => {
    if (!token) {
      alert('Unauthorized! Login to delete');
      return;
    }

    axios.delete(`https://fed-medical-clinic-api.vercel.app/prescriptions/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        console.log('Deletion response:', res);
        // Updating state to reflect deletion
        setPrescriptions(prescriptions.filter(prescription => prescription.id !== id));
      }).catch((err) => {
        console.error('Deletion error:', err);
      });
  };

  if (!prescriptions) return <p>Loading...</p>;

  return (
    <PrescriptionsContainer>
      <Link className="btn btn-primary mb-3" to="/prescriptions/create">Create</Link>
      {prescriptions.map(({ id, patient_id, doctor_id, diagnosis_id }) => (
        <div key={id} className="prescription-card">
          <Link to={`/prescriptions/${id}`}>
            <h1>Patient: {patient_id}</h1>
          </Link>
          <h2>Doctor: {doctor_id}</h2>
          <h2>Diagnosis: {diagnosis_id}</h2>
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
    </PrescriptionsContainer>
  );
};

export default PrescriptionIndex;
