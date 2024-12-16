import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from "../../utils/useAuth";
import { TextInput, Text, Button } from "@mantine/core";

const PatientEdit = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: "",
        date_of_birth: "",
    });

    useEffect(() => {
        console.log('Fetching patient with ID:', id);
        axios.get(`https://fed-medical-clinic-api.vercel.app/patients/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                console.log('patients data:', res.data);
                setForm(res.data);
            })
            .catch((err) => {
                console.error('Error fetching patient:', err);
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

        // Convert date_of_birth from Unix timestamp to YYYY-MM-DD format
        const date = new Date(form.date_of_birth * 1000); // Convert from seconds to milliseconds
        const formattedDate = date.toISOString().split('T')[0]; // Get the date part only

        const updatedForm = {
            ...form,
            date_of_birth: formattedDate
        };

        axios.patch(`https://fed-medical-clinic-api.vercel.app/patients/${id}`, updatedForm, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                console.log('Update response:', res.data);
                navigate(`/patients/${id}`, { relative: 'path', replace: true });
            })
            .catch((err) => {
                console.error('Error updating patient:', err);
            });
    };

    const handleDelete = () => {
        if (!token) {
            alert('Unauthorized! Login to delete');
            return;
        }

        console.log('Attempting to delete patient with ID:', id);

        axios.delete(`https://fed-medical-clinic-api.vercel.app/patients/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                console.log('Deletion response:', res);
                navigate('/patients', { replace: true });
            })
            .catch((err) => {
                console.error('Deletion error:', err);
            });
    };

    return (
        <div>
            <Text size={24} mb={5}>Edit Patient</Text>
            <form onSubmit={handleSubmit}>
                <TextInput
                    withAsterisk
                    label={'First name'}
                    name='first_name'
                    value={form.first_name}
                    onChange={handleChange}
                />
                <TextInput
                    withAsterisk
                    label='Last name'
                    name='last_name'
                    value={form.last_name}
                    onChange={handleChange}
                />
                <TextInput
                    withAsterisk
                    label={'Email'}
                    name='email'
                    value={form.email}
                    onChange={handleChange}
                />
                <TextInput
                    withAsterisk
                    label={'Phone'}
                    name='phone'
                    value={form.phone}
                    onChange={handleChange}
                />
                <TextInput
                    withAsterisk
                    label='Address'
                    name='address'
                    value={form.address}
                    onChange={handleChange}
                />
                <TextInput
                    withAsterisk
                    label='Date of Birth'
                    name='date_of_birth'
                    value={form.date_of_birth}
                    onChange={handleChange}
                />
                <Button mt={10} type={'submit'}>Submit</Button>
            </form>
            <Button mt={10} color="red" onClick={() => {
                const confirmDelete = window.confirm('Are you sure you want to delete this patient?');
                if (confirmDelete) {
                    handleDelete();
                }
            }}>
                Delete
            </Button>
        </div>
    );
};

export default PatientEdit;
