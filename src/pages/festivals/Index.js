import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';

const FestivalsContainer = ({children}) => {
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
    const [festivals, setFestivals] = useState(null);

    const {token} = useAuth();

    useEffect(() => {
        axios.get('https://festivals-api.vercel.app/api/festivals')
            .then(response => {
                console.log(response.data);
                setFestivals(response.data);
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

        axios.delete(`https://festivals-api.vercel.app/api/festivals/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((res) => {
            console.log(res);

            // Deleting succeeded, but has only updated festival in the DB
            // It won't update the state by itself. We'll handle that here, so the UI reflects the change
            // Again recall that state is *immutable* - we aren't modifying the original array (which is not allowed)
            // Filter is returning an entirely *new* array with an element filtered out
            setFestivals(festivals.filter((festival) => {
                return festival._id != id;
            }))

        }).catch((err) => {
            console.error(err)
        })
    }

    if (!festivals) return 'Loading...'

    return (
        <FestivalsContainer>
            
            <Link to='/festivals/create'>Create</Link>
            {/* // Object destructuring */}
            {festivals.map(({ _id, title, city, description, start_date, end_date }) => {
                // equivalent to: festivals.title, festivals.city
                // pulling attributes out of the object (you can do this with arrays too)
                return (
                    <div>
                        <Link to={`/festivals/${_id}`}>
                            <h1>{title}</h1>
                        </Link>

                        <button onClick={() => {
                            const confirmDelete = window.confirm('are you sure?')

                            if (confirmDelete) {
                                handleDelete(_id)
                            }
                        }}>
                            Delete 🗑️
                        </button>

                        <h2>{city}</h2>
                        <p>{description}</p>
                        <div>
                            <span>
                                Start date: {start_date?.split('T'[0])}
                            </span>
                            <br />
                            <span>
                                End date: {end_date?.split('T'[0])}
                            </span>
                        </div>
                    </div>
                )
            })}
        </FestivalsContainer>
    )
};

export default Index;