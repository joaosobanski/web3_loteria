import React from 'react';
import classes from './Label.module.css'

export const Label = ({ text }) => {
    return (
        <label className={classes['label']}>{text}</label>
    )
}
