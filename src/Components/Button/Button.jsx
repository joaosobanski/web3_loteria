
import React from 'react';
import classes from './Button.module.css'

export const Button = ({ text, handleClick }) => {
    return (
        //<button className={`${classes['custom-btn']} ${classes['btn-7']}`} onClick={handleClick}>{text}</button>
        <button onClick={handleClick}>{text}</button>
    )
}