import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../utils/useAuth";
import { useForm } from '@mantine/form';
import { TextInput, Text, Button } from "@mantine/core";
import '../../styles/prescriptions.scss';

const PrescriptionCreate = () => {
    const { token } = useAuth();
    const navigate = useNavigate();

    const form = useForm({
        initialValues: {
            patient_id: '',
            doctor_id: '',
            diagnosis_id: '',
            medication: '',
            dosage: '',
            start_date: '',
            end_date: ''
        },
        validate: {
            patient_id: (value) => (/^\d+$/.test(value) ? null : 'Patient ID must be a number'),
            doctor_id: (value) => (/^\d+$/.test(value) ? null : 'Doctor ID must be a number'),
            diagnosis_id: (value) => (/^\d+$/.test(value) ? null : 'Diagnosis ID must be a number'),
            medication: (value) => value.length > 2 && value.length < 255 ? null : 'Medication must be between 2 and 255 characters',
            dosage: (value) => value.length > 2 && value.length < 255 ? null : 'Dosage must be between 2 and 255 characters',
            start_date: (value) => {
                const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{4})$/;
                return dateRegex.test(value) ? null : 'Start date must be in dd-mm-yyyy format';
            },
            end_date: (value) => {
                const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{4})$/;
                return dateRegex.test(value) ? null : 'End date must be in dd-mm-yyyy format';
            },
        },
    });

    const handleSubmit = () => {
        const updatedForm = {
            ...form.values,
            patient_id: parseInt(form.values.patient_id, 10),
            doctor_id: parseInt(form.values.doctor_id, 10),
            diagnosis_id: parseInt(form.values.diagnosis_id, 10),
        };

        axios.post(`https://fed-medical-clinic-api.vercel.app/prescriptions`, updatedForm, {
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
        <div className="prescription-form">
            <h1>Create a Prescription</h1>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput withAsterisk label="Patient ID" {...form.getInputProps('patient_id')} />
                <TextInput withAsterisk label="Doctor ID" {...form.getInputProps('doctor_id')} />
                <TextInput withAsterisk label="Diagnosis ID" {...form.getInputProps('diagnosis_id')} />
                <TextInput withAsterisk label="Medication" {...form.getInputProps('medication')} />
                <TextInput withAsterisk label="Dosage" {...form.getInputProps('dosage')} />
                <TextInput withAsterisk label="Start Date" {...form.getInputProps('start_date')} />
                <TextInput withAsterisk label="End Date" {...form.getInputProps('end_date')} />
                <Button mt={10} type="submit" className="btn btn-primary mt-3">Submit</Button>
            </form>
        </div>
    );
};

export default PrescriptionCreate;
