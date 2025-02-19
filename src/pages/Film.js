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
            } else {
              const data = await response.json();
              setMessage(data.error || 'Something went wrong!'); // Display error message
            }
          } catch (error) {
            setMessage('Error: ' + error.message); // Handle network or server errors
          }
    };    

   return (
     <div>
         <Navbar />
       <h1>
         This is the Film Page
       </h1>
       <h2>Film Search</h2>
       <input 
        type="text" 
        placeholder="Movie Title" 
        value={filmTitle} 
        onChange={(e) => setFilmTitle(e.target.value)} 
      />
      <input 
        type="text" 
        placeholder="Actor's First Name" 
        value={actorFirstName} 
        onChange={(e) => setActorFirstName(e.target.value)} 
      />
      <input 
        type="text" 
        placeholder="Actor's Last Name" 
        value={actorLastName} 
        onChange={(e) => setActorLastName(e.target.value)} 
      />
      <input 
        type="text" 
        placeholder="Movie Genre" 
        value={filmGenre} 
        onChange={(e) => setFilmGenre(e.target.value)} 
      />
      <button onClick={fetchFilms} disabled={loading}>
        {loading ? 'Loading...' : 'Search'}
      </button>

      {filmDetails && (
        <div>
          <h2>Film Details</h2>
          {filmDetails.error ? (
            <p>{filmDetails.error}</p>
          ) : (
            <div>
              <h3>{filmDetails.film_title}</h3>
              <p><strong>Description:</strong> {filmDetails.description}</p>
              <p><strong>Release Year:</strong> {filmDetails.release_year}</p>
              <p><strong>Actors:</strong> {filmDetails.actor_names}</p>
              <p><strong>Categories:</strong> {filmDetails.categories}</p>
              <input 
                type="number" 
                placeholder="Customer Id" 
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)} 
              />
              <button onClick={() => rentOutMovie(filmDetails.film_title, customerId)}>
                Rent Movie to a Customer
              </button>
              {message && <p>{message}</p>} {/* Display success/error messages */}
            </div>
          )}
        </div>
      )}

      <h2>Results</h2>
      {films.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Film Info Button</th>
              <th>Film Title</th>
              <th>Actors</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {films.map((film, index) => (
              <tr key={index}>
                <td>
                  <button onClick={() => fetchFilmDetails(film.film_id)}>
                    {film.film_title}
                  </button>
                </td>
                <td>{film.film_title}</td>
                <td>{film.actor_names}</td>
                <td>{film.category_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No films found</p>
      )}
       
     </div>
   )
 }

 export default Film