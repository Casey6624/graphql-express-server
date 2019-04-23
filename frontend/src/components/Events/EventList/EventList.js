import React, { Fragment } from "react";
import "./EventList.css";
import EventItem from "../EventItem/EventItem";

function EventList({ eventData }) {
  return (
    <Fragment>
      <ul className="events__list">
        {eventData.map(event => (
          <EventItem
            key={event._id}
            _id={event._id}
            title={event.title}
            description={event.description}
            price={event.price}
            date={event.date}
            creatorId={event.creator._id}
          />
        ))}
      </ul>
    </Fragment>
  );
}

export default EventList;
