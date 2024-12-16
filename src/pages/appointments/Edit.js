import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from "../../utils/useAuth";
import { TextInput, Text, Button } from "@mantine/core";
import '../../styles/appointments.scss'; // Import the custom SCSS file

const AppointmentEdit = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const [form, setForm] = useState({
        appointment_date: '',
        doctor_id: '',
        patient_id: ''
    });

    useEffect(() => {
        console.log('Fetching appointment with ID:', id);
        axios.get(`https://fed-medical-clinic-api.vercel.app/appointments/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((res) => {
            console.log('Appointment data:', res.data);
            setForm(res.data);
        })
        .catch((err) => {
            console.error('Error fetching appointment:', err);
        });
    }, [id, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting form with ID:', id);
        console.log('Form data:', form);

        // Format appointment_date to DD-MM-YYYY before sending
        const date = new Date(form.appointment_date);
        const formattedDate = `${("0" + date.getDate()).slice(-2)}-${("0" + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()}`;

        const updatedForm = {
            ...form,
            appointment_date: formattedDate
        };

        axios.patch(`https://fed-medical-clinic-api.vercel.app/appointments/${id}`, updatedForm, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((res) => {
            console.log('Update response:', res.data);
            navigate(`/appointments/${id}`, { relative: 'path', replace: true });
        })
        .catch((err) => {
            console.error('Error updating appointment:', err);
        });
    };

    const handleDelete = () => {
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
            navigate('/appointments', { replace: true });
        })
        .catch((err) => {
            console.error('Deletion error:', err);
        });
    };

    return (
        <div className="edit-appointment-container container py-4">
            <Text size={24} mb={5} className="text-primary">Edit Appointment</Text>
            <form className="appointment-form" onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                    <label>Appointment Date</label>
                    <TextInput
                        withAsterisk
                        name="appointment_date"
                        value={form.appointment_date}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group mb-3">
                    <label>Doctor ID</label>
                    <TextInput
                        withAsterisk
                        name="doctor_id"
                        value={form.doctor_id}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group mb-3">
                    <label>Patient ID</label>
                    <TextInput
                        withAsterisk
                        name="patient_id"
                        value={form.patient_id}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <Button className="btn btn-primary me-2" type="submit">Submit</Button>
                <Button className="btn btn-danger" onClick={() => {
                    const confirmDelete = window.confirm('Are you sure you want to delete this appointment?');
                    if (confirmDelete) {
                        handleDelete();
                    }
                }}>
                    Delete
                </Button>
            </form>
        </div>
    );
};

export default AppointmentEdit;
