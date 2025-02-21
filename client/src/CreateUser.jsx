import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreateUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const Submit = async (e) => {
    e.preventDefault();

    try {
      // First API call: Create user
      const userResponse = await axios.post("http://localhost:5000/users", {
        name,
        email,
        age,
      });
      const user_id = userResponse.data.user_id;

      // console.log(isInteger)
      console.log("User created:", userResponse.data);

      if (image) {
        // Prepare form data for image upload
        const formData = new FormData();
        formData.append("image", image);
        formData.append("user_id", user_id); // Attach the user_id

        // Second API call: Upload image
        const uploadResponse = await axios.post(
          "http://localhost:3001/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Image uploaded:", uploadResponse.data);
      }

      // Navigate after success
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
      <div className="w-50 bg-white rounded p-3">
        <form onSubmit={Submit} encType="multipart/form-data">
          <h2>Add User</h2>
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
            <label>Image</label>
            <input
              type="file"
              // accept=".png, .jpg, .jpeg"
              name="image"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          <button className="btn btn-success" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateUser;
