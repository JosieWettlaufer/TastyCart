//import UnitConverter from "./UnitConverter";
//import Timer from "./Timer";

const Dashboard = ({ user, setUser }) => {
    return (
        <div>
            <h1>Welcome, {user.username}!</h1>

            {/* Timer Component 
            <Timer user={user} setUser={setUser} /> 

            {/*Unit Converter Component
            <UnitConverter /> */}

            {/*Logout button*/}
            <button className="btn btn-danger"
            onClick={() => {
                localStorage.removeItem("token"); 
                localStorage.removeItem("user"); // Clear user data
                setUser(null); // Reset state
                window.location.href = "/login"; // Redirect to login
            }}>
                Logout
            </button>
        </div>
    );
};

export default Dashboard;
