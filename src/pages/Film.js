 //About.js
 import Navbar from '../components/Navbar'
 //import React from 'react'
 import React, { useState } from 'react';
 import axios from 'axios';

 function Film() {
    // State for the fetched data, loading status, current page, and total pages
    const [actorFirstName, setActorFirstName] = useState('');
    const [actorLastName, setActorLastName] = useState('');
    const [filmTitle, setFilmTitle] = useState('');
    const [filmGenre, setFilmGenre] = useState('');
    const [films, setFilms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filmDetails, setFilmDetails] = useState(null);
    //
    const [customerId, setCustomerId] = useState('');
    const [message, setMessage] = useState('');

    // Fetch films data based on search query
    const fetchFilms = async () => {
        setLoading(true);
        try {
        const response = await axios.get('http://localhost:5000/search', {
            params: {
            movie_title: filmTitle,
            first_name: actorFirstName,
            last_name: actorLastName,
            movie_genre: filmGenre
            }
        });
        setFilms(response.data);
        } catch (error) {
        console.error("There was an error fetching the data!", error);
        }
        setLoading(false);
    };

    const fetchFilmDetails = async (filmId) => {
        try {
          const response = await axios.get(`http://localhost:5000/filmdet/${filmId}`);
          console.log("category?", response.data.categories)
          setFilmDetails(response.data);
        } catch (error) {
          console.error("Error fetching film details:", error);
          setFilmDetails({ error: 'Failed to fetch film details' });
        }
      };

    const rentOutMovie = async (film_title, customer_id) => {
        const requestData = {
            customer_id: customer_id,
            film_title: film_title,
          };
      
          try {
            // Sending POST request to Flask backend
            const response = await fetch('http://localhost:5000/rent-film', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestData), // Convert the data to JSON
            });
      
            // Handle the response
            if (response.ok) {
              const data = await response.json();
              setMessage(data.message); // Display success message
              setTimeout(() => setMessage(""), 5000); // Hide message after 5 seconds
            } else {
              const data = await response.json();
              setMessage(data.error || 'Something went wrong!'); // Display error message
              setTimeout(() => setMessage(""), 5000); // Hide message after 5 seconds
            }
          } catch (error) {
            setMessage('Error: ' + error.message); // Handle network or server errors
            setTimeout(() => setMessage(""), 5000); // Hide message after 5 seconds
          }
    };    

    //tailwind colors
    // bg-gray-100 whole page background color
    // #f5cb62 bg-[#f5cb62] darker yellow button color
    // #FDFD96 bg-[#FDFD96] lighter yellow
    // #f9c414 bg-[#f9c414] even darker yellow
    // #9b870c bg-[#9b870c] even darker darker yellow hover color

   return (
     <div className="min-h-screen bg-gray-100 p-6">
         <Navbar />
       <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
         This is the Film Page
       </h1>
       <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Film Search</h2>
        <div className="flex space-x-2">
          <input 
            type="text" 
            placeholder="Movie Title" 
            className="border p-2 rounded-md w-1/4"
            value={filmTitle} 
            onChange={(e) => setFilmTitle(e.target.value)} 
          />
          <input 
            type="text" 
            placeholder="Actor's First Name" 
            className="border p-2 rounded-md w-1/4"
            value={actorFirstName} 
            onChange={(e) => setActorFirstName(e.target.value)} 
          />
          <input 
            type="text" 
            placeholder="Actor's Last Name" 
            className="border p-2 rounded-md w-1/4"
            value={actorLastName} 
            onChange={(e) => setActorLastName(e.target.value)} 
          />
          <input 
            type="text" 
            placeholder="Movie Genre" 
            className="border p-2 rounded-md w-1/4"
            value={filmGenre} 
            onChange={(e) => setFilmGenre(e.target.value)} 
          />
          <button className="bg-[#f5cb62] hover:bg-[#9b870c] text-white px-4 py-2 rounded-md" onClick={fetchFilms} disabled={loading}>
            {loading ? 'Loading...' : 'Search'}
          </button>
          </div>
      </div>
      {filmDetails && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Film Details</h2>
          {filmDetails.error ? (
            <p className="text-red-600">{filmDetails.error}</p>
          ) : (
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-800">{filmDetails.film_title}</h3>
              <p className="text-gray-700"><strong>Description:</strong> {filmDetails.description}</p>
              <p className="text-gray-700"><strong>Release Year:</strong> {filmDetails.release_year}</p>
              <p className="text-gray-700"><strong>Actors:</strong> {filmDetails.actor_names}</p>
              <p className="text-gray-700"><strong>Categories:</strong> {filmDetails.categories}</p>
              <div className="flex items-center space-x-3 mt-4">
              <input 
                className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                type="number" 
                placeholder="Customer Id" 
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)} 
              />
              <button className="bg-[#f5cb62] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#9b870c] transition transform hover:scale-105" onClick={() => rentOutMovie(filmDetails.film_title, customerId)}>
                Rent Movie to a Customer
              </button>
              </div>
              {message && <p className="mt-2 text-green-600 shadow-md animate-fadeIn">{message}</p>} {/* Display success/error messages */}
            </div>
          )}
        </div>
      )}

      <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">Results</h2>
      {films.length > 0 ? (
        <div className="overflow-x-auto">
        <table className="w-full border-collapse shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3 text-left">Film Info Button</th>
              <th className="p-3 text-left">Film Title</th>
              <th className="p-3 text-left">Actors</th>
              <th className="p-3 text-left">Category</th>
            </tr>
          </thead>
          <tbody>
            {films.map((film, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <button className="bg-[#f5cb62] text-white px-3 py-1 rounded-md hover:bg-[#9b870c] transition" onClick={() => fetchFilmDetails(film.film_id)}>
                    {film.film_title}
                  </button>
                </td>
                <td className="p-3">{film.film_title}</td>
                <td className="p-3">{film.actor_names}</td>
                <td className="p-3">{film.category_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      ) : (
        <p className="text-gray-600 text-lg">No films found</p>
      )}
       
     </div>
   )
 }

 export default Film