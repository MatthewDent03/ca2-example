import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';
import '../../styles/prescriptions.scss'; // Import the custom SCSS file

const SinglePrescription = () => {
    const { token } = useAuth();
    const { id } = useParams();
    const [prescription, setPrescription] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        axios.get(`https://fed-medical-clinic-api.vercel.app/prescriptions/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((res) => {
            console.log('Prescription data:', res.data);
            setPrescription(res.data);
        })
        .catch((err) => {
            console.error('Error fetching prescription:', err);
            setError('Failed to load prescription details.');
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

    if (!prescription) {
        return <p>Loading prescription details...</p>;
    }

    return (
        <div className="prescription-detail-container container py-4">
            <div className="card shadow p-4">
                <div className="card-header text-center">
                    <h1 className="text-primary">
                        Patient: {prescription.patient_id}
                    </h1>
                </div>
                <div className="card-body">
                    <p>
                        <strong>Doctor:</strong> {prescription.doctor_id}
                    </p>
                    <p>
                        <strong>Diagnosis:</strong> {prescription.diagnosis_id}
                    </p>
                    <p>
                        <strong>Medication:</strong> {prescription.medication}
                    </p>
                    <p>
                        <strong>Dosage:</strong> {prescription.dosage}
                    </p>
                    <p>
                        <strong>Start Date:</strong> {formatDate(prescription.start_date)}
                    </p>
                    <p>
                        <strong>End Date:</strong> {formatDate(prescription.end_date)}
                    </p>
                    <div className="action-buttons mt-4">
                        <Link to={`/prescriptions/${id}/edit`} className="btn btn-primary me-2">
                            Edit Prescription
                        </Link>
                        <Link to="/prescriptions" className="btn btn-secondary">
                            Back to Prescriptions
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SinglePrescription;
