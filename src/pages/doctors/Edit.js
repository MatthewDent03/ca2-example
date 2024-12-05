import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from "../../utils/useAuth";
import { TextInput, Text, Button } from "@mantine/core";

const Edit = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        specialisation: 'General Practitioner'
    });

    useEffect(() => {
        console.log('Fetching doctor with ID:', id);
        axios.get(`https://fed-medical-clinic-api.vercel.app/doctors/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((res) => {
            console.log('Doctor data:', res.data);
            setForm(res.data);
        })
        .catch((err) => {
            console.error('Error fetching doctor:', err);
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
        axios.patch(`https://fed-medical-clinic-api.vercel.app/doctors/${id}`, form, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((res) => {
            console.log('Update response:', res.data);
            navigate(`/doctors/${id}`, { relative: 'path', replace: true });
        })
        .catch((err) => {
            console.error('Error updating doctor:', err);
        });
    };

    const handleDelete = () => {
        if (!token) {
            alert('Unauthorized! Login to delete');
            return;
        }

        console.log('Attempting to delete doctor with ID:', id);

        axios.delete(`https://fed-medical-clinic-api.vercel.app/doctors/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((res) => {
            console.log('Deletion response:', res);
            navigate('/doctors', { replace: true });
        })
        .catch((err) => {
            console.error('Deletion error:', err);
        });
    };

    const specialisations = [
        'Podiatrist',
        'Dermatologist',
        'Pediatrician',
        'Psychiatrist',
        'General Practitioner',
    ];

    return (
        <div>
            <Text size={24} mb={5}>Edit Doctor</Text>
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
                <label>
                    Specialisation
                    <select
                        name="specialisation"
                        value={form.specialisation}
                        onChange={handleChange}
                    >
                        {specialisations.map((specialisation) => (
                            <option key={specialisation} value={specialisation}>
                                {specialisation}
                            </option>
                        ))}
                    </select>
                </label>
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

export default Edit;
