import React from "react";

export default function FormRadioGroup(props) {
  const { name, label, values, onChange, onBlur, error, touched } = props;
  return (
    <>
      <span className="label">{label}</span>
      <div className="gender">
        {values.map((item, key) => {
          return (
            <div key={key}>
              <input
                type="radio"
                name={name}
                value={item.value}
                id={item.value}
                onChange={onChange}
                onBlur={onBlur}
              />
              <label className="radio-label" htmlFor={item.value}>
                {item.label}
              </label>
            </div>
          );
        })}
      </div>
      {error && touched ? <span>{error}</span> : null}
    </>
  );
}
