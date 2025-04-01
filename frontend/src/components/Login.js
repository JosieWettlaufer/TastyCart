// UserLogin.js
import LoginForm from './LoginForm';

const Login = ({ setUser }) => {
  return <LoginForm setUser={setUser} isAdmin={false} />;
};

export default Login;