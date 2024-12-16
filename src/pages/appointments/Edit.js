import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from "../../utils/useAuth";
import { TextInput, Text, Button } from "@mantine/core";

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
    
        console.log('Updated form data:', updatedForm);
        console.log(`PATCH request to URL: https://fed-medical-clinic-api.vercel.app/appointment/${id}`);
        console.log('Using token:', token);
    
        axios.patch(`https://fed-medical-clinic-api.vercel.app/appointment/${id}`, updatedForm, {
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

        axios.delete(`https://fed-medical-clinic-api.vercel.app/appointment/${id}`, {
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
        <div>
            <Text size={24} mb={5}>Edit Doctor</Text>
            <form onSubmit={handleSubmit}>
                <TextInput
                    withAsterisk
                    label={'Appointment Date: '}
                    name='appointment_date'
                    value={form.appointment_date}
                    onChange={handleChange}
                />
                <TextInput
                    withAsterisk
                    label='doctor ID'
                    name='doctor_id'
                    value={form.doctor_id}
                    onChange={handleChange}
                />
                <TextInput
                    withAsterisk
                    label={'patient ID'}
                    name='patient_id'
                    value={form.patient_id}
                    onChange={handleChange}
                />

                <Button mt={10} type={'submit'}>Submit</Button>
            </form>
            <Button mt={10} color="red" onClick={() => {
                const confirmDelete = window.confirm('Are you sure you want to delete this doctor?');
                if (confirmDelete) {
                    handleDelete();
                }
            }}>
                Delete
            </Button>
        </div>
    );
};

export default AppointmentEdit;
