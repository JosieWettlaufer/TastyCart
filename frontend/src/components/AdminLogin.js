// AdminLogin.js
import LoginForm from './LoginForm';

const AdminLogin = ({ setUser }) => {
  return <LoginForm setUser={setUser} isAdmin={true} />;
};

export default AdminLogin;