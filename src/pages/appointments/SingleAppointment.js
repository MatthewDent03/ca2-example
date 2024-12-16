import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';
import '../../styles/appointments.scss';

const SingleAppointment = () => {
    const { token } = useAuth();
    const { id } = useParams();
    const [appointment, setAppointment] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        axios.get(`https://fed-medical-clinic-api.vercel.app/appointments/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => setAppointment(res.data))
            .catch((err) => {
                console.error('Error fetching appointment:', err);
                setError('Failed to load appointment details.');
            });
    }, [id, token]);

    if (error) {
        return <p className="error-text">{error}</p>;
    }

    if (!appointment) {
        return <p>Loading appointment details...</p>;
    }

    return (
        <div className="appointment-detail-container container py-4">
            <div className="card shadow p-4">
                <div className="card-header text-center">
                    <h1 className="text-primary">
                        Appointment ID: {appointment.id}
                    </h1>
                </div>
                <div className="card-body">
                    <p>
                        <strong>Doctor ID:</strong> {appointment.doctor_id}
                    </p>
                    <p>
                        <strong>Patient ID:</strong> {appointment.patient_id}
                    </p>
                    <p>
                        <strong>Appointment Date:</strong> {new Date(appointment.appointment_date * 1000).toLocaleDateString()}
                    </p>
                    <div className="action-buttons mt-4">
                        <Link to={`/appointments/${id}/edit`} className="btn btn-primary me-2">
                            Edit Appointment
                        </Link>
                        <Link to="/appointments" className="btn btn-secondary">
                            Back to Appointments
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleAppointment;
