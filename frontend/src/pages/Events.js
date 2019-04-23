import React, {
  useState,
  Fragment,
  useRef,
  useContext,
  useEffect
} from "react";
// Styling
import "./Events.css";
// Components
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import EventList from "../components/Events/EventList/EventList";
// Context
import AuthContext from "../context/auth-context";

export default function EventsPage(props) {
  const GraphQLEndpoint = "http://localhost:4000/graphiql";

  const [creating, setCreating] = useState(false);
  const [events, setEvents] = useState([]);

  const contextAuth = useContext(AuthContext);

  const titleRef = useRef();
  const priceRef = useRef(null);
  const dateRef = useRef(null);
  const descriptionRef = useRef(null);

  useEffect(() => {
    getAllEvents();
  }, []);

  function getAllEvents() {
    const requestBody = {
      query: `
            query{
                events{
                  _id
                  title 
                  description
                  price
                  date
                  creator{
                    _id
                    email
                  }
                }
              }
            `
    };
    fetch(GraphQLEndpoint, {
      // All GraphQL queries require POST as they need a message body
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: { "Content-Type": "application/json" }
    })
      .then(res => {
        // 200 == success, 201 == created
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(resData => {
        if (resData) {
          setEvents(resData.data.events);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  function startCreateEventHandler() {
    setCreating(true);
  }

  function modalCancelHandler() {
    setCreating(false);
  }

  function modalConfirmHandler() {
    setCreating(false);

    const title = titleRef.current.value;
    const price = +priceRef.current.value;
    const date = dateRef.current.value;
    const description = descriptionRef.current.value;

    if (
      title.trim().length === 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }
    const requestBody = {
      query: `
                mutation {
                    createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
                      _id
                      title
                      description
                      date
                      price
                      creator {
                        _id
                        email
                      }
                    }
                  }
                `
    };

    const token = contextAuth.token;

    fetch(GraphQLEndpoint, {
      // All GraphQL queries require POST as they need a message body
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        // 200 == success, 201 == created
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(resData => {
        if (resData) {
          console.log(resData);
          getAllEvents();
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  return (
    <Fragment>
      {creating && <Backdrop />}
      {creating && (
        <Modal
          title="Add Event"
          canConfirm
          canCancel
          onCancel={modalCancelHandler}
          onConfirm={modalConfirmHandler}
        >
          <form>
            <div className="form-control">
              <label htmlFor="title"> Title </label>
              <input type="text" id="title" ref={titleRef} />
            </div>
            <div className="form-control">
              <label htmlFor="price"> Price </label>
              <input type="number" id="price" ref={priceRef} />
            </div>
            <div className="form-control">
              <label htmlFor="date"> Date </label>
              <input type="datetime-local" id="date" ref={dateRef} />
            </div>
            <div className="form-control">
              <label htmlFor="description"> Description </label>
              <textarea id="description" rows="4" ref={descriptionRef} />
            </div>
          </form>
        </Modal>
      )}
      {contextAuth.token && (
        <div className="events-control">
          <p> Share Your Own Events! </p>
          <button className="btn" onClick={startCreateEventHandler}>
            Create Event
          </button>
        </div>
      )}
      <EventList eventData={events} />
    </Fragment>
  );
}
