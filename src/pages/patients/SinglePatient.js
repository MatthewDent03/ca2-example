import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';

const SinglePatient = () => {
    const { token } = useAuth();
    const { id } = useParams();
    const [patient, setPatient] = useState(null);

    useEffect(() => {
        if (!id) return;

        console.log('Fetching patient with ID:', id);
        console.log('Using token:', token); 

        axios.get(`https://fed-medical-clinic-api.vercel.app/patients/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((res) => {
            console.log('Patient data:', res.data);
            setPatient(res.data);
        })
        .catch((err) => {
            console.error('Error fetching patient:', err);
        });
    }, [id, token]);

    if (!patient) return 'Loading...';

    return (
        <div>
            <Link to={`/patients/${id}/edit`}>Edit patient</Link>
            <h1>{patient.first_name} {patient.last_name}</h1>
            <h2>Email/Number: {patient.email} / {patient.phone}</h2>
            <h2>address: {patient.address}</h2>
            <h2>DoB: {patient.date_of_birth}</h2>
        </div>
    );
};

export default SinglePatient;
