import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from "../../utils/useAuth";
import { TextInput, Text, Button } from "@mantine/core";

const PrescriptionEdit = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const [form, setForm] = useState({
        patient_id: '',
        doctor_id: '',
        diagnosis_id: '',
        medication: '',
        dosage: '',
        start_date: '',
        end_date: ''
    });

    useEffect(() => {
        console.log('Fetching prescription with ID:', id);
        axios.get(`https://fed-medical-clinic-api.vercel.app/prescriptions/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((res) => {
            console.log('Prescription data:', res.data);
            setForm(res.data);
        })
        .catch((err) => {
            console.error('Error fetching prescription:', err);
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

        // Convert dates to the correct format and ensure IDs are numbers
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        };

        const updatedForm = {
            ...form,
            start_date: formatDate(form.start_date),
            end_date: formatDate(form.end_date),
            patient_id: parseInt(form.patient_id, 10),
            doctor_id: parseInt(form.doctor_id, 10),
            diagnosis_id: parseInt(form.diagnosis_id, 10)
        };

        console.log('Updated form data:', updatedForm);

        axios.patch(`https://fed-medical-clinic-api.vercel.app/prescriptions/${id}`, updatedForm, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((res) => {
            console.log('Update response:', res.data);
            navigate(`/prescriptions/${id}`, { relative: 'path', replace: true });
        })
        .catch((err) => {
            console.error('Error updating prescriptions:', err);
        });
    };

    const handleDelete = () => {
        if (!token) {
            alert('Unauthorized! Login to delete');
            return;
        }

        console.log('Attempting to delete prescription with ID:', id);

        axios.delete(`https://fed-medical-clinic-api.vercel.app/prescriptions/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((res) => {
            console.log('Deletion response:', res);
            navigate('/prescriptions', { replace: true });
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
                    label={'Patient ID'}
                    name='patient_id'
                    value={form.patient_id}
                    onChange={handleChange}
                />
                <TextInput
                    withAsterisk
                    label={'Doctor ID'}
                    name='doctor_id'
                    value={form.doctor_id}
                    onChange={handleChange}
                />
                <TextInput
                    withAsterisk
                    label={'Diagnosis ID'}
                    name='diagnosis_id'
                    value={form.diagnosis_id}
                    onChange={handleChange}
                />
                <TextInput
                    withAsterisk
                    label={'Medication'}
                    name='medication'
                    value={form.medication}
                    onChange={handleChange}
                />
                <TextInput
                    withAsterisk
                    label={'Dosage'}
                    name='dosage'
                    value={form.dosage}
                    onChange={handleChange}
                />
                <TextInput
                    withAsterisk
                    label={'Start Date'}
                    name='start_date'
                    value={form.start_date}
                    onChange={handleChange}
                />
                <TextInput
                    withAsterisk
                    label={'End Date'}
                    name='end_date'
                    value={form.end_date}
                    onChange={handleChange}
                />
                <Button mt={10} type={'submit'}>Submit</Button>
            </form>
            <Button mt={10} color="red" onClick={() => {
                const confirmDelete = window.confirm('Are you sure you want to delete this prescription?');
                if (confirmDelete) {
                    handleDelete();
                }
            }}>
                Delete
            </Button>
        </div>
    );
};

export default PrescriptionEdit;
