import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import StarRating from "./star-rating";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating
      maxRating={5}
      message={["terrible", "bad", "okay", "good", "amazing"]}
    />
    <StarRating size={25} color="red" /> */}
  </React.StrictMode>
);
