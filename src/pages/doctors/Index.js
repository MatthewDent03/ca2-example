
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';

const DoctorsContainer = ({children}) => {
    return (
        <div style={{
            margin: 'auto',
            width: '1200px'
        }}>
            {children}
        </div>
    )
}

const Index = () => {
//     return (
//         <h1>hello this is doctors index</h1>
//     )
// };

    const [doctors, setDoctors] = useState(null);

    const {token} = useAuth();

    useEffect(() => {
        axios.get('https://fed-medical-clinic-api.vercel.app/doctors')
            .then(response => {
                console.log(response.data);
                setDoctors(response.data);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    const handleDelete = (id) => {
        if (!token) {
            alert('Unauthorised! Login to delete')
            return;
        }

        axios.delete(`https://fed-medical-clinic-api.vercel.app/doctors/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((res) => {
            console.log(res);

            // Deleting succeeded, but has only updated festival in the DB
            // It won't update the state by itself. We'll handle that here, so the UI reflects the change
            // Again recall that state is *immutable* - we aren't modifying the original array (which is not allowed)
            // Filter is returning an entirely *new* array with an element filtered out
            setDoctors(doctors.filter((doctor) => {
                return doctor._id != id;
            }))

        }).catch((err) => {
            console.error(err)
        })
    }

    if (!doctors) return 'Loading...'

    return (
        <DoctorsContainer>
            
            <Link to='/doctors/Create'>Create</Link>
            {/* // Object destructuring */}
            {doctors.map(({ _id, first_name, last_name, email, phone, specialisation }) => {
                // equivalent to: doctors.title, doctors.city
                // pulling attributes out of the object (you can do this with arrays too)
                return (
                    <div>
                        <Link to={`/doctors/${_id}`}>
                            <h1>{first_name}{last_name}</h1>
                        </Link>

                        <h2>{specialisation}</h2>
                        <p>{email} / {phone}</p>

                        <button onClick={() => {
                            const confirmDelete = window.confirm('are you sure?')

                            if (confirmDelete) {
                                handleDelete(_id)
                            }
                        }}>
                            Delete 🗑️
                        </button>
                    </div>
                )
            })}
        </DoctorsContainer>
    )
};

export default Index;

