import React from "react";
import style from "./Error.module.css";

function Error() {
  return (
    <div className={style.error}>
      <p className={style.oops}>Oops!</p>
      <p className={style.message}>Something went wrong.</p>
      <p className={style.message}>Please try again later.</p>
    </div>
  );
}

export default Error;
