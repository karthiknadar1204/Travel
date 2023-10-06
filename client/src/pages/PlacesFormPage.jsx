import { useState } from "react";
import axios from "axios";
import PhotosUploader from "../components/PhotosUploader";
import Perks from "../components/Perks";
import { useNavigate,useParams  } from "react-router-dom";
import { useEffect } from "react";

const PlacesFormPage = () => {
    const navigate=useNavigate()
    const {id}=useParams();
    const [title, setTitle] = useState("");
    const [address, setAddress] = useState("");
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [photoLink, setPhotoLink] = useState("");
    const [description, setDescription] = useState("");
    const [perks, setPerks] = useState([]);
    const [extraInfo, setExtraInfo] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [price,setPrice]=useState(100);
    const [maxGuests, setMaxGuests] = useState(1);

    useEffect(()=>{
      if(!id){
        return
      }
      axios.get('/places/'+id).then(response=>{
        const {data}=response;
        console.log('API Response:', response.data);
        setTitle(data.title);
        setAddress(data.address);
        // setAddedPhotos(data?.Photos);
        setDescription(data.description);
        setPerks(data.perks);
        setExtraInfo(data.extraInfo);
        setCheckIn(data.checkIn);
        setCheckOut(data.checkOut);
        setMaxGuests(data.maxGuests);
        setPrice(data.price);
      })
    },[id])

      const preInput = (header, description) => {
        return (
          <>
            <h2 className="text-xl mt-4">{header}</h2>
            <p className="text-gray-500 text-sm">{description}</p>
          </>
        );
      };

      const savePlace=async(e)=>{
        e.preventDefault();
        const placeData={title,address,
          addedPhotos,
          description,
          perks,extraInfo,
          checkIn,checkOut,
          maxGuests,price}
        if(id){
          //update
          const {data}=await axios.put('/places',{
            id,...placeData
          })
          navigate('/account/places')
        }
        else{
          //create new place
          const {data}=await axios.post('/places',{title,address,
            addedPhotos,
            description,
            perks,extraInfo,
            checkIn,checkOut,
            maxGuests,price})
            navigate('/account/places')
        }
      }
  return (
    <div>
    <form onSubmit={savePlace} >
      {preInput(
        "Title",
        "Title for your place. Should be catchy and short"
      )}
      <input
        type="text"
        placeholder="title for example: my lovely apartment"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {preInput("Address", "Address to this place")}
      <input
        type="text"
        placeholder="address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      {preInput("Photos", "more = better")}
      <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />

      {preInput("Description", "description of the place")}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {preInput("Perks", "Select all the perks of your place")}
      <Perks selected={perks} onChange={setPerks} />

      {preInput("Extra info", "house rules etc")}
      <textarea
        value={extraInfo}
        onChange={(e) => setExtraInfo(e.target.value)}
      />

      {preInput(
        "Check in and out times",
        "add check-in and check-out times, remember to have some time window for cleaning the room between guests"
      )}
      <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
        <div>
          <h3 className="mt-2 -mb-1">Check-in time</h3>
          <input
            type="text"
            placeholder="14:00"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>
        <div>
          <h3 className="mt-2 -mb-1">Check-out time</h3>
          <input
            type="text"
            placeholder="11:00"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>
        <div>
          <h3 className="mt-2 -mb-1">Max-Number of guests</h3>
          <input
            type="number"
            value={maxGuests}
            onChange={(e) => setMaxGuests(parseInt(e.target.value))}
          />
        </div>

        <div>
          <h3 className="mt-2 -mb-1">Price per night</h3>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseInt(e.target.value))}
          />
        </div>
      </div>

      <div>
        <button className="primary my-4">Save</button>
      </div>
    </form>
  </div>
  )
}

export default PlacesFormPage