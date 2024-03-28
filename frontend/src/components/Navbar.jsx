import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const auth = localStorage.getItem("user");
  console.log(auth);

  const navigate = useNavigate();
  const logout = () => {
    console.log("apple");
    localStorage.clear();
    navigate("/");
  };
  return (
    <>
      <div>
        <img
          src="https://th.bing.com/th/id/R.d7b678f617404881280fb7b3d855ff41?rik=DJ%2bSOV9hwPnyUw&pid=ImgRaw&r=0"
          alt="logo"
          className="logo"
        />
        {auth ? (
          <ul className="nav-ul">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/add">Add Product</Link>
            </li>
            <li>
              <Link to="/update">Update Product</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link onClick={logout} to="/signup">
                Logout ({JSON.parse(auth).name})
              </Link>
            </li>
          </ul>
        ) : (
          <ul className="nav-ul nav-right">
            <li>
              <Link to="/signup">Sign Up</Link>
            </li>

            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        )}
      </div>
    </>
  );
};

export default Navbar;
