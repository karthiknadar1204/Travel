import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { userContext } from '../UserContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate=useNavigate();
  const {setUser}=useContext(userContext)

  const handleEmailChange = (e) => { 
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const loginUser = async (e) => {
    e.preventDefault();
    try{
      const {data}=await axios.post('/login',{
        email,
        password
      });
      setUser(data);
      alert('login successful')
      navigate('/')
    }catch(err){
      console.log('error: ', err );
      alert('login failed')
    }
  };

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form onSubmit={loginUser} className="max-w-md mx-auto">
          <input
            type="email"
            placeholder="your@gmail.com"
            value={email}
            onChange={handleEmailChange}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={handlePasswordChange}
          />
          <button type="submit" className="primary">
            Login
          </button>
          <div className="text-center py-2 text-gray-500">
            Don't have an account yet?
            <Link className="underline text-black" to={'/register'}>
              Register Now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
