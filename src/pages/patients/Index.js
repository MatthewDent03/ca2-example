import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';


const PatientsController = ({ children }) => (
    <div style={{ margin: 'auto', width: '1200px' }}>
        {children}
    </div>
);

const PatientIndex = () => {
    const [patients, setPatients] = useState(null);
    const { token } = useAuth();

    useEffect(() => {
        axios.get('https://fed-medical-clinic-api.vercel.app/patients')
            .then(response => {
                console.log('Patients data:', response.data);
                setPatients(response.data);
            })
            .catch(err => {
                console.error('Error fetching patients:', err);
            });
    }, []);

    const handleDelete = (id) => {
        if (!token) {
            alert('Unauthorized! Login to delete');
            return;
        }

        console.log('Attempting to delete patient with ID:', id); // Debugging log for ID

        axios.delete(`https://fed-medical-clinic-api.vercel.app/patients/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((res) => {
            console.log('Deletion response:', res);

            // Updating state to reflect deletion
            setPatients(patients.filter((patient) => patient.id !== id)); // Use doctor.id here if the API returns 'id'
        }).catch((err) => {
            console.error('Deletion error:', err);
        });
    };

    if (!patients) return 'Loading...';

    return (
        <PatientsController>
            <Link to='/patients/create'>Create</Link>
            {patients.map(({ id, first_name, last_name, email, phone}) => ( // Use 'id' here if the API returns 'id'
                <div key={id}>
                    <Link to={`/patients/${id}`}> {/* Use 'id' here if the API returns 'id' */}
                        <h1>{first_name} {last_name}</h1>
                    </Link>
                    <p>{email} / {phone}</p>
                    <button onClick={() => {
                        const confirmDelete = window.confirm('Are you sure?');
                        if (confirmDelete) {
                            handleDelete(id); // Use 'id' here if the API returns 'id'
                        }
                    }}>
                        Delete 🗑️
                    </button>
                </div>
            ))}
        </PatientsController>
    );
};

export default PatientIndex;
