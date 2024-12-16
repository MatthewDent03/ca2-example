import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';

const AppointmentsContainer = ({ children }) => (
    <div style={{ margin: 'auto', width: '1200px' }}>
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
                .then(response => {
                    console.log('Appointments data:', response.data);
                    setAppointments(response.data);
                })
                .catch(err => {
                    console.error('Error fetching appointments:', err);
                });
        }
    }, [token]);

    const handleDelete = (id) => {
        if (!token) {
            alert('Unauthorized! Login to delete');
            return;
        }

        console.log('Attempting to delete appointment with ID:', id);

        axios.delete(`https://fed-medical-clinic-api.vercel.app/appointments/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                console.log('Deletion response:', res);
                // Updating state to reflect deletion
                setAppointments(appointments.filter((appointment) => appointment.id !== id));
            }).catch((err) => {
                console.error('Deletion error:', err);
            });
    };

    if (!appointments) return 'Loading...';

    return (
        <AppointmentsContainer>
            <Link to='/appointments/create'>Create</Link>
            {appointments.map(({ id, doctor_id, patient_id }) => (
                <div key={id}>
                    <Link to={`/appointments/${id}`}>
                        <h1>Appointment ID: {id}</h1>
                    </Link>
                    <h2>Doctor ID: {doctor_id}</h2>
                    <h3>Patient ID: {patient_id}</h3>
                    <button onClick={() => {
                        const confirmDelete = window.confirm('Are you sure?');
                        if (confirmDelete) {
                            handleDelete(id);
                        }
                    }}>
                        Delete 🗑️
                    </button>
                </div>
            ))}
        </AppointmentsContainer>
    );
};

export default AppointmentIndex;
