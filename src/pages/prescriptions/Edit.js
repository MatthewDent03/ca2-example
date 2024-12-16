import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from "../../utils/useAuth";
import { TextInput, Text, Button } from "@mantine/core";
import '../../styles/prescriptions.scss'; // Import your custom SCSS file

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
            console.error('Error updating prescription:', err);
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
        <div className="edit-prescription-container container py-4">
            <Text size={24} mb={5} className="text-primary">Edit Prescription</Text>
            <form className="prescription-form" onSubmit={handleSubmit}>
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
                    <label>Diagnosis ID</label>
                    <TextInput
                        withAsterisk
                        name="diagnosis_id"
                        value={form.diagnosis_id}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group mb-3">
                    <label>Medication</label>
                    <TextInput
                        withAsterisk
                        name="medication"
                        value={form.medication}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group mb-3">
                    <label>Dosage</label>
                    <TextInput
                        withAsterisk
                        name="dosage"
                        value={form.dosage}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group mb-3">
                    <label>Start Date</label>
                    <TextInput
                        withAsterisk
                        name="start_date"
                        value={form.start_date}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group mb-3">
                    <label>End Date</label>
                    <TextInput
                        withAsterisk
                        name="end_date"
                        value={form.end_date}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <Button className="btn btn-primary me-2" type="submit">Submit</Button>
                <Button className="btn btn-danger" onClick={() => {
                    const confirmDelete = window.confirm('Are you sure you want to delete this prescription?');
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

export default PrescriptionEdit;
