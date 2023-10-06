import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import Layout from './Layout';
import RegisterPage from './pages/RegisterPage';
import axios from 'axios';
import UserContextProvider from './UserContext';
import Account from './pages/Account';
import PlacesFormPage from './pages/PlacesFormPage';
import PlacePage from './pages/PlacePage';
import BookingPage from './pages/BookingPage';
import BookingsPage from './pages/BookingsPage';

axios.defaults.baseURL='http://127.0.0.1:3002'
axios.defaults.withCredentials=true

const App = () => {
  return (
    <Router>
      <UserContextProvider>
      <Routes>
        <Route element={<Layout />}>
        <Route index element={<IndexPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path='/account/:subpage?' element={<Account/>} />
        <Route path='/account/:subpage/:action' element={<Account/>} />
        <Route path='/account/places/:id' element={<PlacesFormPage/>} />
        <Route path='/place/:id' element={<PlacePage/>} />
        <Route path='/account/bookings/:id' element={<BookingPage/>} />
        <Route path='/account/bookings' element={<BookingsPage/>} />
      </Route>
      </Routes>
      </UserContextProvider>
    </Router>
  )
}
export default App
