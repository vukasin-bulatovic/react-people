import React from 'react'

const Footer = (props) => {
  
    return (
        <footer>
            <h3>{props.title} {props.year}</h3>
            {localStorage.getItem('date') !== null ? <p>Last updated: {props.time}</p> : null}
        </footer>
    )
}

export default Footer