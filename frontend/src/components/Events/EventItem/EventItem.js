import React, { Fragment, useContext, useState } from "react";
import AuthContext from "../../../context/auth-context";
import "./EventItem.css";
import moment from "moment";
function EventItem({ _id, title, description, price, date, creatorId }) {
  const authContext = useContext(AuthContext);

  const [viewingDetails, setViewingDetails] = useState(false);

  let authorOrDetails;

  function toggleViewDetails() {
    setViewingDetails(!viewingDetails);
  }

  if (authContext.userId === creatorId) {
    authorOrDetails = <p>You are the owner of this event.</p>;
  } else {
    authorOrDetails = (
      <button className="btn" onClick={toggleViewDetails}>
        {viewingDetails ? "Hide Details" : "View Details"}
      </button>
    );
  }

  return (
    <Fragment>
      <li className="events__list-item">
        <div>
          <h1>{title}</h1>
          <div style={{ display: viewingDetails ? "block" : "none" }}>
            <p>{description}</p>
          </div>
        </div>
        <div>
          <p> {moment(date).format("MMMM Do YYYY, h:mm:ss a")} </p>
          {authorOrDetails}
          <div style={{ display: viewingDetails ? "block" : "none" }}>
            <p>£{price.toFixed(2)}</p>
          </div>
        </div>
      </li>
    </Fragment>
  );
}

export default EventItem;
