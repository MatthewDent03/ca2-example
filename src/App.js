import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './pages/Home';
import FestivalsIndex from './pages/festivals/Index';
import SingleFestival from "./pages/festivals/SingleFestival";

import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ProtectedRoute from './components/ProtectedRoute'

import Create from './pages/festivals/Create';
import Edit from './pages/festivals/Edit'
import { AuthProvider } from "./utils/useAuth";
import Index from './pages/doctors/Index';
import DoctorEdit from './pages/doctors/Edit';
import DoctorCreate from "./pages/doctors/Create";
import SingleDoctor from "./pages/doctors/SingleDoctor";

import PatientIndex from './pages/patients/Index';
import PatientEdit from './pages/patients/Edit';
import PatientCreate from "./pages/patients/Create";
import SinglePatient from "./pages/patients/SinglePatient";

import AppointmentIndex from './pages/appointments/Index';
import AppointmentEdit from './pages/appointments/Edit';
import AppointmentCreate from "./pages/appointments/Create";
import SingleAppointment from "./pages/appointments/SingleAppointment";

import DiagnosesIndex from './pages/diagnoses/Index';
import DiagnosesEdit from './pages/diagnoses/Edit';
import DiagnosesCreate from "./pages/diagnoses/Create";
import SingleDiagnoses from "./pages/diagnoses/SingleDiagnoses";

import PrescriptionIndex from './pages/prescriptions/Index';
import PrescriptionEdit from './pages/prescriptions/Edit';
import PrescriptionCreate from "./pages/prescriptions/Create";
import SinglePrescription from "./pages/prescriptions/SinglePrescription";

import { createContext } from "react";

export const UserContext = createContext();

export const Container = ({ children }) => {
    return (
        <div style={{ width: '1200px', margin: 'auto' }}>
            {children}
        </div>
    );
};

const App = () => {

    // We wrap the entire app in the auth provider
    // We no longer need to pass the auth state down from here, all our routes can get it from the context instead
    return (
        <div>
        <AuthProvider>
            <UserContext.Provider value={{
                    username: 'Joe Bloggs',
                    email: 'joe.bloggs@email.com'
                }}></UserContext.Provider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />

                    {/* Festival routes */}
                    <Route path="/festivals" element={<FestivalsIndex />} />
                    <Route path='/' element={<ProtectedRoute />}>
                        <Route path='/festivals/create' element={<Create />} />
                        <Route path='/festivals/:id/edit' element={<Edit />} />
                        <Route path='/festivals/:id' element={<SingleFestival />} />
                    </Route>
                    <Route path='/login' element={<LoginForm />} />
                    <Route path='/register' element={<RegisterForm />} />

                    {/* Doctors Routes */}
                    <Route path="/doctors" element={<Index />} />
                    <Route path='/doctors/:id/edit' element={<DoctorEdit />} />
                    <Route path='/doctors/create' element={<DoctorCreate />} />
                    <Route path='/doctors/:id' element={<SingleDoctor />} />

                    {/* Patients Routes */}
                    <Route path="/patients" element={<PatientIndex />} />
                    <Route path='/patients/:id/edit' element={<PatientEdit />} />
                    <Route path='/patients/create' element={<PatientCreate />} />
                    <Route path='/patients/:id' element={<SinglePatient />} />

                    {/* Appointments Routes */}
                    <Route path="/appointments" element={<AppointmentIndex />} />
                    <Route path='/appointments/:id/edit' element={<AppointmentEdit />} />
                    <Route path='/appointments/create' element={<AppointmentCreate />} />
                    <Route path='/appointments/:id' element={<SingleAppointment />} />

                    {/* Diagnoses Routes */}
                    <Route path="/diagnoses" element={<DiagnosesIndex />} />
                    <Route path='/diagnoses/:id/edit' element={<DiagnosesEdit />} />
                    <Route path='/diagnoses/create' element={<DiagnosesCreate />} />
                    <Route path='/diagnoses/:id' element={<SingleDiagnoses />} />

                    {/* Prescriptions Routes */}
                    <Route path="/prescriptions" element={<PrescriptionIndex />} />
                    <Route path='/prescriptions/:id/edit' element={<PrescriptionEdit />} />
                    <Route path='/prescriptions/create' element={<PrescriptionCreate />} />
                    <Route path='/prescriptions/:id' element={<SinglePrescription />} />
                </Routes>
            </Router>
            </UserContext.Provider>
        </AuthProvider>
        </div>
    );
};

export default App;