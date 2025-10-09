import React from "react";
import Classes from "./RadioOptions.module.css";

function RadioOptions(props) {
  const { options, initialValue, handler, description } = props;

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Description */}
      <div className={Classes.description}>
        <p>{description}</p>
      </div>

      {/* Options Container */}
      <div className={Classes.optionsContainer}>
        {options.map((option) => (
          <label key={option} className={Classes.labelWrapper}>
            <input
              type="radio"
              name={props.name}
              value={option}
              checked={props.value === option}
              onChange={() => handler(option)}
              className={Classes.randioButton}
            />
            <span className={Classes.optionText}>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default RadioOptions;
