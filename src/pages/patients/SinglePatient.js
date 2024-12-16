import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';
import '../../styles/patients.scss';

const SinglePatient = () => {
    const { token } = useAuth();
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get(`https://fed-medical-clinic-api.vercel.app/patients/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setPatient(res.data))
            .catch((err) => {
                console.error('Error fetching patient:', err);
                setError('Failed to load patient details.');
            });
    }, [id, token]);

    if (error) {
        return <p className="error-text">{error}</p>;
    }

    if (!patient) {
        return <p>Loading patient details...</p>;
    }

    return (
        <div className="patient-detail-container container py-4">
            <div className="card shadow p-4">
                <div className="card-header text-center">
                    <h1 className="text-primary">
                        {patient.first_name} {patient.last_name}
                    </h1>
                </div>
                <div className="card-body">
                    <p>
                        <strong>Email:</strong> {patient.email}
                    </p>
                    <p>
                        <strong>Phone:</strong> {patient.phone}
                    </p>
                    <p>
                        <strong>Address:</strong> {patient.address}
                    </p>
                    <p>
                        <strong>Date of Birth:</strong> {patient.date_of_birth}
                    </p>
                    <div className="action-buttons mt-4">
                        <Link to={`/patients/${id}/edit`} className="btn btn-primary me-2">
                            Edit Patient
                        </Link>
                        <Link to="/patients" className="btn btn-secondary">
                            Back to Patients
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SinglePatient;
