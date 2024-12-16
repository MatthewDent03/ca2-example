import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';
import '../../styles/doctors.scss';

const DoctorsContainer = ({ children }) => (
  <div className="doctors-container">
    {children}
  </div>
);

const Index = () => {
  const [doctors, setDoctors] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    axios.get('https://fed-medical-clinic-api.vercel.app/doctors')
      .then(response => setDoctors(response.data))
      .catch(err => console.error('Error fetching doctors:', err));
  }, []);

  const handleDelete = (id) => {
    if (!token) {
      alert('Unauthorized! Login to delete');
      return;
    }

    axios.delete(`https://fed-medical-clinic-api.vercel.app/doctors/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => setDoctors(doctors.filter(d => d.id !== id)));
  };

  if (!doctors) return <p>Loading...</p>;

  return (
    <DoctorsContainer>
      <Link className="btn btn-primary mb-3" to="/doctors/create">Create</Link>
      {doctors.map(({ id, first_name, last_name, email, phone, specialisation }) => (
        <div key={id} className="doctor-card">
          <Link to={`/doctors/${id}`}>
            <h1>{first_name} {last_name}</h1>
          </Link>
          <h2>{specialisation}</h2>
          <p>{email} / {phone}</p>
          <button
            className="btn btn-delete"
            onClick={() => {
              if (window.confirm('Are you sure?')) handleDelete(id);
            }}
          >
            Delete 🗑️
          </button>
        </div>
      ))}
    </DoctorsContainer>
  );
};
export default Index;