import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';
import '../../styles/doctors.scss';

const SingleDoctor = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`https://fed-medical-clinic-api.vercel.app/doctors/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDoctor(res.data))
      .catch((err) => {
        console.error('Error fetching doctor:', err);
        setError('Failed to load doctor details.');
      });
  }, [id, token]);

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  if (!doctor) {
    return <p>Loading doctor details...</p>;
  }

  return (
    <div className="doctor-detail-container container py-4">
      <div className="card shadow p-4">
        <div className="card-header text-center">
          <h1 className="text-primary">
            {doctor.first_name} {doctor.last_name}
          </h1>
          <h2 className="text-secondary">{doctor.specialisation}</h2>
        </div>
        <div className="card-body">
          <p>
            <strong>Email:</strong> {doctor.email}
          </p>
          <p>
            <strong>Phone:</strong> {doctor.phone}
          </p>
          <div className="action-buttons mt-4">
            <Link to={`/doctors/${id}/edit`} className="btn btn-primary me-2">
              Edit Doctor
            </Link>
            <Link to="/doctors" className="btn btn-secondary">
              Back to Doctors
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleDoctor;
