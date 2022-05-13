import React from "react";
import classes from "./Button.module.css";

export const Button = ({ text, handleClick, icon, color }) => {
  return (
    <button className={classes.custom} onClick={handleClick}>
      {text}
      {icon && (
        <img className={classes.icon} src={icon} alt='icon-inside-button' />
      )}
    </button>
  );
};
