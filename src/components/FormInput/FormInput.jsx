import React from "react";
import InputMask from "react-input-mask";

export default function FormInput(props) {
  const { id, touched, label, error, ...rest } = props;
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <InputMask id={id} {...rest} />
      {error && touched ? <span>{error}</span> : null}
    </>
  );
}
