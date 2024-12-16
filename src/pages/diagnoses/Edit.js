import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from "../../utils/useAuth";
import { TextInput, Text, Button } from "@mantine/core";

const DiagnosesEdit = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const [form, setForm] = useState({
        patient_id: '',
        condition: '',
        diagnosis_date: '',
    });

    useEffect(() => {
        console.log('Fetching diagnoses with ID:', id);
        axios.get(`https://fed-medical-clinic-api.vercel.app/diagnoses/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((res) => {
            console.log('diagnoses data:', res.data);
            setForm(res.data);
        })
        .catch((err) => {
            console.error('Error fetching diagnoses:', err);
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

        // Convert diagnosis_date to the correct format and patient_id to number if needed
        const updatedForm = {
            ...form,
            diagnosis_date: new Date(form.diagnosis_date).toISOString().split('T')[0], // Assuming the server expects YYYY-MM-DD format
            patient_id: parseInt(form.patient_id, 10)
        };

        console.log('Updated form data:', updatedForm);

        axios.patch(`https://fed-medical-clinic-api.vercel.app/diagnoses/${id}`, updatedForm, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((res) => {
            console.log('Update response:', res.data);
            navigate(`/diagnoses/${id}`, { relative: 'path', replace: true });
        })
        .catch((err) => {
            console.error('Error updating diagnosis:', err);
        });
    };

    const handleDelete = () => {
        if (!token) {
            alert('Unauthorized! Login to delete');
            return;
        }

        console.log('Attempting to delete diagnoses with ID:', id);

        axios.delete(`https://fed-medical-clinic-api.vercel.app/diagnoses/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((res) => {
            console.log('Deletion response:', res);
            navigate('/diagnoses', { replace: true });
        })
        .catch((err) => {
            console.error('Deletion error:', err);
        });
    };

    return (
        <div>
            <Text size={24} mb={5}>Edit Diagnoses</Text>
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
                    label='Condition'
                    name='condition'
                    value={form.condition}
                    onChange={handleChange}
                />
                <TextInput
                    withAsterisk
                    label={'Diagnosis Date'}
                    name='diagnosis_date'
                    value={form.diagnosis_date}
                    onChange={handleChange}
                />
                <Button mt={10} type={'submit'}>Submit</Button>
            </form>
            <Button mt={10} color="red" onClick={() => {
                const confirmDelete = window.confirm('Are you sure you want to delete this diagnoses?');
                if (confirmDelete) {
                    handleDelete();
                }
            }}>
                Delete
            </Button>
        </div>
    );
};

export default DiagnosesEdit;
