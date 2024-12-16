import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';
import '../../styles/diagnoses.scss';

const SingleDiagnoses = () => {
    const { token } = useAuth();
    const { id } = useParams();
    const [diagnosis, setDiagnosis] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        axios.get(`https://fed-medical-clinic-api.vercel.app/diagnoses/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((res) => setDiagnosis(res.data))
        .catch((err) => {
            console.error('Error fetching diagnosis:', err);
            setError('Failed to load diagnosis details.');
        });
    }, [id, token]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    if (error) {
        return <p className="error-text">{error}</p>;
    }

    if (!diagnosis) {
        return <p>Loading diagnosis details...</p>;
    }

    return (
        <div className="diagnosis-detail-container container py-4">
            <div className="card shadow p-4">
                <div className="card-header text-center">
                    <h1 className="text-primary">
                        Patient ID: {diagnosis.patient_id}
                    </h1>
                    <h2 className="text-secondary">
                        Condition: {diagnosis.condition}
                    </h2>
                </div>
                <div className="card-body">
                    <p>
                        <strong>Diagnosis Date:</strong> {formatDate(diagnosis.diagnosis_date)}
                    </p>
                    <div className="action-buttons mt-4">
                        <Link to={`/diagnoses/${id}/edit`} className="btn btn-primary me-2">
                            Edit Diagnosis
                        </Link>
                        <Link to="/diagnoses" className="btn btn-secondary">
                            Back to Diagnoses
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleDiagnoses