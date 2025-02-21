import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function UpdateUser() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    axios
      .get(`http://localhost:5000/users/${id}`)
      .then((result) => {
        setName(result.data.name);
        setEmail(result.data.email);
        setAge(result.data.age);
      })
      .catch((err) => console.log("Error fetching user:", err));

    axios
      .get("http://localhost:3001/getImage")
      .then((result) => {
        const userImage = result.data.find((user) => user.user_id == id);
        if (userImage) setExistingImage(userImage.image);
      })
      .catch((err) => console.log("Error fetching image:", err));
  }, [id]);

  const updateUser = async (e) => {
    e.preventDefault();
    if (!id) {
      console.error("User ID is missing!");
      return;
    }

    try {
      // Update name, email, and age in PostgreSQL
      await axios.put(`http://localhost:5000/users/${id}`, {
        name,
        email,
        age,
      });

      // Update image in MongoDB only if a new image is selected
      if (image) {
        const formData = new FormData();
        formData.append("user_id", id);
        formData.append("image", image);

        await axios.post("http://localhost:3001/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      navigate("/");
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  return (
    <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
      <div className="w-50 bg-white rounded p-3">
        <form onSubmit={updateUser}>
          <h2>Update User</h2>
          <div className="mb-2">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label>Age</label>
            <input
              type="number"
              placeholder="Enter Age"
              className="form-control"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label>Current Image</label>
            {existingImage && (
              <div>
                <img
                  src={`http://localhost:3001/images/${existingImage}`}
                  alt="User"
                  className="img-thumbnail"
                  width="150"
                />
              </div>
            )}
          </div>
          <div className="mb-2">
            <label>Update Image</label>
            <input
              type="file"
              accept=".png, .jpg, .jpeg"
              className="form-control"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          <button className="btn btn-success">Update</button>
        </form>
      </div>
    </div>
  );
}

export default UpdateUser;
