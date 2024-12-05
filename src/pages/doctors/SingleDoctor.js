import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';

const SingleDoctor = () => {
    const { token } = useAuth();
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);

    useEffect(() => {
        if (!id) return;

        console.log('Fetching doctor with ID:', id);
        console.log('Using token:', token); 

        axios.get(`https://fed-medical-clinic-api.vercel.app/doctors/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((res) => {
            console.log('Doctor data:', res.data);
            setDoctor(res.data);
        })
        .catch((err) => {
            console.error('Error fetching doctor:', err);
        });
    }, [id, token]);

    if (!doctor) return 'Loading...';

    return (
        <div>
            <Link to={`/doctors/${id}/edit`}>Edit doctor</Link>
            <h1>{doctor.first_name}</h1>
            <h2>{doctor.last_name}</h2>
            <p>{doctor.specialisation}</p>
        </div>
    );
};

export default SingleDoctor;
