import { useLocation } from "react-router-dom";

const Home = () => {
    // The user might reach this page after being redirected by ProtectedRoute
    // In that case, the router will have been given a message at location.state.msg
    const location = useLocation();
    const msg = location?.state?.msg;

    return (
        <div>
            <h1>This is Home</h1>
            <span>{msg}</span>
        </div>
    );
};

export default Home;