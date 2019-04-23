import React, { Fragment } from "react";
import "./EventItem.css";

function EventItem({ _id, title, description, price, date }) {
  return (
    <Fragment>
      <li className="events__list-item" key={_id}>
        <p> {title} </p>
        <p> {description} </p>
        <p> £ {price} </p>
        <p> {date} </p>
      </li>
    </Fragment>
  );
}

export default EventItem;
