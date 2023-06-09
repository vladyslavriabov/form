import React from "react";

export default function FormList(props) {
  const { name, label, onChange, value, error, touched, data } = props;
  return (
    <>
      <label>{value && label}</label>
      <select
        name={name}
        onChange={onChange}
        value={value}
        className={data.length === 0 ? "nodata" : ""}
      >
        <option value="default">{label}</option>
        {data.length > 0 &&
          data.map((item) => (
            <option key={item.id} value={item.id}>
              {`${item.name}${item.surname ? " " + item.surname : ""}`}
            </option>
          ))}
      </select>
      {error && touched ? <span>{error}</span> : null}
    </>
  );
}
