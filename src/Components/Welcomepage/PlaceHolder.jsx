import React from "react";
import ethreum from "../../Assets/ethereum.png";
import classes from "./PlaceHolder.module.css";

function PlaceHolder() {
  return (
    <div className={classes.container}>
      <h3>Welcome to Web3 Lottery!</h3>
      <span>Please connect your wallet to have access to our contract.</span>
      <a href='https://discord.gg/E3cwwwEM' target='_blank'>
        <img className={classes.logo} src={ethreum} alt='ethereum-logo' />
      </a>
    </div>
  );
}

export default PlaceHolder;
