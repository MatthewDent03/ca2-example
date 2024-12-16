import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';


const DiagnosesContainer = ({ children }) => (
    <div style={{ margin: 'auto', width: '1200px' }}>
        {children}
    </div>
);

const DiagnosesIndex = () => {
    const [diagnoses, setDiagnoses] = useState(null);
    const { token } = useAuth();

    useEffect(() => {
        if (token) {
            axios.get('https://fed-medical-clinic-api.vercel.app/diagnoses', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                console.log('Diagnoses data:', response.data);
                setDiagnoses(response.data);
            })
            .catch(err => {
                console.error('Error fetching diagnoses:', err);
            });
        }
    }, [token]);

    const handleDelete = (id) => {
        if (!token) {
            alert('Unauthorized! Login to delete');
            return;
        }

        console.log('Attempting to delete diagnoses with ID:', id);

        axios.delete(`https://fed-medical-clinic-api.vercel.app/diagnoses/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((res) => {
            console.log('Deletion response:', res);

            // Updating state to reflect deletion
            setDiagnoses(diagnoses.filter((diagnosis) => diagnosis.id !== id));
        }).catch((err) => {
            console.error('Deletion error:', err);
        });
    };

    if (!diagnoses) return 'Loading...';

    return (
        <DiagnosesContainer>
            <Link to='/diagnoses/create'>Create</Link>
            {diagnoses.map(({ id, patient_id, condition }) => (
                <div key={id}>
                    <Link to={`/diagnoses/${id}`}>
                        <h1>Patient ID: {patient_id}</h1>
                    </Link>
                    <h2>Condition: {condition}</h2>
                    <button onClick={() => {
                        const confirmDelete = window.confirm('Are you sure?');
                        if (confirmDelete) {
                            handleDelete(id);
                        }
                    }}>
                        Delete 🗑️
                    </button>
                </div>
            ))}
        </DiagnosesContainer>
    );
};

export default DiagnosesIndex;
