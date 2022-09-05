import "./firebase_messaging.js";
import "./App.css";
import React, { useState } from "react";
import MarketHome from "./pages/MarketHome.jsx";
import RestaurantHome from "./pages/RestaurantHome.jsx";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  // React States
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isMarket, setIsMarket] = useState(false);

  // User Login info
  const database = [
    {
      username: "market",
      password: "market",
    },
    {
      username: "restaurant",
      password: "restaurant",
    },
  ];

  const errors = {
    uname: "invalid username",
    pass: "invalid password",
  };

  const handleSubmit = (event) => {
    //Prevent page reload
    event.preventDefault();

    var { uname, pass } = document.forms[0];

    // Find user login info
    const userData = database.find((user) => user.username === uname.value);

    // Compare user info
    if (userData) {
      if (userData.password !== pass.value) {
        // Invalid password
        setErrorMessages({ name: "pass", message: errors.pass });
      } else {
        setIsSubmitted(true);
        if (userData.username === "market") {
          setIsMarket(true);
        } else {
          setIsMarket(false);
        }
      }
    } else {
      // Username not found
      setErrorMessages({ name: "uname", message: errors.uname });
    }
  };

  // Generate JSX code for error message
  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  // JSX code for login form
  const renderForm = (
    <div className="login-form">
      <div className="title">Şipşak Restaurant Giriş</div>
      <div className="form">
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label>Kullanıcı Adı </label>
            <input type="text" name="uname" required />
            {renderErrorMessage("uname")}
          </div>
          <div className="input-container">
            <label>Şifre </label>
            <input type="password" name="pass" required />
            {renderErrorMessage("pass")}
          </div>
          <div className="button-container">
            <input type="submit" />
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div>
      {isSubmitted ? (
        <Navbar bg="success" variant="dark">
          <Container>
            <Navbar.Brand href="#home">ŞipŞak</Navbar.Brand>
            <Nav className="me-auto"></Nav>
          </Container>
        </Navbar>
      ) : null}
      <div className="app">
        {isSubmitted ? (
          isMarket ? (
            <MarketHome></MarketHome>
          ) : (
            <RestaurantHome></RestaurantHome>
          )
        ) : (
          renderForm
        )}
      </div>
    </div>
  );
}

export default App;
