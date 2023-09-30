import { useEffect } from "react";
import { createContext, useState } from "react";
import axios from 'axios'

export const userContext = createContext({});

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [ready,setReady]=useState(false)

  useEffect(()=>{
    if(!user){
        axios.get('/profile').then(({data})=>{
            setUser(data)
            setReady(true)
        })
    }

  },[]);

  return (
    <userContext.Provider value={{ user, setUser,ready }}>
      {children}
    </userContext.Provider>
  );
}

export default UserContextProvider;
