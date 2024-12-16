import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../utils/useAuth";
import { useForm } from '@mantine/form';
import { TextInput, Text, Button } from "@mantine/core";
import '../../styles/doctors.scss';

const Create = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      specialisation: 'General Practitioner'
    },
    validate: {
      first_name: value => value.length >= 2 ? null : 'First name too short',
      last_name: value => value.length >= 2 ? null : 'Last name too short',
      email: value => /^\S+@\S+$/.test(value) ? null : 'Invalid email',
      phone: value => value.length === 10 ? null : 'Phone must be 10 digits'
    }
  });

  const handleSubmit = () => {
    axios.post('https://fed-medical-clinic-api.vercel.app/doctors', form.values, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => navigate(`../doctors`));
  };

  const specialisations = ['Podiatrist', 'Dermatologist', 'Pediatrician', 'Psychiatrist', 'General Practitioner'];

  return (
    <div className="doctor-form">
      <h1>Create a Doctor</h1>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput withAsterisk label="First Name" {...form.getInputProps('first_name')} />
        <TextInput withAsterisk label="Last Name" {...form.getInputProps('last_name')} />
        <label>Specialisation</label>
        <select className="form-select" {...form.getInputProps('specialisation')}>
          {specialisations.map(spec => <option key={spec} value={spec}>{spec}</option>)}
        </select>
        <TextInput withAsterisk label="Email" {...form.getInputProps('email')} />
        <TextInput withAsterisk label="Phone" {...form.getInputProps('phone')} />
        <Button type="submit" className="btn btn-primary mt-3">Submit</Button>
      </form>
    </div>
  );
};


export default Create;
