import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';

const SinglePrescription = () => {
    const { token } = useAuth();
    const { id } = useParams();
    const [prescription, setPrescription] = useState(null);

    useEffect(() => {
        if (!id) return;

        console.log('Fetching prescription with ID:', id);
        console.log('Using token:', token); 

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
        });
    }, [id, token]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    if (!prescription) return 'Loading...';

    return (
        <div>
            <Link to={`/prescriptions/${id}/edit`}>Edit prescription</Link>
            <h1>Patient: {prescription.patient_id}</h1>
            <h2>Doctor: {prescription.doctor_id}</h2>
            <h2>Diagnosis: {prescription.diagnosis_id}</h2>
            <p>Medication: {prescription.medication} - Dosage: {prescription.dosage}</p>
            <p>Start Date: {formatDate(prescription.start_date)} - End Date: {formatDate(prescription.end_date)}</p>
        </div>
    );
};

export default SinglePrescription;
