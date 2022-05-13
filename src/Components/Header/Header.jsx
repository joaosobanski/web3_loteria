import React from "react";
import classes from "./Header.module.css";
import MetamaskIcon from "../../Assets/metamask.png";
import { Button } from "../Button/Button";

function Header({ isLogged, connectWallet }) {
  return (
    <header className={classes.container}>
      <div className={`${classes.left} ${classes.divider}`}>
        <h2 className={classes.text}>Web3 Lottery</h2>
      </div>
      <div className={`${classes.right} ${classes.divider}`}>
        <div className={classes.text}>Project</div>
        <div className={classes.text}>Team</div>
        {isLogged ? null : (
          <div>
            <Button
              text={"Connect Wallet"}
              icon={MetamaskIcon}
              handleClick={connectWallet}
            />
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
