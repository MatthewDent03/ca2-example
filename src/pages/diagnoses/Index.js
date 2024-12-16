import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';
import '../../styles/diagnoses.scss';

const DiagnosesContainer = ({ children }) => (
  <div className="diagnoses-container">
    {children}
  </div>
);

const DiagnosesIndex = () => {
  const [diagnoses, setDiagnoses] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      axios.get('https://fed-medical-clinic-api.vercel.app/diagnoses', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          console.log('Diagnoses data:', response.data);
          setDiagnoses(response.data);
        })
        .catch(err => {
          console.error('Error fetching diagnoses:', err);
        });
    }
  }, [token]);

  const handleDelete = (id) => {
    if (!token) {
      alert('Unauthorized! Login to delete');
      return;
    }

    axios.delete(`https://fed-medical-clinic-api.vercel.app/diagnoses/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        console.log('Deletion response:', res);
        // Updating state to reflect deletion
        setDiagnoses(diagnoses.filter(diagnosis => diagnosis.id !== id));
      }).catch((err) => {
        console.error('Deletion error:', err);
      });
  };

  if (!diagnoses) return <p>Loading...</p>;

  return (
    <DiagnosesContainer>
      <Link className="btn btn-primary mb-3" to="/diagnoses/create">Create</Link>
      {diagnoses.map(({ id, patient_id, condition }) => (
        <div key={id} className="diagnosis-card">
          <Link to={`/diagnoses/${id}`}>
            <h1>Patient ID: {patient_id}</h1>
          </Link>
          <h2>Condition: {condition}</h2>
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
    </DiagnosesContainer>
  );
};

export default DiagnosesIndex;
