import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Users() {
  const [users, setUsers] = useState([]);
  const [userImages, setUserImages] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000");
        setUsers(response.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    const fetchImages = async () => {
      try {
        const response = await axios.get("http://localhost:3001/getImage");

				// const userImage = response.data.find((user) => user.user_id == id);
				// if (userImage) setExistingImage(userImage.image);


        const imagesMap = {};
        response.data.forEach((user) => {
          imagesMap[user.user_id] = user.image;
        });

				console.log(response);
        setUserImages(imagesMap);

				console.log(imagesMap);

				// axios
				// .get("http://localhost:3001/getImage")
				// .then((result) => {
				// 	const userImage = result.data.find((user) => user.user_id == id);
				// 	if (userImage) setExistingImage(userImage.image);
				// })
				// .catch((err) => console.log("Error fetching image:", err));



      } catch (err) {
        console.error("Error fetching images:", err);
      }
    };

    fetchImages();

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!isConfirmed) return;

    try {
      // Delete user from PostgreSQL
      await axios.delete(`http://localhost:5000/users/${id}`);

      // Delete user image from MongoDB
      await axios.delete(`http://localhost:3001/deleteImage/${id}`);

      // Remove user from UI without reloading
      setUsers((prevUsers) => prevUsers.filter((user) => user.user_id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  return (
    <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
      <div className="w-50 bg-white rounded p-3">
        <Link to="/create" className="btn btn-success mb-2">
          Add +
        </Link>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.user_id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.age}</td>
                <td>
                  {userImages[user.user_id] ? (
                    <img
                      src={`http://localhost:3001/images/${
                        userImages[user.user_id]
                      }`}
                      alt="User"
                      width="50"
                      height="50"
                      className=""
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>
                  <Link
                    to={`/update/${user.user_id}`}
                    className="btn btn-success me-2"
                  >
                    Update
                  </Link>
                  <button
                    onClick={() => handleDelete(user.user_id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;
