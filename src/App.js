import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from 'react'
import Navbar from "./components/Navbar";

function App() {
//
const [data, setData] = useState(null);  // State for data
const [loading, setLoading] = useState(true); // Loading state
const [error, setError] = useState(null); // Error state
//
const [selectedFilm, setSelectedFilm] = useState(null); // State for the clicked film
const [filmDetails, setFilmDetails] = useState(null);
//
const [actors, setActor] = useState(null);  // State for data
//
const [selectedActor, setSelectedActor] = useState(null); // State for the clicked film
const [actorMovies, setActorMovies] = useState(null);


useEffect(() => {
  fetch('http://localhost:5000/topfive') // Fetch data from your Flask API
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      //console.log('Fetched data:', data); // Check the structure of the fetched data
      const sortedData = [...data].sort((a, b) => a.rented - b.rented); // Sort the copied array
      //console.log('Fetched sorted data:', sortedData); // Check the structure of the fetched data
      setData(sortedData); // Set the sorted data in state
      setLoading(false); // Stop loading
    })
    .catch((error) => {
      //console.error('There was an error fetching the data!', error);
      setError(error); // Set error if fetch fails
      setLoading(false); // Stop loading
    });
  //
  fetch('http://localhost:5000/topactor') // Fetch data from your Flask API
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      //console.log('Fetched data:', data); // Check the structure of the fetched data
      const sortedData = [...data].sort((a, b) => a.movies - b.movies); // Sort the copied array
      //console.log('Fetched sorted data:', sortedData); // Check the structure of the fetched data
      setActor(sortedData); // Set the sorted data in state
      setLoading(false); // Stop loading
    })
    .catch((error) => {
      //console.error('There was an error fetching the data!', error);
      setError(error); // Set error if fetch fails
      setLoading(false); // Stop loading
    });



}, []); // Empty dependency array ensures it runs once when the component mounts

const handleFilmClick = (film) => {
  //console.log('Clicked film:', film);  // You can replace this with any action you want
  //console.log('Clicked film title:', film.title);
  //console.log('Clicked film id:', film.film_id);
  setSelectedFilm(film.film_id);  // Update the selected film state
    fetch(`http://localhost:5000/filminfo/${film.film_id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); // Parse JSON response for the selected film
    })
    .then((details) => {
      //console.log('Fetched film details:', details); // Log the fetched details
      setFilmDetails(details[0]); // Save the fetched details into the state
    })
    .catch((error) => {
      //console.error('There was an error fetching film details!', error);
      setFilmDetails(null); // Set to null in case of error
    });
};

const handleActorClick = (actor) => {
  //console.log('Clicked Actor:', actor);
  //console.log('Clicked Actor id:', actor.actor_id);
  setSelectedActor(actor.actor_id); // Update the selected book state
  fetch(`http://localhost:5000/actormovies/${actor.actor_id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); // Parse the JSON response
    })
    .then((details2) => {
      //console.log('Fetched book details:', details2); // Log the fetched details
      const sortedMovies = [...details2].sort((a, b) => a.rental_count - b.rental_count); // Sort the copied array
      //console.log('Fetched sorted data:', sortedMovies); // Check the structure of the fetched data
      setActorMovies(sortedMovies); // Assuming it's an array of one object
    })
    .catch((error) => {
      //console.error('There was an error fetching book details!', error);
      setActorMovies(null); // Set to null in case of error
    });
};


if (loading) return <p>Loading...</p>; // Display loading state
if (error) return <p>Error: {error.message}</p>; // Display error if there's one
    
  //
  return (
    <div className="App">
      <Navbar />
      <h1>Rental Movies store</h1>
      <h2>Landing Page</h2>
      <h2>Hello Store clerk!</h2>
      <h2>Top 5 Movies</h2>
      {Array.isArray(data) && data.length > 0 ? (
        <ol>
          {/* Iterate over the array of objects and display each film */}
          {data.map((film) => (
            <li
              key={film.film_id}
              onClick={() => handleFilmClick(film)} // Add onClick event
              style={{ cursor: 'pointer', margin: '10px 0' }} // Optional styling to indicate it's clickable
            >
              <strong>Title:</strong> {film.title} <br />
              <strong>Film ID:</strong> {film.film_id} <br />
              <strong>Rented:</strong> {film.rented} times
            </li>
          ))}
        </ol>
      ) : (
        <p>No data found.</p>
      )}

      {selectedFilm && filmDetails && (
        <div style={{ marginTop: '20px' }}>
          <h3>Details of Selected Film:</h3>
          <p><strong>Title:</strong> {filmDetails.title || 'No title available'}</p>
          <p><strong>Category:</strong> {filmDetails.FilmCategory || 'No category available'}</p>
          <p><strong>Rating:</strong> {filmDetails.rating || 'No rating available'}</p>
          <p><strong>Release Year:</strong> {filmDetails.release_year || 'No release year available'}</p>
          <p><strong>Description:</strong> {filmDetails.description || 'No description available'}</p>
          <p><strong>Film ID:</strong> {filmDetails.film_id || 'No film ID available'}</p>
        </div>
      )}

      <h2>Top 5 Actors</h2>
      {Array.isArray(actors) && actors.length > 0 ? (
        <ol>
          
          {actors.map((actor) => (
            <li
              key={actor.actor_id}
              onClick={() => handleActorClick(actor)} // Add onClick event
              style={{ cursor: 'pointer', margin: '10px 0' }} // Optional styling to indicate it's clickable
            >
              <strong>Name:</strong> {actor.first_name}  {actor.last_name}<br />
              <strong>Actor ID:</strong> {actor.actor_id} <br />
              <strong>Movies Acted in:</strong> {actor.movies}
            </li>
          ))}
        </ol>
      ) : (
        <p>No data found.</p>
      )}

      
      <ul>
      {selectedActor && actorMovies && actorMovies.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Movies of Selected Actor:</h3>
          <ul>
            {actorMovies.map((movie) => (
              <li key={movie.film_id}>
                <h4>{movie.title}</h4>
                <p><strong>Film ID:</strong> {movie.film_id}</p>
                <p><strong>Movie Appearances:</strong> {movie.rental_count}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Display a message if no movies are available for the actor */}
      {selectedActor && actorMovies && actorMovies.length === 0 && (
        <p>No movies available for this actor.</p>
      )}
      </ul>
    </div>
  );
}

export default App;
