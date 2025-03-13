 //Customer.js
 import React, {useState, useEffect} from 'react'
 import Navbar from '../components/Navbar'

 function Customer() {
    const itemsPerPage = 3; // Number of customers per page
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    // Separate states for each search field
    const [customerIdSearch, setCustomerIdSearch] = useState("");
    const [firstNameSearch, setFirstNameSearch] = useState("");
    const [lastNameSearch, setLastNameSearch] = useState("");
    //
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [storeId, setStoreId] = useState('');
    const [addressId, setAddressId] = useState('');
    const [active, setActive] = useState(true); // Default to active
    const [message, setMessage] = useState('');
    //
    const [customerId, setCustomerId] = useState("");
    //
    const [errorMessage, setErrorMessage] = useState('');
    //
    const [isEditing, setIsEditing] = useState(false);
    //
    const [movies, setMovies] = useState([]); // State to hold the fetched data
    const [loading, setLoading] = useState(false); // State for loading indicator
    const [error, setError] = useState(null); // State to hold any error message
    //
    const [firstInteract, setfirstInteract] = useState(false); // Default to active
    //
    var count = 0;
    //
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Create the customer object to send to the backend
        const customer = {
          first_name: firstName,
          last_name: lastName,
          email: email,
          store_id: storeId,
          address_id: addressId,
          active: active,
        };
    
        try {
          // Send a POST request to the backend
          const response = await fetch('http://localhost:5000/addcustomer', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(customer),  // Send customer data in request body
          });
    
          // Check if the response is OK (status 200 or 201)
          if (response.ok) {
            setMessage('Customer added successfully!');
          } else {
            const errorData = await response.json();
            setMessage(`Error: ${errorData.error}`);
          }
        } catch (error) {
          console.error('Error adding customer:', error);
          setMessage('Error adding customer!');
        }
      };    
    //
    const updateCustomer = async (customerId, updatedData) => {
        try {
          // Debugging logs to check input values
          console.log('Customer ID:', customerId);
          console.log('Updated Data:', updatedData);
      
          if (!customerId) {
            throw new Error('Invalid customerId');
          }
          if (!updatedData) {
            throw new Error('Invalid updatedData');
          }
      
          const response = await fetch(`http://localhost:5000/upcustomer/${customerId}`, {
            method: 'PATCH', // Use PATCH to update
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData), // Send the updated customer data as JSON
          });
      
          if (!response.ok) {
            throw new Error(`Failed to update customer: ${response.statusText}`);
          }
      
          const data = await response.json();
      
          // Debugging response data
          console.log('Response data:', data);
      
          // Check if the message exists in the response data
          if (data.message) {
            console.log(data.message); // Success message
          } else {
            console.error('No message in response data.');
          }
      
          // Optionally, update the state to reflect the changes
          // For example, you can call setCustomers() or refetch customers
      
        } catch (error) {
          console.error('Error updating customer:', error);
        }
      };

      // Delete customer function
  const deleteCustomer = async (customerId) => {
    try {
      const response = await fetch(`http://localhost:5000/deletecustomer/${customerId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete customer');
      }

      const data = await response.json();
      console.log(data.message); // Log success message

      // Re-fetch the customer list after deletion
      fetchCustomers();

    } catch (error) {
      setErrorMessage('There was an error deleting the customer.');
      console.error('Error deleting customer:', error);
    }
  };
    // Fetch data from Flask backend
    //fetch(`/api/customers?page=${page}&per_page=3`);
    // `/customer?page=${currentPage}&per_page=${itemsPerPage}`
    const fetchCustomers = async () => {
        try {
            const response = await fetch(
              `http://localhost:5000/customer?page=${currentPage}&per_page=${itemsPerPage}&customer_id=${customerIdSearch}&first_name=${firstNameSearch}&last_name=${lastNameSearch}`
            );
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
      
            const data = await response.json();
            console.log('Fetched Data:', data);
      
            // Set the state with the fetched data
            setCustomers(data.customers);
            setTotalPages(Math.ceil(data.total / itemsPerPage)); // Calculate total pages
          
        } 
        catch (error) {
          console.error('There was an error fetching the data!', error);
        }
      };
      //
      /* Fetching Customer Rent Data */
        const fetchCustomerRentData = async (customerId) => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:5000/customer-rent-details/${customerId}`, {
                  method: 'GET',
                });
          
                if (!response.ok) {
                  throw new Error('Failed to get customer');
                }
                
                const data = await response.json();
                console.log('Fetched Data:', data);
                setMovies(data); // Set the fetched data into state
                setLoading(false); // Set loading to false when data is fetched
              } catch (error) {
                setErrorMessage('There was an error deleting the customer.');
                console.error('Error deleting customer:', error);
                setError(error.message); // Handle any error that occurs during fetch
                setLoading(false);
            }    
        }

        //
        

        //fetchCustomers();
      // Handle search field change
      const handleSearchChange = (e) => {
        const { name, value } = e.target;
        if (name === 'customerId') {
          setCustomerIdSearch(value);
        } else if (name === 'firstName') {
          setFirstNameSearch(value);
        } else if (name === 'lastName') {
          setLastNameSearch(value);
        }
      };
      
      // putting this back
      useEffect(() => {
        fetchCustomers();
      }, [currentPage, customerIdSearch, firstNameSearch, lastNameSearch, itemsPerPage]); // Fetch when any of these values change
      

      const handleReturn = async (customerId, filmTitle) => {
        // Logic to mark the movie as returned
        // This could involve updating the state, calling an API, etc.
        console.log(`Returning movie ${filmTitle} for customer ${customerId}`);
        // Optionally, update the status of the movie in the state
        const data = {
          customer_id: customerId,
          movie_title: filmTitle,
          rental_status: 'returned',
        };
        try {
          // Send the PATCH request
          const response = await fetch('http://localhost:5000/customer-rent-return', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json', // Specify that we're sending JSON data
            },
            body: JSON.stringify(data), // Convert the data object to a JSON string
          });
      
          // Check if the response is successful (status code 200-299)
          if (response.ok) {
            const responseData = await response.json(); // Parse the JSON response
            console.log('Movie status updated:', responseData);
            // You can update your UI or state based on the response here
          } else {
            console.error('Failed to update the rental status', response.statusText);
          }
        } 
        catch (error) {
          console.error('Error making PATCH request:', error);
        }
      };

        // Render loading or error message
        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>Error: {error}</div>;
        }
      
      // Handle page change (pagination)
      const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return; // Prevent invalid page numbers
        console.log("Page: ", page, ", Current page: ", currentPage)
        setCurrentPage(page); // Update the current page
        console.log("Page: ", page, ", Current page: ", currentPage)
        doPageChange();
      };

      function doPageChange() {
        //console.log("Current page: ", currentPage)
        fetchCustomers();
      }

      //

   return (
     <div className="p-6 bg-gray-100 min-h-screen">
         <Navbar />
       <h1 className="text-3xl font-bold text-center mb-4">
         This is the Customer page
       </h1>
       <h2 className="text-2xl font-semibold text-gray-800 mb-3">Customer List</h2>
       {/* Search form */}
      <form
        className="bg-white p-4 shadow-md rounded-lg mb-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        onSubmit={(e) => {
            console.log("I was press?");
          e.preventDefault();
          fetchCustomers(); // Trigger search manually if needed
        }}
      >
        <div>
          <label className="block text-gray-800 font-semibold mb-1">Customer ID:</label>
          <input
            className="w-full border-2 border-gray-300 bg-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            type="text"
            name="customerId"
            value={customerIdSearch}
            onChange={handleSearchChange}
          />
        </div>
        <div>
          <label className="block text-gray-800 font-semibold mb-1">First Name:</label>
          <input
            className="w-full border-2 border-gray-300 bg-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            type="text"
            name="firstName"
            value={firstNameSearch}
            onChange={handleSearchChange}
          />
        </div>
        <div>
          <label className="block text-gray-800 font-semibold mb-1">Last Name:</label>
          <input
            className="w-full border-2 border-gray-300 bg-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            type="text"
            name="lastName"
            value={lastNameSearch}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex items-end">
        <button type="submit"
        className="w-full bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition transform hover:scale-105">Search</button>
        </div>
      </form>

        {/* Display customers if there are any 1*/}
        {customers.length > 0 ? (
            <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {customers.map((customer) => (
                    <li key={customer.customer_id}
                    className="bg-white p-4 rounded-lg shadow-md border">
                        <p className="font-bold text-lg"><strong>Name:</strong> {customer.first_name} {customer.last_name}</p>
                        <p className="text-gray-600"><strong>Email:</strong> {customer.email}</p>
                        <p><strong>Active:</strong> {customer.active ? "Yes" : "No"}</p>
                        <p><strong className="font-semibold">Customer ID:</strong> {customer.customer_id}</p>
                        <p><strong className="font-semibold">Store ID:</strong> {customer.store_id}</p>
                        <p><strong className="font-semibold">Address ID:</strong> {customer.address_id}</p>
                        <p><strong className="font-semibold">Account Created:</strong> {new Date(customer.create_date).toLocaleDateString()}</p>
                        <p><strong className="font-semibold">Last Update:</strong> {new Date(customer.last_update).toLocaleDateString()}</p>
                        <button className="mt-3 bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition"
                         onClick={() => fetchCustomerRentData(customer.customer_id)}>View Rent Details</button>
                    </li>
                ))}
            </ul>
        ) : (
            <p className="text-gray-600 text-lg">No customers found.</p>
        )}
        {/* Pagination Controls */}
        <div className="mt-6 flex justify-between items-center">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 bg-gray-400 text-white rounded-md disabled:opacity-50">
            Previous
          </button>
          <span className="text-lg font-semibold"> Page {currentPage} of {totalPages} </span>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-400 text-white rounded-md disabled:opacity-50">
            Next
          </button>
        </div>
        
        {/* Rented Movie Details */}
        <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4">Customer Rental Detail List</h2>
        {movies.length > 0 ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {movies.map((movie) => (
                        <li key={movie.customer_id} className="bg-white p-4 shadow-md rounded-lg border border-gray-200">
                            <p className="text-lg font-semibold text-gray-900"><strong>Movie Title:</strong> {movie.movie_title}</p>
                            <p className="text-gray-700"><strong>Rental Date:</strong> {new Date(movie.rental_date).toLocaleDateString()}</p>
                            <p className={`text-sm font-medium ${movie.rental_status === 'Past Rental (Returned)' ? 'text-green-600' : 'text-red-600'}`}><strong>Rental Status:</strong> {movie.rental_status}</p>
                            <p className="text-gray-700"><strong>Return Date:</strong> {new Date(movie.return_date).toLocaleDateString()}</p>
                            {movie.rental_status !== 'Past Rental (Returned)' && (
                              <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition transform hover:scale-105" onClick={() => handleReturn(movie.customer_id, movie.movie_title)}>Return Movie</button>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-600 text-lg">No movies rented by this customer.</p>
            )}
      


      {/* Add New Customer Form */}
      {!isEditing && (
        <div className="bg-white p-6 shadow-md rounded-lg mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Add New Customer</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700">First Name:</label>
              <input
                className="w-full border-2 border-gray-300 bg-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">Last Name:</label>
              <input
                className="w-full border-2 border-gray-300 bg-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">Email:</label>
              <input
                className="w-full border-2 border-gray-300 bg-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">Store ID:</label>
              <input
                className="w-full border-2 border-gray-300 bg-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                type="number"
                value={storeId}
                onChange={(e) => setStoreId(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">Address ID:</label>
              <input
                className="w-full border-2 border-gray-300 bg-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                type="number"
                value={addressId}
                onChange={(e) => setAddressId(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">Active:</label>
              <input
                className="w-full border-2 border-gray-300 bg-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
            </div>
            <button type="submit" className="col-span-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-700 transition">Add Customer</button>
          </form>
        </div>
      )}

      {/* Edit Customer Form */}
      {isEditing && (
        <div className="bg-white p-6 shadow-md rounded-lg mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Edit Customer Information</h2>
          <form
           className="grid grid-cols-1 md:grid-cols-2 gap-4"
            onSubmit={(e) => {
                e.preventDefault(); // Prevent default form submission
                const updatedData = {
                firstName,
                lastName,
                email,
                storeId,
                addressId,
                active,
                };
                // Now call updateCustomer with the customerId and updatedData
                updateCustomer(customerId, updatedData);
            }}
            >
            <div>
              <label className="block font-medium text-gray-700">Customer ID:</label>
              <input
                className="w-full border-2 border-gray-300 bg-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                type="number"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">First Name:</label>
              <input
                className="w-full border-2 border-gray-300 bg-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">Last Name:</label>
              <input
                className="w-full border-2 border-gray-300 bg-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">Email:</label>
              <input
                className="w-full border-2 border-gray-300 bg-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">Store ID:</label>
              <input
                className="w-full border-2 border-gray-300 bg-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                type="number"
                value={storeId}
                onChange={(e) => setStoreId(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">Address ID:</label>
              <input
                className="w-full border-2 border-gray-300 bg-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                type="number"
                value={addressId}
                onChange={(e) => setAddressId(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">Active:</label>
              <input
                className="w-full border-2 border-gray-300 bg-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
            </div>
            <button type="submit" className="col-span-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-700 transition">Update Customer</button>
          </form>
        </div>
      )}

      {message && <p>{message}</p>}

      {/* Button to toggle between Add and Edit forms */}
      <button onClick={() => setIsEditing(!isEditing)} className="px-4 py-2 bg-gray-400 text-white rounded-md disabled:opacity-50">
        {isEditing ? 'Go to Add Customer' : 'Go to Edit Customer'}
      </button>

        {/* Delete Customers Thing */}

      <h1 className="text-xl font-bold text-red-700 mt-8">Customer Delete</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {customers.map((customer) => (
          <li key={customer.customer_id} className="bg-white p-4 rounded-lg shadow-md border">
            <p><strong>Name:</strong> {customer.first_name} {customer.last_name}</p>
            <p><strong>Email:</strong> {customer.email}</p>
            <button className="mt-2 bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition" onClick={() => deleteCustomer(customer.customer_id)}>Delete</button>
          </li>
        ))}
      </ul>

     </div>
   )
 }

 export default Customer