import React, { useEffect, useState } from "react";
import classes from "./Schedule.module.css";
import GreyButton from "../../Buttons/GreyButton";
import RightChevron from "../../../assets/Icons/RightChevron";
import {
  failToast,
  schedulingInputsValidater,
  successToast,
} from "../../../Utils/utils";
import SchedulesInput from "./../../Inputs/SchedulesInput/SchedulesInput";
import DurationInput from "./DurationInput";
import TimeInput from "../../Inputs/SchedulesInput/TimeInput";

function Schedule(props) {
  const [inputs, setInputs] = useState(props.schedules || []);
  const [inputsShowList, setInputsShowList] = useState([]);

  useEffect(() => {
    props.setScheduleHandler(inputs);
  }, [inputs]);

  function validateInputs() {
    const selectedSchedule = inputs.inputs.find((el) => el.selected);
    if (selectedSchedule) {
      return schedulingInputsValidater(selectedSchedule);
    }
    failToast("Please set correct Scheduling Inputs");
    return false;
  }

  function nextHandler() {
    if (validateInputs()) {
      successToast("Schedules saved");
      props.nextHandler("Save");
    }
  }

  const showDivHandler = (index) => {
    if (inputsShowList.includes(index)) {
      setInputsShowList((prevstate) => prevstate.filter((el) => el !== index));
    } else {
      setInputsShowList((prevstate) => [...prevstate, index]);
    }
  };
  function toggleHandler(index) {
    setInputs((prevState) => {
      return {
        ...prevState,
        inputs: prevState.inputs.map((item, i) =>
          i === index
            ? { ...item, selected: true }
            : { ...item, selected: false }
        ),
      };
    });
  }
  function SetDurationHandler(duration, index) {
    console.log("Entered SetDurationHandler");
    setInputs((prevState) => {
      return {
        ...prevState,
        inputs: prevState.inputs.map((item, i) =>
          i === index ? { ...item, durationInput: duration } : item
        ),
      };
    });
  }

  function timeChangeHandler(value, index, type) {
    console.log("Entered timeChangeHandler");
    setInputs((prevState) => {
      return {
        ...prevState,
        inputs: prevState.inputs.map((el, i) =>
          i === index
            ? type === "exact"
              ? { ...el, timeInput: value }
              : type === "start"
              ? { ...el, startinput: value }
              : { ...el, endinput: value }
            : el
        ),
      };
    });
  }
  function setMultipleRunCount(count, index) {
    const num = parseInt(count, 10) || 0;
    setInputs((prevState) => ({
      ...prevState,
      inputs: prevState.inputs.map((item, i) => {
        if (i === index) {
          const arr = Array.isArray(item.runStartTimes)
            ? item.runStartTimes.slice()
            : [];
          if (num > arr.length) {
            for (let k = arr.length; k < num; k++) arr.push("");
          } else {
            arr.length = num;
          }
          return { ...item, numberOfRuns: num, runStartTimes: arr };
        }
        return item;
      }),
    }));
  }

  function setMultipleRunTime(value, index, runIdx) {
    setInputs((prevState) => ({
      ...prevState,
      inputs: prevState.inputs.map((item, i) => {
        if (i === index) {
          const arr = Array.isArray(item.runStartTimes)
            ? item.runStartTimes.slice()
            : [];
          arr[runIdx] = value;
          return { ...item, runStartTimes: arr };
        }
        return item;
      }),
    }));
  }

  function renderInputContent(el, index) {
    switch (el.type) {
      case "DurationWithExactStartTime":
        return (
          <div className={classes.durationHandlerContainer}>
            <div className={classes.durationToggleConatiner}>
              <label className={classes.switch}>
                <input
                  type="checkbox"
                  checked={el.selected}
                  onChange={() => {
                    toggleHandler(index);
                  }}
                />
                <span className={classes.slider}></span>
              </label>
              <p className={classes.InputName}>{el.firstInputname}</p>
            </div>
            {el.selected && (
              <>
                <DurationInput
                  description={el.firstInputdescription}
                  initialValue={el.durationInput}
                  classes={classes}
                  onChange={(totalMinutes) => {
                    SetDurationHandler(totalMinutes, index);
                  }}
                />
                <div className={classes.durationHandlerContainer}>
                  <p className={classes.InputName}>{el.SecondHeading}</p>
                  <p className={classes.InputName}>{el.secondInputName}</p>
                  <div className={classes.descriptionContainer}>
                    <p>{el.secondInputdescription}</p>
                  </div>
                  <div className={classes.duarationMainConatiner}>
                    <TimeInput
                      value={el.timeInput}
                      lable={"Start Time"}
                      timeChangeHandler={(value) => {
                        timeChangeHandler(value, index, "exact");
                      }}
                    />
                  </div>
                </div>
              </>
            )}
            {el.firstInputSubDescription && (
              <p className={classes.subDescription}>
                {el.firstInputSubDescription}
              </p>
            )}
          </div>
        );
      case "DurationWithTimeWindow":
        return (
          <div className={classes.durationHandlerContainer}>
            <div className={classes.durationToggleConatiner}>
              <label className={classes.switch}>
                <input
                  type="checkbox"
                  checked={el.selected}
                  onChange={() => {
                    toggleHandler(index);
                  }}
                />
                <span className={classes.slider}></span>
              </label>
              <p className={classes.InputName}>{el.firstInputname}</p>
            </div>
            {el.selected && (
              <>
                <DurationInput
                  description={el.firstInputdescription}
                  initialValue={el.durationInput}
                  classes={classes}
                  onChange={(totalMinutes) => {
                    SetDurationHandler(totalMinutes, index);
                  }}
                />
                <div className={classes.durationHandlerContainer}>
                  <p className={classes.InputName}>{el.SecondHeading}</p>
                  <p className={classes.InputName}>{el.secondInputName}</p>
                  <div className={classes.descriptionContainer}>
                    <p>{el.secondInputdescription}</p>
                  </div>
                  <div className={classes.duarationMainConatiner}>
                    <TimeInput
                      value={el.startinput}
                      lable={"Start Time"}
                      timeChangeHandler={(value) => {
                        timeChangeHandler(value, index, "start");
                      }}
                    />
                    <TimeInput
                      value={el.endinput}
                      lable={"End Time"}
                      timeChangeHandler={(value) => {
                        timeChangeHandler(value, index, "end");
                      }}
                    />
                  </div>
                </div>
              </>
            )}
            {el.firstInputSubDescription && (
              <p className={classes.subDescription}>
                {el.firstInputSubDescription}
              </p>
            )}
          </div>
        );
      case "ExactStartTime":
        return (
          <div className={classes.durationHandlerContainer}>
            <div className={classes.durationToggleConatiner}>
              <label className={classes.switch}>
                <input
                  type="checkbox"
                  checked={el.selected}
                  onChange={() => {
                    toggleHandler(index);
                  }}
                />
                <span className={classes.slider}></span>
              </label>
              <p className={classes.InputName}>{el.firstInputname}</p>
            </div>
            {el.selected && (
              <div className={classes.fixedStartTimeHandler}>
                <div className={classes.descriptionContainer}>
                  <p>{el.firstInputdescription}</p>
                </div>
                <TimeInput
                  value={el.timeInput}
                  lable={"Start Time"}
                  timeChangeHandler={(value) => {
                    timeChangeHandler(value, index, "exact");
                  }}
                />
              </div>
            )}
            {el.firstInputSubDescription && (
              <p className={classes.subDescription}>
                {el.firstInputSubDescription}
              </p>
            )}
          </div>
        );
      case "EveryDayAutomaticRun":
        return (
          <div className={classes.durationHandlerContainer}>
            <div className={classes.durationToggleConatiner}>
              <label className={classes.switch}>
                <input
                  type="checkbox"
                  checked={el.selected}
                  onChange={() => {
                    toggleHandler(index);
                  }}
                />
                <span className={classes.slider}></span>
              </label>
              <p className={classes.InputName}>{el.firstInputname}</p>
            </div>
            {el.selected && (
              <>
                <div className={classes.fixedStartTimeHandler}>
                  <div className={classes.descriptionContainer}>
                    <p>{el.firstInputdescription}</p>
                  </div>
                  <div className={classes.duarationMainConatiner}>
                    <TimeInput
                      value={el.startinput}
                      lable={"Start Time"}
                      timeChangeHandler={(value) => {
                        timeChangeHandler(value, index, "start");
                      }}
                    />
                    <TimeInput
                      value={el.endinput}
                      lable={"End Time"}
                      timeChangeHandler={(value) => {
                        timeChangeHandler(value, index, "end");
                      }}
                    />
                  </div>
                </div>
              </>
            )}
            {el.firstInputSubDescription && (
              <p className={classes.subDescription}>
                {el.firstInputSubDescription}
              </p>
            )}
          </div>
        );
      case "MultipleRunTimes":
        return (
          <div className={classes.durationHandlerContainer}>
            <div className={classes.durationToggleConatiner}>
              <label className={classes.switch}>
                <input
                  type="checkbox"
                  checked={el.selected}
                  onChange={() => {
                    toggleHandler(index);
                  }}
                />
                <span className={classes.slider}></span>
              </label>
              <p className={classes.InputName}>
                {el.firstInputname || el.Heading}
              </p>
            </div>
            {el.selected && (
              <>
                {el.firstInputdescription && (
                  <div className={classes.descriptionContainer}>
                    <p>{el.firstInputdescription}</p>
                  </div>
                )}
                <div className={classes.duarationMainConatiner}>
                  <div className={classes.inputoutermain}>
                    <label className={classes.label}>How many times?</label>
                    <div className={classes.Input}>
                      <input
                        type="number"
                        min="0"
                        value={el.numberOfRuns || 0}
                        onChange={(e) =>
                          setMultipleRunCount(e.target.value, index)
                        }
                      />
                    </div>
                  </div>
                </div>
                {Array.isArray(el.runStartTimes) &&
                  el.runStartTimes.map((t, tIdx) => (
                    <div
                      key={tIdx}
                      className={classes.duarationMainConatiner}
                      style={{ marginTop: "8px" }}
                    >
                      <TimeInput
                        value={t}
                        lable={`Run ${tIdx + 1} Start Time`}
                        timeChangeHandler={(value) =>
                          setMultipleRunTime(value, index, tIdx)
                        }
                      />
                    </div>
                  ))}
              </>
            )}
            {el.firstInputSubDescription && (
              <p className={classes.subDescription}>
                {el.firstInputSubDescription}
              </p>
            )}
          </div>
        );

      default:
        return <p>Unknown input type</p>;
    }
  }

  return (
    <div className={classes.main}>
      <div className={classes.inputsContainer}>
        {inputs.inputs.map((el, index) => (
          <div className={classes.inputsBtnContainer} key={index}>
            <button
              className={`${classes.Inputbutton} ${
                inputsShowList.includes(index) ? classes.opened : ""
              }`}
              onClick={() => showDivHandler(index)}
            >
              <div className={classes.chevronCont}>
                <RightChevron
                  class={inputsShowList.includes(index) ? "rotate" : ""}
                />
              </div>
              <p>{el.Heading}</p>
            </button>
            {inputsShowList.includes(index) && (
              <div className={classes.hiddendiv}>
                {
                  <div className={classes.hiddenDivInnerMain}>
                    {renderInputContent(el, index)}
                  </div>
                }
              </div>
            )}
          </div>
        ))}
      </div>
      <GreyButton handler={nextHandler}>Next</GreyButton>
    </div>
  );
}

export default Schedule;
