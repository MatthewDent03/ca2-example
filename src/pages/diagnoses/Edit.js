import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from "../../utils/useAuth";
import { TextInput, Text, Button } from "@mantine/core";
import '../../styles/diagnoses.scss'; // Import your custom SCSS file

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
        axios.get(`https://fed-medical-clinic-api.vercel.app/diagnoses/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((res) => {
            console.log('Diagnosis data:', res.data);
            setForm(res.data);
        })
        .catch((err) => {
            console.error('Error fetching diagnosis:', err);
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

        const updatedForm = {
            ...form,
            diagnosis_date: new Date(form.diagnosis_date).toISOString().split('T')[0], // Assuming the server expects YYYY-MM-DD format
            patient_id: parseInt(form.patient_id, 10)
        };

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
        <div className="edit-diagnosis-container container py-4">
            <Text size={24} mb={5} className="text-primary">Edit Diagnosis</Text>
            <form className="diagnosis-form" onSubmit={handleSubmit}>
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
                <div className="form-group mb-3">
                    <label>Condition</label>
                    <TextInput
                        withAsterisk
                        name="condition"
                        value={form.condition}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group mb-3">
                    <label>Diagnosis Date</label>
                    <TextInput
                        withAsterisk
                        name="diagnosis_date"
                        value={form.diagnosis_date}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <Button className="btn btn-primary me-2" type="submit">Submit</Button>
                <Button className="btn btn-danger" onClick={() => {
                    const confirmDelete = window.confirm('Are you sure you want to delete this diagnosis?');
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

export default DiagnosesEdit;
