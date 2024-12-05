import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';

const DoctorsContainer = ({ children }) => (
    <div style={{ margin: 'auto', width: '1200px' }}>
        {children}
    </div>
);

const Index = () => {
    const [doctors, setDoctors] = useState(null);
    const { token } = useAuth();

    useEffect(() => {
        axios.get('https://fed-medical-clinic-api.vercel.app/doctors')
            .then(response => {
                console.log('Doctors data:', response.data);
                setDoctors(response.data);
            })
            .catch(err => {
                console.error('Error fetching doctors:', err);
            });
    }, []);

    const handleDelete = (id) => {
        if (!token) {
            alert('Unauthorized! Login to delete');
            return;
        }

        console.log('Attempting to delete doctor with ID:', id); // Debugging log for ID

        axios.delete(`https://fed-medical-clinic-api.vercel.app/doctors/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((res) => {
            console.log('Deletion response:', res);

            // Updating state to reflect deletion
            setDoctors(doctors.filter((doctor) => doctor.id !== id)); // Use doctor.id here if the API returns 'id'
        }).catch((err) => {
            console.error('Deletion error:', err);
        });
    };

    if (!doctors) return 'Loading...';

    return (
        <DoctorsContainer>
            <Link to='/doctors/create'>Create</Link>
            {doctors.map(({ id, first_name, last_name, email, phone, specialisation }) => ( // Use 'id' here if the API returns 'id'
                <div key={id}>
                    <Link to={`/doctors/${id}`}> {/* Use 'id' here if the API returns 'id' */}
                        <h1>{first_name} {last_name}</h1>
                    </Link>
                    <h2>{specialisation}</h2>
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
        </DoctorsContainer>
    );
};

export default Index;
