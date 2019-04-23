import React, { useState, Fragment, useRef } from "react";
import "./Events.css"

import Modal from "../components/Modal/Modal"
import Backdrop from "../components/Backdrop/Backdrop"

export default function EventsPage(props){

    const [ creating, setCreating ] = useState(false)

    const titleRef = useRef()
    const priceRef = useRef(null)
    const dateRef = useRef(null)
    const descriptionRef = useRef(null)

    function startCreateEventHandler(){
        setCreating(true)
    }

    function modalCancelHandler(){
        setCreating(false)
    }

    function modalConfirmHandler(){
        setCreating(false)

        const title = titleRef.current.value
        const price = priceRef.current.value
        const date = dateRef.current.value
        const description = descriptionRef.current.value

        const event = { title, price, date, description }
    }

    return(
        <Fragment>
            { creating && <Backdrop /> }
            { creating && <Modal 
            title="Add Event" 
            canConfirm 
            canCancel
            onCancel={ modalCancelHandler }
            onConfirm={ modalConfirmHandler }
            >
                <form>
                    <div className="form-control">
                        <label htmlFor="title"> Title </label>
                        <input type="text" id="title" ref={ titleRef }></input>
                    </div>
                    <div className="form-control">
                        <label htmlFor="price"> Price </label>
                        <input type="number" id="price" ref={ priceRef }></input>
                    </div>
                    <div className="form-control">
                        <label htmlFor="date"> Date </label>
                        <input type="date" id="date" ref={ dateRef }></input>
                    </div>
                    <div className="form-control">
                        <label htmlFor="description"> Description </label>
                        <textarea id="description" rows="4" ref={ descriptionRef }/>
                    </div>
                </form>
            </Modal>}
            <div className="events-control">
        <p> Share Your Own Events! </p>
            <button className="btn" onClick={startCreateEventHandler}> Create Event </button>
        </div>
        </Fragment>
    )
} 