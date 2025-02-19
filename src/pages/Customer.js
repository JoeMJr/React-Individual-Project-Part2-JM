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
        } catch (error) {
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
    
      // Fetch data when page or search parameters change
      useEffect(() => {
        fetchCustomers();
      }, [currentPage, customerIdSearch, firstNameSearch, lastNameSearch, itemsPerPage]); // Fetch when any of these values change

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
        setCurrentPage(page); // Update the current page
      };

   return (
     <div>
         <Navbar />
       <h1>
         This is a Customer page
       </h1>
       <h2>Customer List</h2>
       {/* Search form */}
      <form
        onSubmit={(e) => {
            console.log("I was press?");
          e.preventDefault();
          fetchCustomers(); // Trigger search manually if needed
        }}
      >
        <div>
          <label>Customer ID:</label>
          <input
            type="text"
            name="customerId"
            value={customerIdSearch}
            onChange={handleSearchChange}
          />
        </div>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={firstNameSearch}
            onChange={handleSearchChange}
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={lastNameSearch}
            onChange={handleSearchChange}
          />
        </div>
        <button type="submit">Search</button>
      </form>

        {/* Display customers if there are any */}
        {customers.length > 0 ? (
            <ul>
                {customers.map((customer) => (
                    <li key={customer.customer_id}>
                        <p><strong>Name:</strong> {customer.first_name} {customer.last_name}</p>
                        <p><strong>Email:</strong> {customer.email}</p>
                        <p><strong>Active:</strong> {customer.active ? "Yes" : "No"}</p>
                        <p><strong>Customer ID:</strong> {customer.customer_id}</p>
                        <p><strong>Store ID:</strong> {customer.store_id}</p>
                        <p><strong>Address ID:</strong> {customer.address_id}</p>
                        <p><strong>Account Created:</strong> {new Date(customer.create_date).toLocaleDateString()}</p>
                        <p><strong>Last Update:</strong> {new Date(customer.last_update).toLocaleDateString()}</p>
                        <button onClick={() => fetchCustomerRentData(customer.customer_id)}>View Rent Details</button>
                    </li>
                ))}
            </ul>
        ) : (
            <p>No customers found.</p>
        )}

        {/* Rented Movie Details */}
        {movies.length > 0 ? (
                <ul>
                    {movies.map((movie) => (
                        <li key={movie.customer_id}>
                            <p><strong>Movie Title:</strong> {movie.movie_title}</p>
                            <p><strong>Rental Date:</strong> {new Date(movie.rental_date).toLocaleDateString()}</p>
                            <p><strong>Rental Status:</strong> {movie.rental_status}</p>
                            <p><strong>Return Date:</strong> {new Date(movie.return_date).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No movies rented by this customer.</p>
            )}
      {/* Pagination Controls */}
      <div>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span> Page {currentPage} of {totalPages} </span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>


      {/* Add New Customer Form */}
      {!isEditing && (
        <div>
          <h2>Add New Customer</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>First Name:</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Last Name:</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Store ID:</label>
              <input
                type="number"
                value={storeId}
                onChange={(e) => setStoreId(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Address ID:</label>
              <input
                type="number"
                value={addressId}
                onChange={(e) => setAddressId(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Active:</label>
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
            </div>
            <button type="submit">Add Customer</button>
          </form>
        </div>
      )}

      {/* Edit Customer Form */}
      {isEditing && (
        <div>
          <h2>Edit Customer Information</h2>
          <form
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
              <label>Customer ID:</label>
              <input
                type="number"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              />
            </div>
            <div>
              <label>First Name:</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Last Name:</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Store ID:</label>
              <input
                type="number"
                value={storeId}
                onChange={(e) => setStoreId(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Address ID:</label>
              <input
                type="number"
                value={addressId}
                onChange={(e) => setAddressId(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Active:</label>
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
            </div>
            <button type="submit">Update Customer</button>
          </form>
        </div>
      )}

      {message && <p>{message}</p>}

      {/* Button to toggle between Add and Edit forms */}
      <button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? 'Go to Add Customer' : 'Go to Edit Customer'}
      </button>

        {/* Delete Customers Thing */}

      <h1>Customer Delete</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <ul>
        {customers.map((customer) => (
          <li key={customer.customer_id}>
            <p><strong>Name:</strong> {customer.first_name} {customer.last_name}</p>
            <p><strong>Email:</strong> {customer.email}</p>
            <button onClick={() => deleteCustomer(customer.customer_id)}>Delete</button>
          </li>
        ))}
      </ul>

     </div>
   )
 }

 export default Customer