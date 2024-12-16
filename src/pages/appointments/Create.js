import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../utils/useAuth";
import { useForm } from '@mantine/form';
import { TextInput, Text, Button } from "@mantine/core";

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
        // Convert doctor_id and patient_id to numbers before sending
        const updatedForm = {
            ...form.values,
            doctor_id: parseInt(form.values.doctor_id),
            patient_id: parseInt(form.values.patient_id)
        };

        axios.post(`https://fed-medical-clinic-api.vercel.app/appointments`, updatedForm, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((res) => {
            console.log(res.data);
            navigate(`../${res.data.id}`, { relative: 'path' });
        })
        .catch((err) => {
            console.error(err);

            if (err.response.status === 422) {
                let errors = err.response.data.error.issues;
                form.setErrors(Object.fromEntries(errors.map((error) => [error.path[0], error.message])));
            }

            if (err.response.data.message === 'SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: doctors.email') {
                console.log('Saw a unique constraint error');
                form.setFieldError('email', 'Email must be unique.');
            }

            if (err.response.data.message === 'SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: doctors.phone') {
                form.setFieldError('phone', 'Phone number must be unique.');
            }
        });
    };

    return (
        <div>
            <Text size={24} mb={5}>Create an Appointment</Text>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput withAsterisk label={'Appointment Date'} name='appointment_date' {...form.getInputProps('appointment_date')} />
                <TextInput withAsterisk label='Doctor ID' name='doctor_id' {...form.getInputProps('doctor_id')} />
                <TextInput withAsterisk label='Patient ID' name='patient_id' {...form.getInputProps('patient_id')} />
                <Button mt={10} type={'submit'}>Submit</Button>
            </form>
        </div>
    );
};

export default AppointmentCreate;
