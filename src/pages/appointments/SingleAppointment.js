import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';

const SingleAppointment = () => {
    const { token } = useAuth();
    const { id } = useParams();
    const [appointment, setAppointment] = useState(null);

    useEffect(() => {
        if (!id) return;

        console.log('Fetching appointment with ID:', id);
        console.log('Using token:', token);

        axios.get(`https://fed-medical-clinic-api.vercel.app/appointments/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                console.log('Appointment data:', res.data);
                setAppointment(res.data);
            })
            .catch((err) => {
                console.error('Error fetching appointment:', err);
            });
    }, [id, token]);

    if (!appointment) return 'Loading...';

    return (
        <div>
            <Link to={`/appointments/${id}/edit`}>Edit appointment</Link>
            <h1>Appointment ID: {appointment.id}</h1>
            <h2>Doctor ID: {appointment.doctor_id}</h2>
            <h3>Patient ID: {appointment.patient_id}</h3>
            <p>Appointment Date: {new Date(appointment.appointment_date * 1000).toLocaleDateString()}</p>
        </div>
    );
};

export default SingleAppointment;
