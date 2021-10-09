import React from 'react'
import profilePng from "../../images/Profile.png"
import { Rating } from "@material-ui/lab";

const ReviewCard = ({ review }) => {
    // const options = {
    //     edit: false,
    //     color: "rgba(20,20,20,0,0.1)",
    //     activeColor: "tomato",
    //     value: Number(review.rating),
    //     size: window.innerWidth < 600 ? 20 : 25,
    //     isHalf: true
    // }
    const options = { size: "medium", value: Number(review.rating), readOnly: true, precision: 0.5, };
    return (
        <div className="reviewCard">
            <img src={profilePng} alt="User" />
            <p> {review.name} </p>
            <Rating {...options} />
            <span> {review.comment} </span>
        </div>
    )
}

export default ReviewCard
