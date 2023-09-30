import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
const RegisterPage = () => {


  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const registerUser = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:3002/register', {
        name,
        email,
        password
      });
  
      if (response.status === 200) {
        alert('Registration is successful. Now you can log in');
      } else {
        alert('Registration failed. Please try again later.');
      }
    } catch (error) {
      console.error('Registration error:', error.message);
      alert('Registration failed. Please try again later.');
    }
  };
  

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form onSubmit={registerUser} className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={handleNameChange}
          />
          <input
            type="email"
            placeholder="your@gmail.com"
            value={email}
            onChange={handleEmailChange}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
          <button type="submit" className="primary">
            Register
          </button>
          <div className="text-center py-2 text-gray-500">
            Already a member?
            <Link className="underline text-black" to={'/login'}>
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
