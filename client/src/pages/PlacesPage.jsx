import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesFormPage from "./PlacesFormPage";
import { useEffect } from "react";

const PlacesPage = () => {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get("/user-places").then(({ data }) => {
      setPlaces(data);
    });
  }, []);
  const {id}=useParams();
  const { action } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [photoLink, setPhotoLink] = useState("");
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);



  return (
    <div>
      {action !== "new" && (
        <div className="text-center">
          <Link
            className=" inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
            to={"/account/places/new"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Add new place
          </Link>
          <div className="mt-4" >
          {places.length > 0 &&
            places.map((place) => (
              <Link to={'/account/places/'+place._id} className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl"  key={place._id}>
                <div className="flex w-32 h-32 bg-gray-300" >
                  {
                    place.photos.length>0 && (
                      <img className="" src={'http://localhost:3002/uploads/'+place.photos[0]} alt="photos" />
                    )
                  }
                </div>
                <div className="grow-0 shrink" >
                  <h2 className="text-xl" >{place.title}</h2>
                  <p className="text-sm mt-2">{place.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      {action === "new" && <PlacesFormPage />}
    </div>
  );
};

export default PlacesPage;
