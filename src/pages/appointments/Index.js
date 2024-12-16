import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';
import '../../styles/appointments.scss';

const AppointmentsContainer = ({ children }) => (
    <div className="appointments-container">
        {children}
    </div>
);

const AppointmentIndex = () => {
    const [appointments, setAppointments] = useState(null);
    const { token } = useAuth();

    useEffect(() => {
        if (token) {
            axios.get('https://fed-medical-clinic-api.vercel.app/appointments', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => setAppointments(response.data))
            .catch(err => console.error('Error fetching appointments:', err));
        }
    }, [token]);

    const handleDelete = (id) => {
        if (!token) {
            alert('Unauthorized! Login to delete');
            return;
        }

        console.log('Attempting to delete appointment with ID:', id);

        axios.delete(`https://fed-medical-clinic-api.vercel.app/appointments/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => setAppointments(appointments.filter(appointment => appointment.id !== id)))
        .catch(err => console.error('Deletion error:', err));
    };

    if (!appointments) return <p>Loading...</p>;

    return (
        <AppointmentsContainer>
            <Link className="btn btn-primary mb-3" to="/appointments/create">Create</Link>
            {appointments.map(({ id, doctor_id, patient_id, appointment_date }) => (
                <div key={id} className="appointment-card">
                    <Link to={`/appointments/${id}`}>
                        <h1>Appointment ID: {id}</h1>
                    </Link>
                    <h2>Doctor ID: {doctor_id}</h2>
                    <h3>Patient ID: {patient_id}</h3>
                    <h4>Appointment Date: {appointment_date}</h4>
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
        </AppointmentsContainer>
    );
};

export default AppointmentIndex;
