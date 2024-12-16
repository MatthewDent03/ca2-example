import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';

const SingleDiagnoses = () => {
    const { token } = useAuth();
    const { id } = useParams();
    const [diagnoses, setDiagnoses] = useState(null);

    useEffect(() => {
        if (!id) return;

        console.log('Fetching diagnoses with ID:', id);
        console.log('Using token:', token); 

        axios.get(`https://fed-medical-clinic-api.vercel.app/diagnoses/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((res) => {
            console.log('Diagnoses data:', res.data);
            setDiagnoses(res.data);
        })
        .catch((err) => {
            console.error('Error fetching diagnoses:', err);
        });
    }, [id, token]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    if (!diagnoses) return 'Loading...';

    return (
        <div>
            <Link to={`/diagnoses/${id}/edit`}>Edit diagnoses</Link>
            <h1>Patient ID: {diagnoses.patient_id}</h1>
            <h2>Condition: {diagnoses.condition}</h2>
            <p>Diagnosis Date: {formatDate(diagnoses.diagnosis_date)}</p>
        </div>
    );
};

export default SingleDiagnoses;
