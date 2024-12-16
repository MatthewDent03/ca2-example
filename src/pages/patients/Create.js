import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../utils/useAuth";
import { useForm } from '@mantine/form';
import { TextInput, Text, Button } from "@mantine/core";
import { DatePicker } from '@mantine/dates';

const PatientCreate = () => {
    const { token } = useAuth();
    const navigate = useNavigate();

    const form = useForm({
        initialValues: {
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            address: '',
            date_of_birth: null
        },
        validate: {
            first_name: (value) => value.length > 2 && value.length < 255 ? null : 'First name must be between 2 and 255 characters',
            last_name: (value) => value.length > 2 && value.length < 255 ? null : 'Last name must be between 2 and 255 characters',
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            phone: (value) => value.length === 10 ? null : 'Phone number must be 10 digits',
            address: (value) => value.length > 2 && value.length < 255 ? null : 'Address must be between 2 and 255 characters',
            date_of_birth: (value) => value ? null : 'Invalid DoB'
        },
    });

    const handleSubmit = () => {
        const dateOfBirthFormatted = form.values.date_of_birth ? form.values.date_of_birth.toISOString().split('T')[0] : '';
        const updatedForm = {
            ...form.values,
            date_of_birth: dateOfBirthFormatted
        };
        axios.post(`https://fed-medical-clinic-api.vercel.app/patients`, form.values, {
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

                if (err.response.data.message === 'SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: patients.email') {
                    console.log('Saw a unique constraint error');
                    form.setFieldError('email', 'Email must be unique.');
                }

                if (err.response.data.message === 'SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: patients.phone') {
                    form.setFieldError('phone', 'Phone number must be unique.');
                }
            });
    };

    return (
        <div>
            <Text size={24} mb={5}>Create a patient</Text>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput withAsterisk label={'First name'} name='first_name' {...form.getInputProps('first_name')} />
                <TextInput withAsterisk label='Last name' name='last_name' {...form.getInputProps('last_name')} />
                <TextInput label={'Email'} withAsterisk name='email' {...form.getInputProps('email')} />
                <TextInput label={'Phone'} name='phone' withAsterisk {...form.getInputProps('phone')} />
                <TextInput withAsterisk label='Address' name='address' {...form.getInputProps('address')} />
                <DatePicker withAsterisk label='Date of Birth' name='date_of_birth' placeholder='Select date' {...form.getInputProps('date_of_birth')} />
                <Button mt={10} type={'submit'}>Submit</Button>
            </form>
        </div>
    );
};

export default PatientCreate;
