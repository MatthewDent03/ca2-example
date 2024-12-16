import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../utils/useAuth";
import { useForm } from '@mantine/form';
import { TextInput, Text, Button } from "@mantine/core";
import '../../styles/appointments.scss'; // Make sure this SCSS file exists

const AppointmentCreate = () => {
    const { token } = useAuth();
    const navigate = useNavigate();

    const form = useForm({
        initialValues: {
            appointment_date: '',
            doctor_id: '',
            patient_id: '',
        },
        validate: {
            appointment_date: (value) => {
                const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{4})$/;
                return dateRegex.test(value) ? null : 'Date must be in dd-mm-yyyy format';
            },
            doctor_id: (value) => value.trim().length > 0 ? null : 'Doctor ID is required',
            patient_id: (value) => value.trim().length > 0 ? null : 'Patient ID is required',
        },
    });

    const handleSubmit = () => {
        const updatedForm = {
            ...form.values,
            doctor_id: parseInt(form.values.doctor_id, 10),
            patient_id: parseInt(form.values.patient_id, 10)
        };

        axios.post('https://fed-medical-clinic-api.vercel.app/appointments', updatedForm, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => navigate(`../appointments`))
        .catch((err) => {
            console.error(err);

            if (err.response.status === 422) {
                let errors = err.response.data.error.issues;
                form.setErrors(Object.fromEntries(errors.map((error) => [error.path[0], error.message])));
            }
        });
    };

    return (
        <div className="appointment-form">
            <h1>Create an Appointment</h1>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput withAsterisk label="Appointment Date" {...form.getInputProps('appointment_date')} />
                <TextInput withAsterisk label="Doctor ID" {...form.getInputProps('doctor_id')} />
                <TextInput withAsterisk label="Patient ID" {...form.getInputProps('patient_id')} />
                <Button type="submit" className="btn btn-primary mt-3">Submit</Button>
            </form>
        </div>
    );
};

export default AppointmentCreate;
