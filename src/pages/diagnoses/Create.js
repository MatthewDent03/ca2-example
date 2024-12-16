import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../utils/useAuth";
import { useForm } from '@mantine/form';
import { TextInput, Text, Button } from "@mantine/core";

const DiagnosesCreate = () => {
    const { token } = useAuth();
    const navigate = useNavigate();

    const form = useForm({
        initialValues: {
            patient_id: '',
            condition: '',
            diagnosis_date: ''
        },
        validate: {
            patient_id: (value) => (/^\d+$/.test(value) ? null : 'Patient ID must be a number'),
            condition: (value) => value.length > 2 && value.length < 255 ? null : 'Condition must be between 2 and 255 characters',
            diagnosis_date: (value) => {
                const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{4})$/;
                return dateRegex.test(value) ? null : 'Date must be in dd-mm-yyyy format';
            },
        },
    });

    const handleSubmit = () => {
        // Convert patient_id to number and format diagnosis_date before sending
        const updatedForm = {
            ...form.values,
            patient_id: parseInt(form.values.patient_id, 10),
            diagnosis_date: form.values.diagnosis_date // Ensure diagnosis_date is already in correct format
        };

        axios.post(`https://fed-medical-clinic-api.vercel.app/diagnoses`, updatedForm, {
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
        });
    };

    return (
        <div>
            <Text size={24} mb={5}>Create a diagnoses</Text>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput withAsterisk label={'Patient ID'} name='patient_id' {...form.getInputProps('patient_id')} />
                <TextInput withAsterisk label='Condition' name='condition' {...form.getInputProps('condition')} />
                <TextInput withAsterisk label='Diagnoses Date' name='diagnosis_date' {...form.getInputProps('diagnosis_date')} />
                <Button mt={10} type={'submit'}>Submit</Button>
            </form>
        </div>
    );
};

export default DiagnosesCreate;
