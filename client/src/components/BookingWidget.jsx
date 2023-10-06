import { useState } from "react"
import {differenceInCalendarDays} from 'date-fns'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { userContext } from "../UserContext";
import { useEffect } from "react";
const BookingWidget = ({place}) => {
  const navigate=useNavigate()
  const [checkIn,setCheckIn]=useState('');
  const [checkOut,setCheckOut]=useState('');
  const [numberOfGuests,setNumberOfGuests]=useState('');
  const [name,setName]=useState('');
  const [phone,setPhone]=useState('');
  const {user}=useContext(userContext);

  useEffect(()=>{
    if(user){
      setName(user.name)
    }

  },[user])


  let numberOfNights=0;
  if(checkIn && checkOut){
    numberOfNights=differenceInCalendarDays(new Date(checkOut),new Date(checkIn))
  }

  const bookThisPlace = async () => {
    try {
      const response = await axios.post('/bookings', {
        checkIn,
        checkOut,
        numberOfGuests,
        name,
        phone,
        place: place._id,
        price: numberOfNights * place.price
      });
  
      const bookingId = response.data._id;
      navigate(`/account/bookings/${bookingId}`);
    } catch (error) {
      console.error('Error creating booking:', error);
      // Handle the error or show a message to the user
    }
  }
  
  return (
    <div>
        <div className="bg-white shadow p-4 rounded-2xl">
          <div className="text-2xl text-center">
            Price:${place.price} /per night
          </div>
          <div className="border rounded-2xl mt-4">
            <div className="flex">
              <div className="py-4 px-4">
                <label htmlFor="">Check-in:</label>
                <input type="date"
                 value={checkIn} 
                 onChange={e=>setCheckIn(e.target.value)}/>
              </div>
              <div className="py-3 px-4 border-l">
                <label htmlFor="">Check-out:</label>
                <input type="date" 
                value={checkOut} 
                onChange={e=>setCheckOut(e.target.value)}/>
              </div>
            </div>
            <div className="py-3 px-4 border-t">
                <label htmlFor="">Number of guests</label>
                <input type="number" 
                value={numberOfGuests} 
                onChange={e=>setNumberOfGuests(e.target.value)}/>
              </div>
              {
                numberOfNights> 0 && (
                  <div className="py-3 px-4 border-t">
                  <label htmlFor="">Your full name</label>
                  <input type="text" 
                  value={name} 
                  onChange={e=>setName(e.target.value)}/>

                <label htmlFor="">Phone NUmber</label>
                  <input type="tel" 
                  value={phone} 
                  onChange={e=>setPhone(e.target.value)}/>
                </div>

                )
              }

          </div>
          <button onClick={bookThisPlace} className="primary mt-4">
            Book this place
            {
              numberOfNights>0 && (
                <>
                <span>
                  $ {numberOfNights*place.price}
                </span>
                </>
              )
            }
          </button>
        </div>
    </div>
  )
}

export default BookingWidget