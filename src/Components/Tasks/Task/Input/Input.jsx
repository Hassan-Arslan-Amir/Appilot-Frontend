// export default Input;
import RightChevron from "../../../../assets/Icons/RightChevron";
import GreyButton from "../../../Buttons/GreyButton";
import classes from "./Input.module.css";
import { act, useEffect, useState } from "react";
import { successToast, failToast } from "../../../../Utils/utils";
import { Table } from "lucide-react";
import CompleteOverlay from "../../../Overlay/CompleteOverlay";
import UserinteractionTable from "../../../Tables/userInteracTable/UserinteractionTable";
import BlueButton from "../../../Buttons/BlueButton";
import KeywordInput from "../../../Inputs/PositiveandNegativekeywordInput";
import ToggleInput from "../../../Inputs/ToggleInput";
import InputText from "../../../Inputs/InputText";
import DurationInput from "../../Schedule/DurationInput";
import NumberInput from "../../Schedule/NumberInput";
import LinkButton from "../../../Links/LinkButton";
import InputWithButton from "../../../Inputs/InputWithButton";
import RadioOptions from "../RadioOptions";
import Cross from "../../../../assets/svgs/Cross";
import CustomChevronUp from "../../../../assets/svgs/ChevronUp";
import CustomChevronDown from "../../../../assets/svgs/ChevronDown";

// Helper to get today's date in DD/MM/YYYY
function getTodayDDMMYYYY() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}
// Helper to check if a date string is today
function isToday(dateStr) {
  return dateStr === getTodayDDMMYYYY();
}
function Input(props) {
  const [inputs, setInputs] = useState(props.inputs ? props.inputs : null);
  const [inputsShowList, setInputsShowList] = useState([]);
  const [openItems, setOpenItems] = useState([]);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const toggleAccordion = (value) => {
    setOpenItems((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };
  const [showUserInteractionTable, setshowUserInteractionTable] =
    useState(false);

  useEffect(() => {
    props.setInputsHandler(inputs);
  }, [inputs]);

  const NextHandler = async () => {
    // Validate minSleepTime and maxSleepTime
    let isValid = true;

    inputs.inputs.forEach((item) => {
      item.inputs.forEach((input) => {
        if (input.type === "toggleKeywordsAndGap" && input.input) {
          const { minSleepTime, maxSleepTime } = input;

          if (
            (minSleepTime > 0 || maxSleepTime > 0) &&
            (minSleepTime === 0 || maxSleepTime === 0)
          ) {
            failToast("Please set both Min and Max Sleep Time.");
            isValid = false;
          } else if (minSleepTime > maxSleepTime) {
            failToast("Min Sleep Time should be smaller than Max Sleep Time.");
            isValid = false;
          }
        }
      });
    });

    if (!isValid) return;

    successToast("Inputs saved");
    props.nextHandler("Choose device");
  };

  const showDivHandler = (index) => {
    if (inputsShowList.includes(index)) {
      setInputsShowList((prevstate) => prevstate.filter((el) => el !== index));
    } else {
      setInputsShowList((prevstate) => [...prevstate, index]);
    }
  };

  const showTableHanler = () => {
    setshowUserInteractionTable(true);
  };

  const hideFormHandler = () => {
    setshowUserInteractionTable(false);
  };

  function inputsToggleChangeHandler(index, InnerIndex, options = {}) {
    setInputs((prevState) => {
      if (options.isMultiAccountActivity) {
        const { parentIndex, accountIndex, actIdx } = options;
        const newInputs = { ...prevState };
        const item = newInputs.inputs[parentIndex].inputs[InnerIndex];
        if (
          item.MultiAccounts &&
          item.MultiAccounts[accountIndex] &&
          item.MultiAccounts[accountIndex].activities[actIdx]
        ) {
          item.MultiAccounts[accountIndex].activities.forEach(
            (activity, idx) => {
              activity.input = idx === actIdx ? !activity.input : false;
            }
          );
        }
        return newInputs;
      }
      if (prevState.type === "one") {
        return {
          ...prevState,
          inputs: prevState.inputs.map((item, i) =>
            i === index
              ? {
                  ...item,
                  inputs: item.inputs.map((el, innerI) =>
                    innerI === InnerIndex
                      ? { ...el, input: !el.input }
                      : { ...el, input: false }
                  ),
                }
              : {
                  ...item,
                  inputs: item.inputs.map((el) => ({ ...el, input: false })),
                }
          ),
        };
      } else {
        if (prevState.inputs[0].name === "Following Automation Type") {
          return {
            ...prevState,
            inputs: prevState.inputs.map((item, i) => ({
              ...item,
              inputs: item.inputs.map((input, inputIndex) => ({
                ...input,
                Accounts: input.Accounts.map((account, accountIndex) =>
                  accountIndex === index
                    ? {
                        ...account,
                        inputs: account.inputs.map(
                          (accountInputs, accountInputIndex) =>
                            accountInputIndex === InnerIndex
                              ? { ...accountInputs, input: true }
                              : { ...accountInputs, input: false }
                        ),
                      }
                    : account
                ),
              })),
            })),
          };
        } else {
          return {
            ...prevState,
            inputs: prevState.inputs.map((item, i) =>
              i === index
                ? {
                    ...item,
                    inputs: item.inputs.map((el, innerI) =>
                      innerI === InnerIndex
                        ? { ...el, input: !el.input }
                        : item.type === "one"
                        ? { ...el, input: false }
                        : el
                    ),
                  }
                : item
            ),
          };
        }
      }
    });
  }

  function inputTextChangeHandler(index, InnerIndex, val, type) {
    setInputs((prevState) => {
      if (prevState.inputs[0].name === "Following Automation Type") {
        return {
          ...prevState,
          inputs: prevState.inputs.map((item, i) => ({
            ...item,
            inputs: item.inputs.map((input, inputIndex) => ({
              ...input,
              Accounts: input.Accounts.map((account, accountIndex) =>
                accountIndex === index
                  ? {
                      ...account,
                      inputs: account.inputs.map(
                        (accountInputs, accountInputIndex) =>
                          accountInputIndex === InnerIndex
                            ? { ...accountInputs, [type]: val }
                            : accountInputs
                      ),
                    }
                  : account
              ),
            })),
          })),
        };
      } else {
        return {
          ...prevState,
          inputs: prevState.inputs.map((item, i) =>
            i === index
              ? {
                  ...item,
                  inputs: item.inputs.map((el, innerI) =>
                    innerI === InnerIndex ? { ...el, [type]: val } : el
                  ),
                }
              : item
          ),
        };
      }
    });
  }

  const AddkeywordHandler = (index, InnerIndex, val, type) => {
    setInputs((prevState) => {
      if (prevState.inputs[0].name === "Following Automation Type") {
        return {
          ...prevState,
          inputs: prevState.inputs.map((item, i) => ({
            ...item,
            inputs: item.inputs.map((input, inputIndex) => ({
              ...input,
              Accounts: input.Accounts.map((account, accountIndex) =>
                accountIndex === index
                  ? {
                      ...account,
                      inputs: account.inputs.map(
                        (accountInputs, accountInputIndex) =>
                          accountInputIndex === InnerIndex
                            ? {
                                ...accountInputs,
                                [type]: [...accountInputs[type], val],
                              }
                            : accountInputs
                      ),
                    }
                  : account
              ),
            })),
          })),
        };
      } else {
        return {
          ...prevState,
          inputs: prevState.inputs.map((item, i) =>
            i === index
              ? {
                  ...item,
                  inputs: item.inputs.map((el, innerI) =>
                    innerI === InnerIndex
                      ? { ...el, [type]: [...el[type], val] }
                      : el
                  ),
                }
              : item
          ),
        };
      }
    });
  };

  const removeKeywordHandler = (index, InnerIndex, val, type) => {
    setInputs((prevState) => {
      if (prevState.inputs[0].name === "Following Automation Type") {
        return {
          ...prevState,
          inputs: prevState.inputs.map((item, i) => ({
            ...item,
            inputs: item.inputs.map((input, inputIndex) => ({
              ...input,
              Accounts: input.Accounts.map((account, accountIndex) =>
                accountIndex === index
                  ? {
                      ...account,
                      inputs: account.inputs.map(
                        (accountInputs, accountInputIndex) =>
                          accountInputIndex === InnerIndex
                            ? {
                                ...accountInputs,
                                [type]: Array.isArray(accountInputs[type])
                                  ? accountInputs[type].filter(
                                      (keyword) => keyword !== val
                                    )
                                  : [],
                              }
                            : accountInputs
                      ),
                    }
                  : account
              ),
            })),
          })),
        };
      } else {
        return {
          ...prevState,
          inputs: prevState.inputs.map((item, i) =>
            i === index
              ? {
                  ...item,
                  inputs: item.inputs.map((el, innerI) =>
                    innerI === InnerIndex
                      ? {
                          ...el,
                          [type]: Array.isArray(el[type])
                            ? el[type].filter((keyword) => keyword !== val)
                            : [],
                        }
                      : el
                  ),
                }
              : item
          ),
        };
      }
    });
  };

  const AddAccountHandler = (index, InnerIndex, val, type) => {
    setInputs((prevState) => {
      return {
        ...prevState,
        inputs: prevState.inputs.map((item, i) =>
          i === index
            ? {
                ...item,
                inputs: item.inputs.map((el, innerI) =>
                  innerI === InnerIndex
                    ? {
                        ...el,
                        [type]: [
                          ...el[type],
                          { username: val, inputs: el.ActualInputs },
                        ],
                      }
                    : el
                ),
              }
            : item
        ),
      };
    });
  };
  const RemoveAccountHandler = (accountIndex) => {
    setInputs((prevState) => {
      return {
        ...prevState,
        inputs: prevState.inputs.map((item, i) => ({
          ...item,
          inputs: item.inputs.map((el, innerI) => ({
            ...el,
            Accounts: el.Accounts.filter((Account, index) => {
              return index !== accountIndex;
            }),
          })),
        })),
      };
    });
  };

  function renderInputContent(el, index, InnerIndex, options = {}) {
    // For toggleAndProbability, always set date to today if toggle is on and date is not today
    if (el.type === "toggleAndProbability" && el.input && !isToday(el.date)) {
      setInputs((prevState) => {
        const newInputs = { ...prevState };
        newInputs.inputs[index].inputs[InnerIndex] = {
          ...el,
          date: getTodayDDMMYYYY(),
        };
        return newInputs;
      });
    }
    switch (el.type) {
      case "toggle":
        return (
          <>
            <ToggleInput
              el={el}
              inputsToggleChangeHandler={inputsToggleChangeHandler}
              index={index}
              InnerIndex={InnerIndex}
            />
          </>
        );
      case "input":
        return (
          <>
            <input type="checkbox" />
            <label>
              <span>Toggle Input</span>
            </label>
          </>
        );
      case "toggleWithKeywords":
        return (
          <div className={classes.Inputscontainer}>
            <ToggleInput
              el={el}
              inputsToggleChangeHandler={inputsToggleChangeHandler}
              index={index}
              InnerIndex={InnerIndex}
            />
            {el.input && (
              <>
                <KeywordInput
                  inputs={[
                    { label: "Positive Keywords:", array: "positiveKeywords" },
                    { label: "Negative Keywords:", array: "negativeKeywords" },
                  ]}
                  el={el}
                  AddkeywordHandler={AddkeywordHandler}
                  removeKeywordHandler={removeKeywordHandler}
                  index={index}
                  InnerIndex={InnerIndex}
                />
                <div>
                  <NumberInput
                    description={
                      "Enter the number of mutual friends a profile should have to be followed."
                    }
                    onChange={(value) => {
                      inputTextChangeHandler(
                        index,
                        InnerIndex,
                        value,
                        "mutualFriendsCount"
                      );
                    }}
                    min={el.minMutualFriendsValue}
                    Value={el.mutualFriendsCount}
                  />
                </div>
                <div className={classes.minMaxInputsOuterContainer}>
                  <div>
                    <p>
                      Enter the Maximum and Minimum Follows Bot should Perform
                      Per Hour:
                    </p>
                  </div>
                  <div className={classes.minMaxInputsContainer}>
                    {" "}
                    <NumberInput
                      lable={"Min Follows Per Hour:"}
                      onChange={(value) => {
                        inputTextChangeHandler(
                          index,
                          InnerIndex,
                          value,
                          "minFollowsPerHour"
                        );
                      }}
                      min={1}
                      Value={el.minFollowsPerHour}
                    />
                    <NumberInput
                      lable={"Max Follows Per Hour:"}
                      onChange={(value) => {
                        inputTextChangeHandler(
                          index,
                          InnerIndex,
                          value,
                          "maxFollowsPerHour"
                        );
                      }}
                      min={2}
                      Value={el.maxFollowsPerHour}
                    />
                  </div>
                </div>
                <div className={classes.minMaxInputsOuterContainer}>
                  <div>
                    <p>
                      Enter the Maximum and Minimum Follows Bot should Perform
                      Daily:
                    </p>
                  </div>
                  <div className={classes.minMaxInputsContainer}>
                    {" "}
                    <NumberInput
                      lable={"Min Follows Daily:"}
                      onChange={(value) => {
                        inputTextChangeHandler(
                          index,
                          InnerIndex,
                          value,
                          "minFollowsDaily"
                        );
                      }}
                      min={1}
                      Value={el.minFollowsDaily}
                    />
                    <NumberInput
                      lable={"Max Follows Daily:"}
                      onChange={(value) => {
                        inputTextChangeHandler(
                          index,
                          InnerIndex,
                          value,
                          "maxFollowsDaily"
                        );
                      }}
                      min={2}
                      Value={el.maxFollowsDaily}
                    />
                  </div>
                </div>
                <div className={classes.minMaxInputsOuterContainer}>
                  <div>
                    <p>
                      Enter the Maximum and Minimum Sleep Time of Bot after
                      performing automation on each Account:
                    </p>
                  </div>
                  <div className={classes.minMaxTimeInputsContainer}>
                    <DurationInput
                      InnerHeading={"Min sleep Time:"}
                      initialValue={el.minSleepTime}
                      onChange={(totalMinutes) => {
                        inputTextChangeHandler(
                          index,
                          InnerIndex,
                          totalMinutes,
                          "minSleepTime"
                        );
                      }}
                    />
                    <DurationInput
                      InnerHeading={"Max sleep Time:"}
                      initialValue={el.maxSleepTime}
                      onChange={(totalMinutes) => {
                        inputTextChangeHandler(
                          index,
                          InnerIndex,
                          totalMinutes,
                          "maxSleepTime"
                        );
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        );
      case "toggleUrlAndKeyword":
        return (
          <div className={classes.Inputscontainer}>
            <ToggleInput
              el={el}
              inputsToggleChangeHandler={inputsToggleChangeHandler}
              index={index}
              InnerIndex={InnerIndex}
            />
            {el.input && (
              <>
                <InputText
                  label={"Profile Url:"}
                  type={"text"}
                  placeholder={"Profile Url"}
                  name={"profileurl"}
                  handler={(val) => {
                    inputTextChangeHandler(index, InnerIndex, val, "url");
                  }}
                  isTaskInputs={true}
                  value={el.url}
                />
                <KeywordInput
                  inputs={[
                    { label: "Positive Keywords:", array: "positiveKeywords" },
                    { label: "Negative Keywords:", array: "negativeKeywords" },
                  ]}
                  el={el}
                  AddkeywordHandler={AddkeywordHandler}
                  removeKeywordHandler={removeKeywordHandler}
                  index={index}
                  InnerIndex={InnerIndex}
                />
                <div>
                  <NumberInput
                    description={
                      "Enter the number of mutual friends a profile should have to be followed."
                    }
                    onChange={(value) => {
                      inputTextChangeHandler(
                        index,
                        InnerIndex,
                        value,
                        "mutualFriendsCount"
                      );
                    }}
                    min={el.minMutualFriendsValue}
                    Value={el.mutualFriendsCount}
                  />
                </div>
                <div className={classes.minMaxInputsOuterContainer}>
                  <div>
                    <p>
                      Enter the Maximum and Minimum Follows Bot should Perform
                      Per Hour:
                    </p>
                  </div>
                  <div className={classes.minMaxInputsContainer}>
                    {" "}
                    <NumberInput
                      lable={"Min Follows Per Hour:"}
                      onChange={(value) => {
                        inputTextChangeHandler(
                          index,
                          InnerIndex,
                          value,
                          "minFollowsPerHour"
                        );
                      }}
                      min={1}
                      Value={el.minFollowsPerHour}
                    />
                    <NumberInput
                      lable={"Max Follows Per Hour:"}
                      onChange={(value) => {
                        inputTextChangeHandler(
                          index,
                          InnerIndex,
                          value,
                          "maxFollowsPerHour"
                        );
                      }}
                      min={2}
                      Value={el.maxFollowsPerHour}
                    />
                  </div>
                </div>
                <div className={classes.minMaxInputsOuterContainer}>
                  <div>
                    <p>
                      Enter the Maximum and Minimum Follows Bot should Perform
                      Daily:
                    </p>
                  </div>
                  <div className={classes.minMaxInputsContainer}>
                    {" "}
                    <NumberInput
                      lable={"Min Follows Daily:"}
                      onChange={(value) => {
                        inputTextChangeHandler(
                          index,
                          InnerIndex,
                          value,
                          "minFollowsDaily"
                        );
                      }}
                      min={1}
                      Value={el.minFollowsDaily}
                    />
                    <NumberInput
                      lable={"Max Follows Daily:"}
                      onChange={(value) => {
                        inputTextChangeHandler(
                          index,
                          InnerIndex,
                          value,
                          "maxFollowsDaily"
                        );
                      }}
                      min={2}
                      Value={el.maxFollowsDaily}
                    />
                  </div>
                </div>
                <div className={classes.minMaxInputsOuterContainer}>
                  <div>
                    <p>
                      Enter the Maximum and Minimum Sleep Time of Bot after
                      performing automation on each Account:
                    </p>
                  </div>
                  <div className={classes.minMaxTimeInputsContainer}>
                    <DurationInput
                      InnerHeading={"Min sleep Time:"}
                      initialValue={el.minSleepTime}
                      onChange={(totalMinutes) => {
                        inputTextChangeHandler(
                          index,
                          InnerIndex,
                          totalMinutes,
                          "minSleepTime"
                        );
                      }}
                    />
                    <DurationInput
                      InnerHeading={"Max sleep Time:"}
                      initialValue={el.maxSleepTime}
                      onChange={(totalMinutes) => {
                        inputTextChangeHandler(
                          index,
                          InnerIndex,
                          totalMinutes,
                          "maxSleepTime"
                        );
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        );
      case "toggleAndUnFollowInputs":
        return (
          <div className={classes.Inputscontainer}>
            <ToggleInput
              el={el}
              inputsToggleChangeHandler={inputsToggleChangeHandler}
              index={index}
              InnerIndex={InnerIndex}
            />
            {el.input && (
              <>
                <div className={classes.minMaxInputsOuterContainer}>
                  <RadioOptions
                    options={["Default", "Earliest"]}
                    initialValue={el.typeOfUnfollowing}
                    description={"Please Select the Followers List Sort Type:"}
                    handler={(val) => {
                      inputTextChangeHandler(
                        index,
                        InnerIndex,
                        val,
                        "typeOfUnfollowing"
                      );
                    }}
                  />
                  <KeywordInput
                    inputs={[
                      {
                        label: "Enter Any Profiles Username to exclude:",
                        array: "usersToExcludeList",
                      },
                    ]}
                    el={el}
                    AddkeywordHandler={AddkeywordHandler}
                    removeKeywordHandler={removeKeywordHandler}
                    index={index}
                    InnerIndex={InnerIndex}
                  />
                </div>
                <div className={classes.minMaxInputsOuterContainer}>
                  <div>
                    <p>
                      Enter the Maximum and Minimum UnFollows Bot should Perform
                      Per Run:
                    </p>
                  </div>
                  <div className={classes.minMaxInputsContainer}>
                    {" "}
                    <NumberInput
                      lable={"Min UnFollows Per Run:"}
                      onChange={(value) => {
                        inputTextChangeHandler(
                          index,
                          InnerIndex,
                          value,
                          "minFollowsPerHour"
                        );
                      }}
                      min={1}
                      Value={el.minFollowsPerHour}
                    />
                    <NumberInput
                      lable={"Max UnFollows Per Run:"}
                      onChange={(value) => {
                        inputTextChangeHandler(
                          index,
                          InnerIndex,
                          value,
                          "maxFollowsPerHour"
                        );
                      }}
                      min={2}
                      Value={el.maxFollowsPerHour}
                    />
                  </div>
                </div>
                <div className={classes.minMaxInputsOuterContainer}>
                  <div>
                    <p>
                      Enter the Maximum and Minimum UnFollows Bot should Perform
                      Daily:
                    </p>
                  </div>
                  <div className={classes.minMaxInputsContainer}>
                    {" "}
                    <NumberInput
                      lable={"Min UnFollows Daily:"}
                      onChange={(value) => {
                        inputTextChangeHandler(
                          index,
                          InnerIndex,
                          value,
                          "minFollowsDaily"
                        );
                      }}
                      min={1}
                      Value={el.minFollowsDaily}
                    />
                    <NumberInput
                      lable={"Max UnFollows Daily:"}
                      onChange={(value) => {
                        inputTextChangeHandler(
                          index,
                          InnerIndex,
                          value,
                          "maxFollowsDaily"
                        );
                      }}
                      min={2}
                      Value={el.maxFollowsDaily}
                    />
                  </div>
                </div>
                <div className={classes.minMaxInputsOuterContainer}>
                  <div>
                    <p>
                      Enter the Maximum and Minimum Sleep Time of Bot after
                      performing automation on each Account:
                    </p>
                  </div>
                  <div className={classes.minMaxTimeInputsContainer}>
                    <DurationInput
                      InnerHeading={"Min sleep Time:"}
                      initialValue={el.minSleepTime}
                      onChange={(totalMinutes) => {
                        inputTextChangeHandler(
                          index,
                          InnerIndex,
                          totalMinutes,
                          "minSleepTime"
                        );
                      }}
                    />
                    <DurationInput
                      InnerHeading={"Max sleep Time:"}
                      initialValue={el.maxSleepTime}
                      onChange={(totalMinutes) => {
                        inputTextChangeHandler(
                          index,
                          InnerIndex,
                          totalMinutes,
                          "maxSleepTime"
                        );
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        );
      case "toggleKeywordsAndGap":
        return (
          <div className={classes.Inputscontainer}>
            <ToggleInput
              el={el}
              inputsToggleChangeHandler={inputsToggleChangeHandler}
              index={index}
              InnerIndex={InnerIndex}
            />
            {el.input && (
              <div>
                <KeywordInput
                  inputs={[
                    {
                      label:
                        "Enter profile usernames to exclude from automation:",
                      array: "usernamesToExclude",
                    },
                  ]}
                  el={el}
                  AddkeywordHandler={AddkeywordHandler}
                  removeKeywordHandler={removeKeywordHandler}
                  index={index}
                  InnerIndex={InnerIndex}
                />
              </div>
            )}
          </div>
        );
      case "toggleAndGap":
        return (
          <div className={classes.Inputscontainer}>
            <ToggleInput
              el={el}
              inputsToggleChangeHandler={inputsToggleChangeHandler}
              index={index}
              InnerIndex={InnerIndex}
            />
            {el.input && (
              <div className={classes.minMaxInputsOuterContainer}>
                <div>
                  <p>
                    Enter the Maximum and Minimum Sleep Time of Bot after
                    performing automation on each Account:
                  </p>
                </div>
                <div className={classes.minMaxTimeInputsContainer}>
                  <DurationInput
                    InnerHeading={"Min sleep Time:"}
                    initialValue={el.minSleepTime}
                    onChange={(totalMinutes) => {
                      inputTextChangeHandler(
                        index,
                        InnerIndex,
                        totalMinutes,
                        "minSleepTime"
                      );
                    }}
                  />
                  <DurationInput
                    InnerHeading={"Max sleep Time:"}
                    initialValue={el.maxSleepTime}
                    onChange={(totalMinutes) => {
                      inputTextChangeHandler(
                        index,
                        InnerIndex,
                        totalMinutes,
                        "maxSleepTime"
                      );
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      case "toggleDiscordAnalysis":
        return (
          <div className={classes.Inputscontainer}>
            <ToggleInput
              el={el}
              inputsToggleChangeHandler={inputsToggleChangeHandler}
              index={index}
              InnerIndex={InnerIndex}
            />
            {el.input && (
              <div className={classes.analysisInputConatainer}>
                <div>
                  <p className={classes.discordInviteContainer}>
                    Add Appilot bot to your server by clicking the button:{" "}
                    <LinkButton
                      link={
                        "https://discord.com/oauth2/authorize?client_id=1326626975284072550&permissions=274877917184&integration_type=0&scope=bot"
                      }
                      text={"Appilot Bot"}
                    />
                  </p>
                </div>
                <InputText
                  label={"Please provide your Server Id:"}
                  type={"text"}
                  placeholder={""}
                  name={"serverId"}
                  handler={(val) => {
                    inputTextChangeHandler(index, InnerIndex, val, "serverId");
                  }}
                  isTaskInputs={true}
                />
                <InputText
                  label={"Please provide your Channel Id:"}
                  type={"text"}
                  placeholder={""}
                  name={"channelId"}
                  handler={(val) => {
                    inputTextChangeHandler(index, InnerIndex, val, "channelId");
                  }}
                  isTaskInputs={true}
                />
              </div>
            )}
          </div>
        );
      case "instagrmFollowerBotAcountWise":
        return (
          <div className={classes.Inputscontainer}>
            <div className={classes.addbuttonInputContainer}>
              <InputWithButton
                lable={"Enter profile usernames to perform automation:"}
                type="text"
                name={"accountUsername"}
                buttonText="Add"
                handler={(value) => {
                  if (value.trim() === "") {
                    failToast("Please enter username");
                    return;
                  } else {
                    AddAccountHandler(index, InnerIndex, value, "Accounts");
                    console.log("Inputs after adding account name", inputs);
                  }
                }}
              />
            </div>
            {el.Accounts.length !== 0 && (
              <>
                {el.Accounts.map((account, accountIndex) => {
                  const isOpen = openItems.includes(accountIndex);
                  return (
                    <div
                      className={classes.accountContainer}
                      key={accountIndex}
                    >
                      <div className={classes.accountHeaderContainer}>
                        <h6 className={classes.accountUsername}>
                          {account.username}
                        </h6>
                        <div className={classes.accountActions}>
                          <button
                            className={classes.removeAccountBtn}
                            onClick={() => RemoveAccountHandler(accountIndex)}
                            aria-label="Remove account"
                          >
                            <Cross />
                          </button>
                          <button
                            className={`${classes.accordionButton} ${
                              isOpen ? classes.opened : ""
                            }`}
                            onClick={() => toggleAccordion(accountIndex)}
                            aria-label={isOpen ? "Collapse" : "Expand"}
                          >
                            {isOpen ? (
                              <CustomChevronUp />
                            ) : (
                              <CustomChevronDown />
                            )}
                          </button>
                        </div>
                      </div>
                      {isOpen && (
                        <div className={classes.accordionContent}>
                          <p className={classes.setInputsHeading}>
                            Please set Inputs for this account:
                          </p>
                          {account.inputs.map((input, inputIndex) => (
                            <div
                              key={inputIndex}
                              className={classes.inputWrapper}
                            >
                              <div className={classes.descriptionContainer}>
                                <p>{input.description}</p>
                              </div>
                              <div className={classes.inputCont}>
                                {renderInputContent(
                                  input,
                                  index, // parent input index
                                  innerIndex, // parent input InnerIndex
                                  {
                                    isMultiAccountActivity: true,
                                    parentIndex: index,
                                    accountIndex,
                                    actIdx: inputIndex,
                                  }
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        );
      //--------------------------------- Inputs for the Twitter Bot -----------------------------------//
      case "toggleAndInput":
        return (
          <div className={classes.Inputscontainer}>
            <ToggleInput
              el={el}
              inputsToggleChangeHandler={(idx, innerIdx) =>
                options.isMultiAccountActivity
                  ? inputsToggleChangeHandler(idx, innerIdx, options)
                  : inputsToggleChangeHandler(idx, innerIdx)
              }
              index={index}
              InnerIndex={InnerIndex}
            />
            {el.input && (
              <>
                <NumberInput
                  lable={"How many profiles?"}
                  onChange={(value) => {
                    if (options.isMultiAccountActivity) {
                      setInputs((prevState) => {
                        const newInputs = { ...prevState };
                        const activity =
                          newInputs.inputs[options.parentIndex].inputs[
                            InnerIndex
                          ].MultiAccounts[options.accountIndex].activities[
                            options.actIdx
                          ];
                        activity.numberOfPosts = value;
                        let posts = activity.posts || [];
                        const n = parseInt(value) || 0;
                        if (n > posts.length) {
                          posts = posts.concat(
                            Array(n - posts.length)
                              .fill()
                              .map(() => ({
                                username: "",
                                numberOfLikes: "",
                                numberOfComments: "",
                                numberOfReposts: "",
                                numberOfQuotes: "",
                                commentType: "",
                              }))
                          );
                        } else if (n < posts.length) {
                          posts = posts.slice(0, n);
                        }
                        activity.posts = posts;
                        return newInputs;
                      });
                    } else {
                      inputTextChangeHandler(
                        index,
                        InnerIndex,
                        value,
                        "numberOfPosts"
                      );
                      setInputs((prevState) => {
                        const newInputs = { ...prevState };
                        const item = newInputs.inputs[index].inputs[InnerIndex];
                        let posts = item.posts || [];
                        const n = parseInt(value) || 0;
                        if (n > posts.length) {
                          posts = posts.concat(
                            Array(n - posts.length)
                              .fill()
                              .map(() => ({
                                username: "",
                                numberOfLikes: "",
                                numberOfComments: "",
                                numberOfReposts: "",
                                numberOfQuotes: "",
                                commentType: "",
                              }))
                          );
                        } else if (n < posts.length) {
                          posts = posts.slice(0, n);
                        }
                        item.posts = posts;
                        return newInputs;
                      });
                    }
                  }}
                  min={0}
                  Value={el.numberOfPosts || ""}
                />
                {Array.isArray(el.posts) && el.posts.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    {el.posts.map((post, postIdx) => (
                      <div
                        key={postIdx}
                        style={{
                          border: "1px solid #444",
                          borderRadius: 8,
                          padding: 12,
                          marginBottom: 12,
                        }}
                      >
                        <div
                          style={{
                            marginBottom: 8,
                            fontWeight: 500,
                            color: "#fff",
                          }}
                        >
                          Profile #{postIdx + 1}
                        </div>
                        <InputText
                          label={"Enter Username:"}
                          type={"text"}
                          placeholder={"Username"}
                          name={`username_${postIdx}`}
                          handler={(val) => {
                            setInputs((prevState) => {
                              const newInputs = { ...prevState };
                              if (options.isMultiAccountActivity) {
                                newInputs.inputs[options.parentIndex].inputs[
                                  InnerIndex
                                ].MultiAccounts[
                                  options.accountIndex
                                ].activities[options.actIdx].posts[
                                  postIdx
                                ].username = val;
                              } else {
                                newInputs.inputs[index].inputs[
                                  InnerIndex
                                ].posts[postIdx].username = val;
                              }
                              return newInputs;
                            });
                          }}
                          isTaskInputs={true}
                          value={post.username}
                        />
                        <NumberInput
                          lable={
                            "No. of Posts You want the bot to interact with:"
                          }
                          onChange={(value) => {
                            setInputs((prevState) => {
                              const newInputs = { ...prevState };
                              if (options.isMultiAccountActivity) {
                                newInputs.inputs[options.parentIndex].inputs[
                                  InnerIndex
                                ].MultiAccounts[
                                  options.accountIndex
                                ].activities[options.actIdx].posts[
                                  postIdx
                                ].numOfPosts = value;
                              } else {
                                newInputs.inputs[index].inputs[
                                  InnerIndex
                                ].posts[postIdx].numOfPosts = value;
                              }
                              return newInputs;
                            });
                          }}
                          min={0}
                          Value={post.numOfPosts}
                        />
                        <div
                          style={{
                            display: "flex",
                            gap: "20px",
                            margin: "15px 0",
                          }}
                        >
                          <NumberInput
                            lable={"No. of Likes:"}
                            onChange={(value) => {
                              setInputs((prevState) => {
                                const newInputs = { ...prevState };
                                if (options.isMultiAccountActivity) {
                                  newInputs.inputs[options.parentIndex].inputs[
                                    InnerIndex
                                  ].MultiAccounts[
                                    options.accountIndex
                                  ].activities[options.actIdx].posts[
                                    postIdx
                                  ].numberOfLikes = value;
                                } else {
                                  newInputs.inputs[index].inputs[
                                    InnerIndex
                                  ].posts[postIdx].numberOfLikes = value;
                                }
                                return newInputs;
                              });
                            }}
                            min={0}
                            Value={post.numberOfLikes}
                          />
                          <NumberInput
                            lable={"No. of Comments:"}
                            onChange={(value) => {
                              setInputs((prevState) => {
                                const newInputs = { ...prevState };
                                if (options.isMultiAccountActivity) {
                                  newInputs.inputs[options.parentIndex].inputs[
                                    InnerIndex
                                  ].MultiAccounts[
                                    options.accountIndex
                                  ].activities[options.actIdx].posts[
                                    postIdx
                                  ].numberOfComments = value;
                                } else {
                                  newInputs.inputs[index].inputs[
                                    InnerIndex
                                  ].posts[postIdx].numberOfComments = value;
                                }
                                return newInputs;
                              });
                            }}
                            min={0}
                            Value={post.numberOfComments}
                          />
                          <NumberInput
                            lable={"No. of Reposts:"}
                            onChange={(value) => {
                              setInputs((prevState) => {
                                const newInputs = { ...prevState };
                                if (options.isMultiAccountActivity) {
                                  newInputs.inputs[options.parentIndex].inputs[
                                    InnerIndex
                                  ].MultiAccounts[
                                    options.accountIndex
                                  ].activities[options.actIdx].posts[
                                    postIdx
                                  ].numberOfReposts = value;
                                } else {
                                  newInputs.inputs[index].inputs[
                                    InnerIndex
                                  ].posts[postIdx].numberOfReposts = value;
                                }
                                return newInputs;
                              });
                            }}
                            min={0}
                            Value={post.numberOfReposts}
                          />
                          <NumberInput
                            lable={"No. of Quotes:"}
                            onChange={(value) => {
                              setInputs((prevState) => {
                                const newInputs = { ...prevState };
                                if (options.isMultiAccountActivity) {
                                  newInputs.inputs[options.parentIndex].inputs[
                                    InnerIndex
                                  ].MultiAccounts[
                                    options.accountIndex
                                  ].activities[options.actIdx].posts[
                                    postIdx
                                  ].numberOfQuotes = value;
                                } else {
                                  newInputs.inputs[index].inputs[
                                    InnerIndex
                                  ].posts[postIdx].numberOfQuotes = value;
                                }
                                return newInputs;
                              });
                            }}
                            min={0}
                            Value={post.numberOfQuotes}
                          />
                        </div>
                        <RadioOptions
                          options={["Natural", "Funny", "Disagree", "Sad"]}
                          description={"Type of Comment:"}
                          value={post.commentType}
                          handler={(val) => {
                            setInputs((prevState) => {
                              const newInputs = { ...prevState };
                              if (options.isMultiAccountActivity) {
                                newInputs.inputs[options.parentIndex].inputs[
                                  InnerIndex
                                ].MultiAccounts[
                                  options.accountIndex
                                ].activities[options.actIdx].posts[
                                  postIdx
                                ].commentType = val;
                              } else {
                                newInputs.inputs[index].inputs[
                                  InnerIndex
                                ].posts[postIdx].commentType = val;
                              }
                              return newInputs;
                            });
                          }}
                          name={`commentType_${index}_${InnerIndex}_${postIdx}`}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        );

      case "toggleAndURL":
        return (
          <div className={classes.Inputscontainer}>
            <ToggleInput
              el={el}
              //inputsToggleChangeHandler={inputsToggleChangeHandler}
              inputsToggleChangeHandler={(idx, innerIdx) =>
                options.isMultiAccountActivity
                  ? inputsToggleChangeHandler(idx, innerIdx, options)
                  : inputsToggleChangeHandler(idx, innerIdx)
              }
              index={index}
              InnerIndex={InnerIndex}
            />
            {el.input && (
              <>
                <InputText
                  label={"Enter Space Link:"}
                  type={"text"}
                  placeholder={"Place Space Link here"}
                  name={"space_link"}
                  // handler={(val) => {
                  //   inputTextChangeHandler(index, InnerIndex, val, "space_link");
                  // }}
                  handler={(val) => {
                    if (options.isMultiAccountActivity) {
                      setInputs((prevState) => {
                        const newInputs = { ...prevState };
                        newInputs.inputs[options.parentIndex].inputs[
                          InnerIndex
                        ].MultiAccounts[options.accountIndex].activities[
                          options.actIdx
                        ].space_link = val;
                        return newInputs;
                      });
                    } else {
                      inputTextChangeHandler(
                        index,
                        InnerIndex,
                        val,
                        "space_link"
                      );
                    }
                  }}
                  isTaskInputs={true}
                  value={el.space_link}
                />

                <NumberInput
                  lable={"Duration in Space (minutes):"}
                  onChange={(value) => {
                    if (options.isMultiAccountActivity) {
                      setInputs((prevState) => {
                        const newInputs = { ...prevState };
                        newInputs.inputs[options.parentIndex].inputs[
                          InnerIndex
                        ].MultiAccounts[options.accountIndex].activities[
                          options.actIdx
                        ].space_duration = value;
                        return newInputs;
                      });
                    } else {
                      inputTextChangeHandler(
                        index,
                        InnerIndex,
                        value,
                        "space_duration"
                      );
                    }
                  }}
                  min={1}
                  Value={el.space_duration || ""}
                />
              </>
            )}
          </div>
        );

      case "toggleAndRetweet":
        return (
          <div className={classes.Inputscontainer}>
            <ToggleInput
              el={el}
              //inputsToggleChangeHandler={inputsToggleChangeHandler}
              inputsToggleChangeHandler={(idx, innerIdx) =>
                options.isMultiAccountActivity
                  ? inputsToggleChangeHandler(idx, innerIdx, options)
                  : inputsToggleChangeHandler(idx, innerIdx)
              }
              index={index}
              InnerIndex={InnerIndex}
            />
            {el.input && (
              <>
                <NumberInput
                  lable={"How many Tweets?"}
                  onChange={(value) => {
                    if (options.isMultiAccountActivity) {
                      setInputs((prevState) => {
                        const newInputs = { ...prevState };
                        const activity =
                          newInputs.inputs[options.parentIndex].inputs[
                            InnerIndex
                          ].MultiAccounts[options.accountIndex].activities[
                            options.actIdx
                          ];
                        activity.numberOfTweets = value;
                        let tweetData = activity.tweetData || [];
                        const n = parseInt(value) || 0;
                        if (n > tweetData.length) {
                          tweetData = tweetData.concat(
                            Array(n - tweetData.length)
                              .fill()
                              .map(() => ({
                                url: "",
                                like: false,
                                comment: false,
                                repost: false,
                                quote: false,
                              }))
                          );
                        } else if (n < tweetData.length) {
                          tweetData = tweetData.slice(0, n);
                        }
                        activity.tweetData = tweetData;
                        return newInputs;
                      });
                    } else {
                      inputTextChangeHandler(
                        index,
                        InnerIndex,
                        value,
                        "numberOfTweets"
                      );
                      setInputs((prevState) => {
                        const newInputs = { ...prevState };
                        const item = newInputs.inputs[index].inputs[InnerIndex];
                        let tweetData = item.tweetData || [];
                        const n = parseInt(value) || 0;
                        if (n > tweetData.length) {
                          tweetData = tweetData.concat(
                            Array(n - tweetData.length)
                              .fill()
                              .map(() => ({
                                url: "",
                                like: false,
                                comment: false,
                                repost: false,
                                quote: false,
                              }))
                          );
                        } else if (n < tweetData.length) {
                          tweetData = tweetData.slice(0, n);
                        }
                        item.tweetData = tweetData;
                        return newInputs;
                      });
                    }
                  }}
                  min={0}
                  Value={el.numberOfTweets || ""}
                />
                {Array.isArray(el.tweetData) && el.tweetData.length > 0 && (
                  <div style={{ marginTop: 5 }}>
                    {el.tweetData.map((tweet, idx) => (
                      <div
                        key={idx}
                        style={{
                          border: "1px solid #444",
                          borderRadius: 8,
                          padding: 12,
                          marginBottom: 5,
                        }}
                      >
                        <div
                          style={{
                            marginBottom: 8,
                            fontWeight: 500,
                            color: "#fff",
                          }}
                        >
                          Tweet #{idx + 1}
                        </div>
                        <InputText
                          label={"Tweet URL:"}
                          type={"text"}
                          placeholder={"Enter Tweet URL"}
                          name={`tweetUrl_${idx}`}
                          handler={(val) => {
                            setInputs((prevState) => {
                              const newInputs = { ...prevState };
                              if (options.isMultiAccountActivity) {
                                newInputs.inputs[options.parentIndex].inputs[
                                  InnerIndex
                                ].MultiAccounts[
                                  options.accountIndex
                                ].activities[options.actIdx].tweetData[
                                  idx
                                ].url = val;
                              } else {
                                newInputs.inputs[index].inputs[
                                  InnerIndex
                                ].tweetData[idx].url = val;
                              }
                              return newInputs;
                            });
                          }}
                          isTaskInputs={true}
                          value={tweet.url}
                        />
                        <div
                          style={{
                            display: "flex",
                            gap: "52px",
                            marginTop: 10,
                          }}
                        >
                          <label
                            style={{
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={tweet.like}
                              onChange={(e) => {
                                setInputs((prevState) => {
                                  const newInputs = { ...prevState };
                                  if (options.isMultiAccountActivity) {
                                    newInputs.inputs[
                                      options.parentIndex
                                    ].inputs[InnerIndex].MultiAccounts[
                                      options.accountIndex
                                    ].activities[options.actIdx].tweetData[
                                      idx
                                    ].like = e.target.checked;
                                  } else {
                                    newInputs.inputs[index].inputs[
                                      InnerIndex
                                    ].tweetData[idx].like = e.target.checked;
                                  }
                                  return newInputs;
                                });
                              }}
                            />{" "}
                            Like
                          </label>
                          <label
                            style={{
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={tweet.comment}
                              onChange={(e) => {
                                setInputs((prevState) => {
                                  const newInputs = { ...prevState };
                                  if (options.isMultiAccountActivity) {
                                    newInputs.inputs[
                                      options.parentIndex
                                    ].inputs[InnerIndex].MultiAccounts[
                                      options.accountIndex
                                    ].activities[options.actIdx].tweetData[
                                      idx
                                    ].comment = e.target.checked;
                                  } else {
                                    newInputs.inputs[index].inputs[
                                      InnerIndex
                                    ].tweetData[idx].comment = e.target.checked;
                                  }
                                  return newInputs;
                                });
                              }}
                            />{" "}
                            Comment
                          </label>
                          <label
                            style={{
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={tweet.repost}
                              onChange={(e) => {
                                setInputs((prevState) => {
                                  const newInputs = { ...prevState };
                                  if (options.isMultiAccountActivity) {
                                    newInputs.inputs[
                                      options.parentIndex
                                    ].inputs[InnerIndex].MultiAccounts[
                                      options.accountIndex
                                    ].activities[options.actIdx].tweetData[
                                      idx
                                    ].repost = e.target.checked;
                                  } else {
                                    newInputs.inputs[index].inputs[
                                      InnerIndex
                                    ].tweetData[idx].repost = e.target.checked;
                                  }
                                  return newInputs;
                                });
                              }}
                            />{" "}
                            Repost
                          </label>
                          <label
                            style={{
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={tweet.quote}
                              onChange={(e) => {
                                setInputs((prevState) => {
                                  const newInputs = { ...prevState };
                                  if (options.isMultiAccountActivity) {
                                    newInputs.inputs[
                                      options.parentIndex
                                    ].inputs[InnerIndex].MultiAccounts[
                                      options.accountIndex
                                    ].activities[options.actIdx].tweetData[
                                      idx
                                    ].quote = e.target.checked;
                                  } else {
                                    newInputs.inputs[index].inputs[
                                      InnerIndex
                                    ].tweetData[idx].quote = e.target.checked;
                                  }
                                  return newInputs;
                                });
                              }}
                            />{" "}
                            Quote
                          </label>
                        </div>
                        {/* Show comment prompt input if comment is checked */}
                        {tweet.comment && (
                          <div style={{ marginTop: 10 }}>
                            <InputText
                              label={"Comment Prompt:"}
                              type={"text"}
                              placeholder={"Enter comment prompt"}
                              name={`commentPrompt_${idx}`}
                              handler={(val) => {
                                setInputs((prevState) => {
                                  const newInputs = { ...prevState };
                                  if (options.isMultiAccountActivity) {
                                    newInputs.inputs[
                                      options.parentIndex
                                    ].inputs[InnerIndex].MultiAccounts[
                                      options.accountIndex
                                    ].activities[options.actIdx].tweetData[
                                      idx
                                    ].commentPrompt = val;
                                  } else {
                                    newInputs.inputs[index].inputs[
                                      InnerIndex
                                    ].tweetData[idx].commentPrompt = val;
                                  }
                                  return newInputs;
                                });
                              }}
                              isTaskInputs={true}
                              value={tweet.commentPrompt || ""}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        );
      case "toggleAndPrompt":
        return (
          <div className={classes.Inputscontainer}>
            <ToggleInput
              el={el}
              //inputsToggleChangeHandler={inputsToggleChangeHandler}
              inputsToggleChangeHandler={(idx, innerIdx) =>
                options.isMultiAccountActivity
                  ? inputsToggleChangeHandler(idx, innerIdx, options)
                  : inputsToggleChangeHandler(idx, innerIdx)
              }
              index={index}
              InnerIndex={InnerIndex}
            />
            {el.input && (
              <InputText
                label={"Enter Prompt here along with #Hashtags and @Mentions: "}
                type={"text"}
                placeholder={"Place Prompt here"}
                name={"prompt"}
                // handler={(val) => {
                //   inputTextChangeHandler(index, InnerIndex, val, "prompt");
                // }}
                handler={(val) => {
                  if (options.isMultiAccountActivity) {
                    setInputs((prevState) => {
                      const newInputs = { ...prevState };
                      newInputs.inputs[options.parentIndex].inputs[
                        InnerIndex
                      ].MultiAccounts[options.accountIndex].activities[
                        options.actIdx
                      ].prompt = val;
                      return newInputs;
                    });
                  } else {
                    inputTextChangeHandler(index, InnerIndex, val, "prompt");
                  }
                }}
                isTaskInputs={true}
                value={el.prompt}
              />
            )}
          </div>
        );

      // case "toggleAndYoutube":
      //   return (
      //     <div className={classes.Inputscontainer}>
      //       <ToggleInput
      //         el={el}
      //         inputsToggleChangeHandler={(idx, innerIdx) =>
      //           options.isMultiAccountActivity
      //             ? inputsToggleChangeHandler(idx, innerIdx, options)
      //             : inputsToggleChangeHandler(idx, innerIdx)
      //         }
      //         index={index}
      //         InnerIndex={InnerIndex}
      //       />
      //       {el.input && (
      //         <>
      //           {/* Number of YouTube videos to interact with */}
      //           <NumberInput
      //             lable={"How many YouTube videos?"}
      //             onChange={(value) => {
      //               const n = parseInt(value) || 0;
      //               if (options.isMultiAccountActivity) {
      //                 setInputs((prevState) => {
      //                   const newInputs = { ...prevState };
      //                   const activity =
      //                     newInputs.inputs[options.parentIndex].inputs[
      //                       InnerIndex
      //                     ].MultiAccounts[options.accountIndex].activities[
      //                       options.actIdx
      //                     ];
      //                   let videos = Array.isArray(activity.videos)
      //                     ? activity.videos
      //                     : [];
      //                   if (n > videos.length) {
      //                     for (let i = videos.length; i < n; i++) {
      //                       videos.push({ youtube_link: "", prompt: "" });
      //                     }
      //                   } else if (n < videos.length) {
      //                     videos = videos.slice(0, n);
      //                   }
      //                   activity.videos = videos;
      //                   activity.numberOfVideos = n;
      //                   return newInputs;
      //                 });
      //               } else {
      //                 inputTextChangeHandler(
      //                   index,
      //                   InnerIndex,
      //                   n,
      //                   "numberOfVideos"
      //                 );
      //                 setInputs((prevState) => {
      //                   const newInputs = { ...prevState };
      //                   const item = newInputs.inputs[index].inputs[InnerIndex];
      //                   let videos = Array.isArray(item.videos)
      //                     ? item.videos
      //                     : [];
      //                   if (n > videos.length) {
      //                     for (let i = videos.length; i < n; i++) {
      //                       videos.push({ youtube_link: "", prompt: "" });
      //                     }
      //                   } else if (n < videos.length) {
      //                     videos = videos.slice(0, n);
      //                   }
      //                   item.videos = videos;
      //                   item.numberOfVideos = n;
      //                   return newInputs;
      //                 });
      //               }
      //             }}
      //             min={0}
      //             Value={el.numberOfVideos || ""}
      //           />

      //           {Array.isArray(el.videos) && el.videos.length > 0 && (
      //             <div style={{ marginTop: 12 }}>
      //               {el.videos.map((video, vIdx) => (
      //                 <div
      //                   key={vIdx}
      //                   style={{
      //                     border: "1px solid #444",
      //                     borderRadius: 8,
      //                     padding: 12,
      //                     marginBottom: 12,
      //                   }}
      //                 >
      //                   <div
      //                     style={{
      //                       marginBottom: 8,
      //                       fontWeight: 500,
      //                       color: "#fff",
      //                     }}
      //                   >
      //                     Video #{vIdx + 1}
      //                   </div>
      //                   <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 12, alignItems: 'start' }}>
      //                   <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      //                     <InputText
      //                       label={"YouTube URL:"}
      //                       type={"text"}
      //                       placeholder={"Enter YouTube video URL"}
      //                       name={`youtube_link_${vIdx}`}
      //                       handler={(val) => {
      //                         if (options.isMultiAccountActivity) {
      //                           setInputs((prevState) => {
      //                             const newInputs = { ...prevState };
      //                             const activity = newInputs.inputs[options.parentIndex].inputs[InnerIndex].MultiAccounts[options.accountIndex].activities[options.actIdx];
      //                             activity.videos = Array.isArray(activity.videos) ? activity.videos : [];
      //                             activity.videos[vIdx] = activity.videos[vIdx] || { youtube_link: "", prompt: "", playDuration: 0, share: false };
      //                             activity.videos[vIdx].youtube_link = val;
      //                             return newInputs;
      //                           });
      //                         } else {
      //                           setInputs((prevState) => {
      //                             const newInputs = { ...prevState };
      //                             const item = newInputs.inputs[index].inputs[InnerIndex];
      //                             item.videos = Array.isArray(item.videos) ? item.videos : [];
      //                             item.videos[vIdx] = item.videos[vIdx] || { youtube_link: "", prompt: "", playDuration: 0, share: false };
      //                             item.videos[vIdx].youtube_link = val;
      //                             return newInputs;
      //                           });
      //                         }
      //                       }}
      //                       isTaskInputs={true}
      //                       value={video.youtube_link}
      //                     />

      //                     <InputText
      //                       label={"Prompt / Notes:"}
      //                       type={"text"}
      //                       placeholder={"Enter prompt or instructions"}
      //                       name={`youtube_prompt_${vIdx}`}
      //                       handler={(val) => {
      //                         if (options.isMultiAccountActivity) {
      //                           setInputs((prevState) => {
      //                             const newInputs = { ...prevState };
      //                             const activity = newInputs.inputs[options.parentIndex].inputs[InnerIndex].MultiAccounts[options.accountIndex].activities[options.actIdx];
      //                             activity.videos = Array.isArray(activity.videos) ? activity.videos : [];
      //                             activity.videos[vIdx] = activity.videos[vIdx] || { youtube_link: "", prompt: "", playDuration: 0, share: false };
      //                             activity.videos[vIdx].prompt = val;
      //                             return newInputs;
      //                           });
      //                         } else {
      //                           setInputs((prevState) => {
      //                             const newInputs = { ...prevState };
      //                             const item = newInputs.inputs[index].inputs[InnerIndex];
      //                             item.videos = Array.isArray(item.videos) ? item.videos : [];
      //                             item.videos[vIdx] = item.videos[vIdx] || { youtube_link: "", prompt: "", playDuration: 0, share: false };
      //                             item.videos[vIdx].prompt = val;
      //                             return newInputs;
      //                           });
      //                         }
      //                       }}
      //                       isTaskInputs={true}
      //                       value={video.prompt || ""}
      //                     />
      //                   </div>

      //                   <div>
      //                     <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      //                       <div style={{ flex: '0 0 120px' }}>
      //                         <NumberInput
      //                           lable={"Play duration (minutes):"}
      //                           placeholder={"Enter play duration in minutes"}
      //                           onChange={(value) => {
      //                             const v = parseInt(value) || 0;
      //                             if (options.isMultiAccountActivity) {
      //                               setInputs((prevState) => {
      //                                 const newInputs = { ...prevState };
      //                                 const activity =
      //                                   newInputs.inputs[options.parentIndex].inputs[
      //                                     InnerIndex
      //                                   ].MultiAccounts[options.accountIndex].activities[
      //                                     options.actIdx
      //                                   ];
      //                                 activity.videos = Array.isArray(activity.videos) ? activity.videos : [];
      //                                 activity.videos[vIdx] = activity.videos[vIdx] || { youtube_link: "", prompt: "", playDuration: 0, share: false };
      //                                 activity.videos[vIdx].playDuration = v;
      //                                 return newInputs;
      //                               });
      //                             } else {
      //                               setInputs((prevState) => {
      //                                 const newInputs = { ...prevState };
      //                                 const item = newInputs.inputs[index].inputs[InnerIndex];
      //                                 item.videos = Array.isArray(item.videos) ? item.videos : [];
      //                                 item.videos[vIdx] = item.videos[vIdx] || { youtube_link: "", prompt: "", playDuration: 0, share: false };
      //                                 item.videos[vIdx].playDuration = v;
      //                                 return newInputs;
      //                               });
      //                             }
      //                           }}
      //                           min={0}
      //                           Value={video.playDuration || ""}
      //                         />
      //                       </div>

      //                       <label style={{ color: "#fff", display: 'flex', alignItems: 'center', gap: 8 }}>
      //                         <input
      //                           type="checkbox"
      //                           name={`youtube_share_${vIdx}`}
      //                           checked={!!video.share}
      //                           onChange={(e) => {
      //                             const checked = e.target.checked;
      //                             if (options.isMultiAccountActivity) {
      //                               setInputs((prevState) => {
      //                                 const newInputs = { ...prevState };
      //                                 const activity =
      //                                   newInputs.inputs[options.parentIndex].inputs[
      //                                     InnerIndex
      //                                   ].MultiAccounts[options.accountIndex].activities[
      //                                     options.actIdx
      //                                   ];
      //                                 activity.videos = Array.isArray(activity.videos) ? activity.videos : [];
      //                                 activity.videos[vIdx] = activity.videos[vIdx] || { youtube_link: "", prompt: "", playDuration: 0, share: false };
      //                                 activity.videos[vIdx].share = checked;
      //                                 return newInputs;
      //                               });
      //                             } else {
      //                               setInputs((prevState) => {
      //                                 const newInputs = { ...prevState };
      //                                 const item = newInputs.inputs[index].inputs[InnerIndex];
      //                                 item.videos = Array.isArray(item.videos) ? item.videos : [];
      //                                 item.videos[vIdx] = item.videos[vIdx] || { youtube_link: "", prompt: "", playDuration: 0, share: false };
      //                                 item.videos[vIdx].share = checked;
      //                                 return newInputs;
      //                               });
      //                             }
      //                           }}
      //                         />
      //                         Share
      //                       </label>
      //                     </div>
      //                   </div>
      //                 </div>

      //               </div>
      //             ))}
      //           </div>
      //         )}
      //       </>
      //     )}
      //   </div>
      // );
      case "toggleAndAPI":
        return (
          <div className={classes.Inputscontainer}>
            {el.input && (
              <InputText
                label={"Enter API Key of OpenAI:"}
                type={"text"}
                placeholder={"Place API Key here"}
                name={"api_key"}
                handler={(val) => {
                  inputTextChangeHandler(index, InnerIndex, val, "api_key");
                }}
                isTaskInputs={true}
                value={el.api_key}
              />
            )}
          </div>
        );
      case "toggleAndMultiAccounts":
        return (
          <div className={classes.Inputscontainer}>
            {/* Main toggle for MultiAccounts uses parent indices */}
            <ToggleInput
              el={el}
              inputsToggleChangeHandler={inputsToggleChangeHandler}
              index={index}
              InnerIndex={InnerIndex}
            />
            {el.input && (
              <>
                <div className={classes.addbuttonInputContainer}>
                  <InputWithButton
                    lable={"Enter Username"}
                    type="text"
                    name="accountUsername"
                    buttonText="Add"
                    handler={(value) => {
                      if (value.trim() === "") {
                        failToast("Please enter username");
                        return;
                      } else if (
                        el.MultiAccounts.some(
                          (acc) => acc.username === value.trim()
                        )
                      ) {
                        failToast("Username already exists");
                        return;
                      } else {
                        setInputs((prev) => {
                          const newInputs = { ...prev };
                          const item =
                            newInputs.inputs[index].inputs[InnerIndex];
                          item.MultiAccounts = [
                            ...(item.MultiAccounts || []),
                            {
                              username: value.trim(),
                              activities: [
                                {
                                  type: "toggleAndInput",
                                  name: "Profile interaction using Usernames",
                                  description:
                                    "The bot will search for the specific usernames and interact with the posts of the profile.",
                                  input: false,
                                  posts: [],
                                  numberOfPosts: 0,
                                },
                                {
                                  type: "toggleAndURL",
                                  name: "Join the Twitter Space",
                                  description:
                                    "The bot will join the Twitter Space using the URL.",
                                  input: false,
                                  space_link: "",
                                  space_duration: 5,
                                },
                                {
                                  type: "toggleAndPrompt",
                                  name: "Post a new Tweet",
                                  description:
                                    "The bot will type and post a new Tweet using a prompt.",
                                  input: false,
                                  prompt: "",
                                },
                                {
                                  type: "toggleAndRetweet",
                                  name: "Interact with specific Tweets",
                                  description:
                                    "The bot will interact with the specific Tweets using the URLs.",
                                  input: false,
                                  tweetData: [],
                                  numberOfTweets: 0,
                                },
                              ],
                            },
                          ];
                          return newInputs;
                        });
                      }
                    }}
                  />
                </div>
                {el.MultiAccounts && el.MultiAccounts.length !== 0 && (
                  <>
                    {el.MultiAccounts.map((account, accountIndex) => {
                      const isOpen = openDropdowns[accountIndex];
                      return (
                        <div
                          className={classes.accountContainer}
                          key={accountIndex}
                        >
                          <div className={classes.accountHeaderContainer}>
                            <h6 className={classes.accountUsername}>
                              {account.username}
                            </h6>
                            <div className={classes.accountActions}>
                              <button
                                className={classes.removeAccountBtn}
                                onClick={() => {
                                  setInputs((prev) => {
                                    const newInputs = { ...prev };
                                    const item =
                                      newInputs.inputs[index].inputs[
                                        InnerIndex
                                      ];
                                    item.MultiAccounts =
                                      item.MultiAccounts.filter(
                                        (_, i) => i !== accountIndex
                                      );
                                    return newInputs;
                                  });
                                }}
                                aria-label="Remove account"
                              >
                                {/* Use your Cross icon component if available */}
                                <Cross />
                              </button>
                              <button
                                className={`${classes.accordionButton} ${
                                  isOpen ? classes.opened : ""
                                }`}
                                onClick={() => {
                                  setOpenDropdowns((prev) => ({
                                    ...prev,
                                    [accountIndex]: !prev[accountIndex],
                                  }));
                                }}
                                aria-label={isOpen ? "Collapse" : "Expand"}
                              >
                                {isOpen ? (
                                  <CustomChevronUp />
                                ) : (
                                  <CustomChevronDown />
                                )}
                              </button>
                            </div>
                          </div>
                          {isOpen && (
                            <div className={classes.accordionContent}>
                              <p className={classes.setInputsHeading}>
                                Please set Inputs for this account:
                              </p>
                              {account.activities.map((activity, actIdx) => (
                                <div
                                  key={actIdx}
                                  className={classes.inputWrapper}
                                >
                                  <div className={classes.descriptionContainer}>
                                    <p>{activity.description}</p>
                                  </div>
                                  <div className={classes.inputCont}>
                                    {/* Activity toggles use accountIndex and actIdx for correct state */}
                                    {renderInputContent(
                                      activity,
                                      index,
                                      InnerIndex,
                                      {
                                        isMultiAccountActivity: true,
                                        parentIndex: index,
                                        accountIndex,
                                        actIdx,
                                      }
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </>
                )}
              </>
            )}
          </div>
        );
      // case "toggleAndFollowUnfollow":
      //   return (
      //     <div className={classes.Inputscontainer}>
      //       <ToggleInput
      //         el={el}
      //         inputsToggleChangeHandler={inputsToggleChangeHandler}
      //         index={index}
      //         InnerIndex={InnerIndex}
      //       />
      //       {el.input && (
      //         <>
      //           <InputText
      //             label={
      //               "Enter a list of profile usernames you want to follow/unfollow:"
      //             }
      //             type={"text"}
      //             placeholder={"Place usernames here"}
      //             name={"usernames"}
      //             handler={(val) => {
      //               inputTextChangeHandler(index, InnerIndex, val, "usernames");
      //             }}
      //             isTaskInputs={true}
      //             value={el.usernames}
      //           />
      //           <NumberInput
      //             lable={"Number of users to follow/unfollow per day:"}
      //             onChange={(value) => {
      //               inputTextChangeHandler(
      //                 index,
      //                 InnerIndex,
      //                 value,
      //                 "usersPerDay"
      //               );
      //             }}
      //             min={0}
      //             Value={el.usersPerDay || ""}
      //           />
      //           <RadioOptions
      //             options={["Follow", "Unfollow"]}
      //             description={"Select action:"}
      //             value={el.followAction}
      //             handler={(val) => {
      //               inputTextChangeHandler(
      //                 index,
      //                 InnerIndex,
      //                 val,
      //                 "followAction"
      //               );
      //             }}
      //             name={`followAction_${index}_${InnerIndex}`}
      //           />
      //         </>
      //       )}
      //     </div>
      //   );
      // case "toggleAndProbability":
      //   if (!el.date) {
      //     setInputs((prevState) => {
      //       const newInputs = { ...prevState };
      //       newInputs.inputs[index].inputs[InnerIndex] = {
      //         ...el,
      //         date: getTodayDDMMYYYY(),
      //       };
      //       return newInputs;
      //     });
      //   }
      //   return (
      //     <div className={classes.Inputscontainer}>
      //       <ToggleInput
      //         el={el}
      //         inputsToggleChangeHandler={inputsToggleChangeHandler}
      //         index={index}
      //         InnerIndex={InnerIndex}
      //       />
      //       {el.input && (
      //         <>
      //           <div style={{ marginTop: 10 }}>
      //             <label style={{ fontWeight: 500, color: "#fff" }}>
      //               Date:
      //             </label>
      //             <input
      //               type="text"
      //               value={el.date || getTodayDDMMYYYY()}
      //               onChange={(e) => {
      //                 inputTextChangeHandler(
      //                   index,
      //                   InnerIndex,
      //                   e.target.value,
      //                   "date"
      //                 );
      //               }}
      //               readOnly={false}
      //               style={{
      //                 marginLeft: 8,
      //                 padding: 4,
      //                 borderRadius: 4,
      //                 border: "1px solid #000",
      //                 width: 120,
      //                 backgroundColor: "#000",
      //                 color: "#fff",
      //               }}
      //             />
      //           </div>
      //           <NumberInput
      //             lable={"Probability:"}
      //             onChange={(value) => {
      //               inputTextChangeHandler(
      //                 index,
      //                 InnerIndex,
      //                 value,
      //                 "probability"
      //               );
      //             }}
      //             min={0}
      //             Value={el.probability}
      //           />
      //           <NumberInput
      //             lable={"Number of Tweets to Interact Daily:"}
      //             onChange={(value) => {
      //               inputTextChangeHandler(
      //                 index,
      //                 InnerIndex,
      //                 value,
      //                 "tweetsPerDay"
      //               );
      //             }}
      //             min={0}
      //             Value={el.tweetsPerDay}
      //           />
      //         </>
      //       )}
      //       {/* Always render the date field (hidden) so it's sent to backend even if toggle is off */}
      //       <input
      //         type="hidden"
      //         value={el.date || getTodayDDMMYYYY()}
      //         readOnly
      //         name="date"
      //       />
      //     </div>
      //   );

      // ------------------ Inputs for Spotify Bot ----------------------------------- //
      case "toggleAndSpotify":
        return (
          <div className={classes.Inputscontainer}>
            <ToggleInput
              el={el}
              inputsToggleChangeHandler={(idx, innerIdx) =>
                options.isMultiAccountActivity
                  ? inputsToggleChangeHandler(idx, innerIdx, options)
                  : inputsToggleChangeHandler(idx, innerIdx)
              }
              index={index}
              InnerIndex={InnerIndex}
            />
            {el.input && (
              <>
                {/* Number of albums to interact with */}
                <NumberInput
                  lable={"How many Spotify albums?"}
                  onChange={(value) => {
                    const n = parseInt(value) || 0;
                    if (options.isMultiAccountActivity) {
                      setInputs((prevState) => {
                        const newInputs = { ...prevState };
                        const item =
                          newInputs.inputs[options.parentIndex].inputs[
                            InnerIndex
                          ].MultiAccounts[options.accountIndex].activities[
                            options.actIdx
                          ];
                        let albums = Array.isArray(item.albums)
                          ? item.albums
                          : [];
                        if (n > albums.length) {
                          for (let i = albums.length; i < n; i++) {
                            albums.push({
                              spotify_link: "",
                              prompt: "",
                              playDuration: 0,
                              share: false,
                            });
                          }
                        } else if (n < albums.length) {
                          albums = albums.slice(0, n);
                        }
                        item.albums = albums;
                        item.numberOfAlbums = n;
                        return newInputs;
                      });
                    } else {
                      inputTextChangeHandler(
                        index,
                        InnerIndex,
                        n,
                        "numberOfAlbums"
                      );
                      setInputs((prevState) => {
                        const newInputs = { ...prevState };
                        const item = newInputs.inputs[index].inputs[InnerIndex];
                        let albums = Array.isArray(item.albums)
                          ? item.albums
                          : [];
                        if (n > albums.length) {
                          for (let i = albums.length; i < n; i++) {
                            albums.push({
                              spotify_link: "",
                              prompt: "",
                              playDuration: 0,
                              share: false,
                            });
                          }
                        } else if (n < albums.length) {
                          albums = albums.slice(0, n);
                        }
                        item.albums = albums;
                        item.numberOfAlbums = n;
                        return newInputs;
                      });
                    }
                  }}
                  min={0}
                  Value={el.numberOfAlbums || ""}
                />
                {Array.isArray(el.albums) && el.albums.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    {el.albums.map((album, aIdx) => (
                      <div
                        key={aIdx}
                        style={{
                          border: "1px solid #444",
                          borderRadius: 8,
                          padding: 12,
                          marginBottom: 12,
                        }}
                      >
                        <div
                          style={{
                            marginBottom: 8,
                            fontWeight: 500,
                            color: "#fff",
                          }}
                        >
                          Album #{aIdx + 1}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 12,
                          }}
                        >
                          {/* 1. Track URL input */}
                          <InputText
                            label={"Track URL:"}
                            type={"text"}
                            placeholder={"Enter Spotify track URL"}
                            name={`spotify_link_${aIdx}`}
                            handler={(val) => {
                              if (options.isMultiAccountActivity) {
                                setInputs((prevState) => {
                                  const newInputs = { ...prevState };
                                  const activity =
                                    newInputs.inputs[options.parentIndex]
                                      .inputs[InnerIndex].MultiAccounts[
                                      options.accountIndex
                                    ].activities[options.actIdx];
                                  activity.albums = Array.isArray(
                                    activity.albums
                                  )
                                    ? activity.albums
                                    : [];
                                  activity.albums[aIdx] = activity.albums[
                                    aIdx
                                  ] || {
                                    spotify_link: "",
                                    prompt: "",
                                    playDuration: 0,
                                    addToLibrary: false,
                                    followArtist: false,
                                    shareOnTwitter: false,
                                  };
                                  activity.albums[aIdx].spotify_link = val;
                                  return newInputs;
                                });
                              } else {
                                setInputs((prevState) => {
                                  const newInputs = { ...prevState };
                                  const item =
                                    newInputs.inputs[index].inputs[InnerIndex];
                                  item.albums = Array.isArray(item.albums)
                                    ? item.albums
                                    : [];
                                  item.albums[aIdx] = item.albums[aIdx] || {
                                    spotify_link: "",
                                    prompt: "",
                                    playDuration: 0,
                                    addToLibrary: false,
                                    followArtist: false,
                                    shareOnTwitter: false,
                                  };
                                  item.albums[aIdx].spotify_link = val;
                                  return newInputs;
                                });
                              }
                            }}
                            isTaskInputs={true}
                            value={album.spotify_link}
                          />

                          {/* 2. Duration input */}
                          <NumberInput
                            lable={"Play duration (minutes):"}
                            placeholder={"Enter play duration in minutes"}
                            onChange={(value) => {
                              const v = parseInt(value) || 0;
                              if (options.isMultiAccountActivity) {
                                setInputs((prevState) => {
                                  const newInputs = { ...prevState };
                                  const activity =
                                    newInputs.inputs[options.parentIndex]
                                      .inputs[InnerIndex].MultiAccounts[
                                      options.accountIndex
                                    ].activities[options.actIdx];
                                  activity.albums = Array.isArray(
                                    activity.albums
                                  )
                                    ? activity.albums
                                    : [];
                                  activity.albums[aIdx] = activity.albums[
                                    aIdx
                                  ] || {
                                    spotify_link: "",
                                    prompt: "",
                                    playDuration: 0,
                                    addToLibrary: false,
                                    followArtist: false,
                                    shareOnTwitter: false,
                                  };
                                  activity.albums[aIdx].playDuration = v;
                                  return newInputs;
                                });
                              } else {
                                setInputs((prevState) => {
                                  const newInputs = { ...prevState };
                                  const item =
                                    newInputs.inputs[index].inputs[InnerIndex];
                                  item.albums = Array.isArray(item.albums)
                                    ? item.albums
                                    : [];
                                  item.albums[aIdx] = item.albums[aIdx] || {
                                    spotify_link: "",
                                    prompt: "",
                                    playDuration: 0,
                                    addToLibrary: false,
                                    followArtist: false,
                                    shareOnTwitter: false,
                                  };
                                  item.albums[aIdx].playDuration = v;
                                  return newInputs;
                                });
                              }
                            }}
                            min={0}
                            Value={album.playDuration || ""}
                          />
                          {/* 3. Actions checkboxes */}
                          <div
                            style={{ display: "flex", gap: 24, marginTop: 8 }}
                          >
                            <label
                              style={{
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={!!album.addToLibrary}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  if (options.isMultiAccountActivity) {
                                    setInputs((prevState) => {
                                      const newInputs = { ...prevState };
                                      const activity =
                                        newInputs.inputs[options.parentIndex]
                                          .inputs[InnerIndex].MultiAccounts[
                                          options.accountIndex
                                        ].activities[options.actIdx];
                                      activity.albums = Array.isArray(
                                        activity.albums
                                      )
                                        ? activity.albums
                                        : [];
                                      activity.albums[aIdx] = activity.albums[
                                        aIdx
                                      ] || {
                                        spotify_link: "",
                                        prompt: "",
                                        playDuration: 0,
                                        addToLibrary: false,
                                        followArtist: false,
                                        shareOnTwitter: false,
                                      };
                                      activity.albums[aIdx].addToLibrary =
                                        checked;
                                      return newInputs;
                                    });
                                  } else {
                                    setInputs((prevState) => {
                                      const newInputs = { ...prevState };
                                      const item =
                                        newInputs.inputs[index].inputs[
                                          InnerIndex
                                        ];
                                      item.albums = Array.isArray(item.albums)
                                        ? item.albums
                                        : [];
                                      item.albums[aIdx] = item.albums[aIdx] || {
                                        spotify_link: "",
                                        prompt: "",
                                        playDuration: 0,
                                        addToLibrary: false,
                                        followArtist: false,
                                        shareOnTwitter: false,
                                      };
                                      item.albums[aIdx].addToLibrary = checked;
                                      return newInputs;
                                    });
                                  }
                                }}
                              />
                              Add to Library
                            </label>
                            <label
                              style={{
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={!!album.followArtist}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  if (options.isMultiAccountActivity) {
                                    setInputs((prevState) => {
                                      const newInputs = { ...prevState };
                                      const activity =
                                        newInputs.inputs[options.parentIndex]
                                          .inputs[InnerIndex].MultiAccounts[
                                          options.accountIndex
                                        ].activities[options.actIdx];
                                      activity.albums = Array.isArray(
                                        activity.albums
                                      )
                                        ? activity.albums
                                        : [];
                                      activity.albums[aIdx] = activity.albums[
                                        aIdx
                                      ] || {
                                        spotify_link: "",
                                        prompt: "",
                                        playDuration: 0,
                                        addToLibrary: false,
                                        followArtist: false,
                                        shareOnTwitter: false,
                                      };
                                      activity.albums[aIdx].followArtist =
                                        checked;
                                      return newInputs;
                                    });
                                  } else {
                                    setInputs((prevState) => {
                                      const newInputs = { ...prevState };
                                      const item =
                                        newInputs.inputs[index].inputs[
                                          InnerIndex
                                        ];
                                      item.albums = Array.isArray(item.albums)
                                        ? item.albums
                                        : [];
                                      item.albums[aIdx] = item.albums[aIdx] || {
                                        spotify_link: "",
                                        prompt: "",
                                        playDuration: 0,
                                        addToLibrary: false,
                                        followArtist: false,
                                        shareOnTwitter: false,
                                      };
                                      item.albums[aIdx].followArtist = checked;
                                      return newInputs;
                                    });
                                  }
                                }}
                              />
                              Follow Artist
                            </label>
                            <label
                              style={{
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={!!album.shareOnTwitter}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  if (options.isMultiAccountActivity) {
                                    setInputs((prevState) => {
                                      const newInputs = { ...prevState };
                                      const activity =
                                        newInputs.inputs[options.parentIndex]
                                          .inputs[InnerIndex].MultiAccounts[
                                          options.accountIndex
                                        ].activities[options.actIdx];
                                      activity.albums = Array.isArray(
                                        activity.albums
                                      )
                                        ? activity.albums
                                        : [];
                                      activity.albums[aIdx] = activity.albums[
                                        aIdx
                                      ] || {
                                        spotify_link: "",
                                        prompt: "",
                                        playDuration: 0,
                                        addToLibrary: false,
                                        followArtist: false,
                                        shareOnTwitter: false,
                                      };
                                      activity.albums[aIdx].shareOnTwitter =
                                        checked;
                                      return newInputs;
                                    });
                                  } else {
                                    setInputs((prevState) => {
                                      const newInputs = { ...prevState };
                                      const item =
                                        newInputs.inputs[index].inputs[
                                          InnerIndex
                                        ];
                                      item.albums = Array.isArray(item.albums)
                                        ? item.albums
                                        : [];
                                      item.albums[aIdx] = item.albums[aIdx] || {
                                        spotify_link: "",
                                        prompt: "",
                                        playDuration: 0,
                                        addToLibrary: false,
                                        followArtist: false,
                                        shareOnTwitter: false,
                                      };
                                      item.albums[aIdx].shareOnTwitter =
                                        checked;
                                      return newInputs;
                                    });
                                  }
                                }}
                              />
                              Share on Twitter
                            </label>
                          </div>
                          {/* Show prompt input if Share on Twitter is checked */}
                          {album.shareOnTwitter && (
                            <InputText
                              label={"Prompt / Notes:"}
                              type={"text"}
                              placeholder={"Enter prompt or instructions"}
                              name={`spotify_prompt_${aIdx}`}
                              handler={(val) => {
                                if (options.isMultiAccountActivity) {
                                  setInputs((prevState) => {
                                    const newInputs = { ...prevState };
                                    const activity =
                                      newInputs.inputs[options.parentIndex]
                                        .inputs[InnerIndex].MultiAccounts[
                                        options.accountIndex
                                      ].activities[options.actIdx];
                                    activity.albums = Array.isArray(
                                      activity.albums
                                    )
                                      ? activity.albums
                                      : [];
                                    activity.albums[aIdx] = activity.albums[
                                      aIdx
                                    ] || {
                                      spotify_link: "",
                                      prompt: "",
                                      playDuration: 0,
                                      addToLibrary: false,
                                      followArtist: false,
                                      shareOnTwitter: false,
                                    };
                                    activity.albums[aIdx].prompt = val;
                                    return newInputs;
                                  });
                                } else {
                                  setInputs((prevState) => {
                                    const newInputs = { ...prevState };
                                    const item =
                                      newInputs.inputs[index].inputs[
                                        InnerIndex
                                      ];
                                    item.albums = Array.isArray(item.albums)
                                      ? item.albums
                                      : [];
                                    item.albums[aIdx] = item.albums[aIdx] || {
                                      spotify_link: "",
                                      prompt: "",
                                      playDuration: 0,
                                      addToLibrary: false,
                                      followArtist: false,
                                      shareOnTwitter: false,
                                    };
                                    item.albums[aIdx].prompt = val;
                                    return newInputs;
                                  });
                                }
                              }}
                              isTaskInputs={true}
                              value={album.prompt || ""}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        );
      // case "spotifyAndMultiAccounts":
      //   return (
      //     <div className={classes.Inputscontainer}>
      //       {/* Main toggle for MultiAccounts uses parent indices */}
      //       <ToggleInput
      //         el={el}
      //         inputsToggleChangeHandler={inputsToggleChangeHandler}
      //         index={index}
      //         InnerIndex={InnerIndex}
      //       />
      //       {el.input && (
      //         <>
      //           <div className={classes.addbuttonInputContainer}>
      //             <InputWithButton
      //               lable={"Enter Username"}
      //               type="text"
      //               name="accountUsername"
      //               buttonText="Add"
      //               handler={(value) => {
      //                 if (value.trim() === "") {
      //                   failToast("Please enter username");
      //                   return;
      //                 } else if (
      //                   el.MultiAccounts.some(
      //                     (acc) => acc.username === value.trim()
      //                   )
      //                 ) {
      //                   failToast("Username already exists");
      //                   return;
      //                 } else {
      //                   setInputs((prev) => {
      //                     const newInputs = { ...prev };
      //                     const item =
      //                       newInputs.inputs[index].inputs[InnerIndex];
      //                     item.MultiAccounts = [
      //                       ...(item.MultiAccounts || []),
      //                       {
      //                         username: value.trim(),
      //                         activities: [
      //                           {
      //                             type: "toggleAndSpotify",
      //                             name: "Interact and Share a Spotify track",
      //                             description:
      //                               "The bot will interact with a Spotify track using a URL and share the link by posting a new tweet.",
      //                             input: false,
      //                             spotify_link: "",
      //                             prompt: "",
      //                           },
      //                         ],
      //                       },
      //                     ];
      //                     return newInputs;
      //                   });
      //                 }
      //               }}
      //             />
      //           </div>
      //           {el.MultiAccounts && el.MultiAccounts.length !== 0 && (
      //             <>
      //               {el.MultiAccounts.map((account, accountIndex) => {
      //                 const isOpen = openDropdowns[accountIndex];
      //                 return (
      //                   <div
      //                     className={classes.accountContainer}
      //                     key={accountIndex}
      //                   >
      //                     <div className={classes.accountHeaderContainer}>
      //                       <h6 className={classes.accountUsername}>
      //                         {account.username}
      //                       </h6>
      //                       <div className={classes.accountActions}>
      //                         <button
      //                           className={classes.removeAccountBtn}
      //                           onClick={() => {
      //                             setInputs((prev) => {
      //                               const newInputs = { ...prev };
      //                               const item =
      //                                 newInputs.inputs[index].inputs[
      //                                   InnerIndex
      //                                 ];
      //                               item.MultiAccounts =
      //                                 item.MultiAccounts.filter(
      //                                   (_, i) => i !== accountIndex
      //                                 );
      //                               return newInputs;
      //                             });
      //                           }}
      //                           aria-label="Remove account"
      //                         >
      //                           {/* Use your Cross icon component if available */}
      //                           <Cross />
      //                         </button>
      //                         <button
      //                           className={`${classes.accordionButton} ${
      //                             isOpen ? classes.opened : ""
      //                           }`}
      //                           onClick={() => {
      //                             setOpenDropdowns((prev) => ({
      //                               ...prev,
      //                               [accountIndex]: !prev[accountIndex],
      //                             }));
      //                           }}
      //                           aria-label={isOpen ? "Collapse" : "Expand"}
      //                         >
      //                           {isOpen ? (
      //                             <CustomChevronUp />
      //                           ) : (
      //                             <CustomChevronDown />
      //                           )}
      //                         </button>
      //                       </div>
      //                     </div>
      //                     {isOpen && (
      //                       <div className={classes.accordionContent}>
      //                         <p className={classes.setInputsHeading}>
      //                           Please set Inputs for this account:
      //                         </p>
      //                         {account.activities.map((activity, actIdx) => (
      //                           <div
      //                             key={actIdx}
      //                             className={classes.inputWrapper}
      //                           >
      //                             <div className={classes.descriptionContainer}>
      //                               <p>{activity.description}</p>
      //                             </div>
      //                             <div className={classes.inputCont}>
      //                               {/* Activity toggles use accountIndex and actIdx for correct state */}
      //                               {renderInputContent(
      //                                 activity,
      //                                 index,
      //                                 InnerIndex,
      //                                 {
      //                                   isMultiAccountActivity: true,
      //                                   parentIndex: index,
      //                                   accountIndex,
      //                                   actIdx,
      //                                 }
      //                               )}
      //                             </div>
      //                           </div>
      //                         ))}
      //                       </div>
      //                     )}
      //                   </div>
      //                 );
      //               })}
      //             </>
      //           )}
      //         </>
      //       )}
      //     </div>
      //   );

      // ------------------ Inputs for YouTube Bot ----------------------------------- //
      case "toggleAndYoutube":
        return (
          <div className={classes.Inputscontainer}>
            <ToggleInput
              el={el}
              inputsToggleChangeHandler={(idx, innerIdx) =>
                options.isMultiAccountActivity
                  ? inputsToggleChangeHandler(idx, innerIdx, options)
                  : inputsToggleChangeHandler(idx, innerIdx)
              }
              index={index}
              InnerIndex={InnerIndex}
            />
            {el.input && (
              <>
                {/* Number of YouTube videos to interact with */}
                <NumberInput
                  lable={"How many YouTube videos?"}
                  onChange={(value) => {
                    const n = parseInt(value) || 0;
                    if (options.isMultiAccountActivity) {
                      setInputs((prevState) => {
                        const newInputs = { ...prevState };
                        const activity =
                          newInputs.inputs[options.parentIndex].inputs[
                            InnerIndex
                          ].MultiAccounts[options.accountIndex].activities[
                            options.actIdx
                          ];
                        let videos = Array.isArray(activity.videos)
                          ? activity.videos
                          : [];
                        if (n > videos.length) {
                          for (let i = videos.length; i < n; i++) {
                            videos.push({
                              youtube_link: "",
                              playDuration: 0,
                              like: false,
                              dislike: false,
                              subscribe: false,
                              shareOnTwitter: false,
                              prompt: "",
                            });
                          }
                        } else if (n < videos.length) {
                          videos = videos.slice(0, n);
                        }
                        activity.videos = videos;
                        activity.numberOfVideos = n;
                        return newInputs;
                      });
                    } else {
                      inputTextChangeHandler(
                        index,
                        InnerIndex,
                        n,
                        "numberOfVideos"
                      );
                      setInputs((prevState) => {
                        const newInputs = { ...prevState };
                        const item = newInputs.inputs[index].inputs[InnerIndex];
                        let videos = Array.isArray(item.videos)
                          ? item.videos
                          : [];
                        if (n > videos.length) {
                          for (let i = videos.length; i < n; i++) {
                            videos.push({
                              youtube_link: "",
                              playDuration: 0,
                              like: false,
                              dislike: false,
                              subscribe: false,
                              shareOnTwitter: false,
                              prompt: "",
                            });
                          }
                        } else if (n < videos.length) {
                          videos = videos.slice(0, n);
                        }
                        item.videos = videos;
                        item.numberOfVideos = n;
                        return newInputs;
                      });
                    }
                  }}
                  min={0}
                  Value={el.numberOfVideos || ""}
                />

                {Array.isArray(el.videos) && el.videos.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    {el.videos.map((video, vIdx) => (
                      <div
                        key={vIdx}
                        style={{
                          border: "1px solid #444",
                          borderRadius: 8,
                          padding: 12,
                          marginBottom: 12,
                        }}
                      >
                        <div
                          style={{
                            marginBottom: 8,
                            fontWeight: 500,
                            color: "#fff",
                          }}
                        >
                          Video #{vIdx + 1}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 12,
                          }}
                        >
                          {/* 1. YouTube URL input */}
                          <InputText
                            label={"YouTube URL:"}
                            type={"text"}
                            placeholder={"Enter YouTube video URL"}
                            name={`youtube_link_${vIdx}`}
                            handler={(val) => {
                              if (options.isMultiAccountActivity) {
                                setInputs((prevState) => {
                                  const newInputs = { ...prevState };
                                  const activity =
                                    newInputs.inputs[options.parentIndex]
                                      .inputs[InnerIndex].MultiAccounts[
                                      options.accountIndex
                                    ].activities[options.actIdx];
                                  activity.videos = Array.isArray(
                                    activity.videos
                                  )
                                    ? activity.videos
                                    : [];
                                  activity.videos[vIdx] = activity.videos[
                                    vIdx
                                  ] || {
                                    youtube_link: "",
                                    playDuration: 0,
                                    like: false,
                                    dislike: false,
                                    subscribe: false,
                                    shareOnTwitter: false,
                                    prompt: "",
                                  };
                                  activity.videos[vIdx].youtube_link = val;
                                  return newInputs;
                                });
                              } else {
                                setInputs((prevState) => {
                                  const newInputs = { ...prevState };
                                  const item =
                                    newInputs.inputs[index].inputs[InnerIndex];
                                  item.videos = Array.isArray(item.videos)
                                    ? item.videos
                                    : [];
                                  item.videos[vIdx] = item.videos[vIdx] || {
                                    youtube_link: "",
                                    playDuration: 0,
                                    like: false,
                                    dislike: false,
                                    subscribe: false,
                                    shareOnTwitter: false,
                                    prompt: "",
                                  };
                                  item.videos[vIdx].youtube_link = val;
                                  return newInputs;
                                });
                              }
                            }}
                            isTaskInputs={true}
                            value={video.youtube_link}
                          />

                          {/* 2. Duration input */}
                          <NumberInput
                            lable={"Play duration (minutes):"}
                            placeholder={"Enter play duration in minutes"}
                            onChange={(value) => {
                              const v = parseInt(value) || 0;
                              if (options.isMultiAccountActivity) {
                                setInputs((prevState) => {
                                  const newInputs = { ...prevState };
                                  const activity =
                                    newInputs.inputs[options.parentIndex]
                                      .inputs[InnerIndex].MultiAccounts[
                                      options.accountIndex
                                    ].activities[options.actIdx];
                                  activity.videos = Array.isArray(
                                    activity.videos
                                  )
                                    ? activity.videos
                                    : [];
                                  activity.videos[vIdx] = activity.videos[
                                    vIdx
                                  ] || {
                                    youtube_link: "",
                                    playDuration: 0,
                                    like: false,
                                    dislike: false,
                                    subscribe: false,
                                    shareOnTwitter: false,
                                    prompt: "",
                                  };
                                  activity.videos[vIdx].playDuration = v;
                                  return newInputs;
                                });
                              } else {
                                setInputs((prevState) => {
                                  const newInputs = { ...prevState };
                                  const item =
                                    newInputs.inputs[index].inputs[InnerIndex];
                                  item.videos = Array.isArray(item.videos)
                                    ? item.videos
                                    : [];
                                  item.videos[vIdx] = item.videos[vIdx] || {
                                    youtube_link: "",
                                    playDuration: 0,
                                    like: false,
                                    dislike: false,
                                    subscribe: false,
                                    shareOnTwitter: false,
                                    prompt: "",
                                  };
                                  item.videos[vIdx].playDuration = v;
                                  return newInputs;
                                });
                              }
                            }}
                            min={0}
                            Value={video.playDuration || ""}
                          />

                          {/* 3. Actions checkboxes */}
                          <div
                            style={{ display: "flex", gap: 24, marginTop: 8 }}
                          >
                            <label
                              style={{
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={!!video.like}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  if (options.isMultiAccountActivity) {
                                    setInputs((prevState) => {
                                      const newInputs = { ...prevState };
                                      const activity =
                                        newInputs.inputs[options.parentIndex]
                                          .inputs[InnerIndex].MultiAccounts[
                                          options.accountIndex
                                        ].activities[options.actIdx];
                                      activity.videos = Array.isArray(
                                        activity.videos
                                      )
                                        ? activity.videos
                                        : [];
                                      activity.videos[vIdx] = activity.videos[
                                        vIdx
                                      ] || {
                                        youtube_link: "",
                                        playDuration: 0,
                                        like: false,
                                        dislike: false,
                                        subscribe: false,
                                        shareOnTwitter: false,
                                        prompt: "",
                                      };
                                      activity.videos[vIdx].like = checked;
                                      return newInputs;
                                    });
                                  } else {
                                    setInputs((prevState) => {
                                      const newInputs = { ...prevState };
                                      const item =
                                        newInputs.inputs[index].inputs[
                                          InnerIndex
                                        ];
                                      item.videos = Array.isArray(item.videos)
                                        ? item.videos
                                        : [];
                                      item.videos[vIdx] = item.videos[vIdx] || {
                                        youtube_link: "",
                                        playDuration: 0,
                                        like: false,
                                        dislike: false,
                                        subscribe: false,
                                        shareOnTwitter: false,
                                        prompt: "",
                                      };
                                      item.videos[vIdx].like = checked;
                                      return newInputs;
                                    });
                                  }
                                }}
                              />
                              Like Video
                            </label>
                            <label
                              style={{
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              {/* <input
                                type="checkbox"
                                checked={!!video.dislike}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  if (options.isMultiAccountActivity) {
                                    setInputs((prevState) => {
                                      const newInputs = { ...prevState };
                                      const activity =
                                        newInputs.inputs[options.parentIndex]
                                          .inputs[InnerIndex].MultiAccounts[
                                          options.accountIndex
                                        ].activities[options.actIdx];
                                      activity.videos = Array.isArray(
                                        activity.videos
                                      )
                                        ? activity.videos
                                        : [];
                                      activity.videos[vIdx] = activity.videos[
                                        vIdx
                                      ] || {
                                        youtube_link: "",
                                        playDuration: 0,
                                        like: false,
                                        dislike: false,
                                        subscribe: false,
                                        shareOnTwitter: false,
                                        prompt: "",
                                      };
                                      activity.videos[vIdx].dislike = checked;
                                      return newInputs;
                                    });
                                  } else {
                                    setInputs((prevState) => {
                                      const newInputs = { ...prevState };
                                      const item =
                                        newInputs.inputs[index].inputs[
                                          InnerIndex
                                        ];
                                      item.videos = Array.isArray(item.videos)
                                        ? item.videos
                                        : [];
                                      item.videos[vIdx] = item.videos[vIdx] || {
                                        youtube_link: "",
                                        playDuration: 0,
                                        like: false,
                                        dislike: false,
                                        subscribe: false,
                                        shareOnTwitter: false,
                                        prompt: "",
                                      };
                                      item.videos[vIdx].dislike = checked;
                                      return newInputs;
                                    });
                                  }
                                }}
                              />
                              Dislike Video
                            </label>
                            <label
                              style={{
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            > */}
                              <input
                                type="checkbox"
                                checked={!!video.subscribe}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  if (options.isMultiAccountActivity) {
                                    setInputs((prevState) => {
                                      const newInputs = { ...prevState };
                                      const activity =
                                        newInputs.inputs[options.parentIndex]
                                          .inputs[InnerIndex].MultiAccounts[
                                          options.accountIndex
                                        ].activities[options.actIdx];
                                      activity.videos = Array.isArray(
                                        activity.videos
                                      )
                                        ? activity.videos
                                        : [];
                                      activity.videos[vIdx] = activity.videos[
                                        vIdx
                                      ] || {
                                        youtube_link: "",
                                        playDuration: 0,
                                        like: false,
                                        dislike: false,
                                        subscribe: false,
                                        shareOnTwitter: false,
                                        prompt: "",
                                      };
                                      activity.videos[vIdx].subscribe = checked;
                                      return newInputs;
                                    });
                                  } else {
                                    setInputs((prevState) => {
                                      const newInputs = { ...prevState };
                                      const item =
                                        newInputs.inputs[index].inputs[
                                          InnerIndex
                                        ];
                                      item.videos = Array.isArray(item.videos)
                                        ? item.videos
                                        : [];
                                      item.videos[vIdx] = item.videos[vIdx] || {
                                        youtube_link: "",
                                        playDuration: 0,
                                        like: false,
                                        dislike: false,
                                        subscribe: false,
                                        shareOnTwitter: false,
                                        prompt: "",
                                      };
                                      item.videos[vIdx].subscribe = checked;
                                      return newInputs;
                                    });
                                  }
                                }}
                              />
                              Subscribe Channel
                            </label>
                            <label
                              style={{
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={!!video.shareOnTwitter}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  if (options.isMultiAccountActivity) {
                                    setInputs((prevState) => {
                                      const newInputs = { ...prevState };
                                      const activity =
                                        newInputs.inputs[options.parentIndex]
                                          .inputs[InnerIndex].MultiAccounts[
                                          options.accountIndex
                                        ].activities[options.actIdx];
                                      activity.videos = Array.isArray(
                                        activity.videos
                                      )
                                        ? activity.videos
                                        : [];
                                      activity.videos[vIdx] = activity.videos[
                                        vIdx
                                      ] || {
                                        youtube_link: "",
                                        playDuration: 0,
                                        like: false,
                                        dislike: false,
                                        subscribe: false,
                                        shareOnTwitter: false,
                                        prompt: "",
                                      };
                                      activity.videos[vIdx].shareOnTwitter =
                                        checked;
                                      return newInputs;
                                    });
                                  } else {
                                    setInputs((prevState) => {
                                      const newInputs = { ...prevState };
                                      const item =
                                        newInputs.inputs[index].inputs[
                                          InnerIndex
                                        ];
                                      item.videos = Array.isArray(item.videos)
                                        ? item.videos
                                        : [];
                                      item.videos[vIdx] = item.videos[vIdx] || {
                                        youtube_link: "",
                                        playDuration: 0,
                                        like: false,
                                        dislike: false,
                                        subscribe: false,
                                        shareOnTwitter: false,
                                        prompt: "",
                                      };
                                      item.videos[vIdx].shareOnTwitter =
                                        checked;
                                      return newInputs;
                                    });
                                  }
                                }}
                              />
                              Share on Twitter
                            </label>
                          </div>

                          {/* Show prompt input if Share on Twitter is checked */}
                          {video.shareOnTwitter && (
                            <InputText
                              label={"Prompt / Notes:"}
                              type={"text"}
                              placeholder={"Enter prompt or instructions"}
                              name={`youtube_prompt_${vIdx}`}
                              handler={(val) => {
                                if (options.isMultiAccountActivity) {
                                  setInputs((prevState) => {
                                    const newInputs = { ...prevState };
                                    const activity =
                                      newInputs.inputs[options.parentIndex]
                                        .inputs[InnerIndex].MultiAccounts[
                                        options.accountIndex
                                      ].activities[options.actIdx];
                                    activity.videos = Array.isArray(
                                      activity.videos
                                    )
                                      ? activity.videos
                                      : [];
                                    activity.videos[vIdx] = activity.videos[
                                      vIdx
                                    ] || {
                                      youtube_link: "",
                                      playDuration: 0,
                                      like: false,
                                      dislike: false,
                                      subscribe: false,
                                      shareOnTwitter: false,
                                      prompt: "",
                                    };
                                    activity.videos[vIdx].prompt = val;
                                    return newInputs;
                                  });
                                } else {
                                  setInputs((prevState) => {
                                    const newInputs = { ...prevState };
                                    const item =
                                      newInputs.inputs[index].inputs[
                                        InnerIndex
                                      ];
                                    item.videos = Array.isArray(item.videos)
                                      ? item.videos
                                      : [];
                                    item.videos[vIdx] = item.videos[vIdx] || {
                                      youtube_link: "",
                                      playDuration: 0,
                                      like: false,
                                      dislike: false,
                                      subscribe: false,
                                      shareOnTwitter: false,
                                      prompt: "",
                                    };
                                    item.videos[vIdx].prompt = val;
                                    return newInputs;
                                  });
                                }
                              }}
                              isTaskInputs={true}
                              value={video.prompt || ""}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        );
      // case "youtubeAndMultiAccounts":
      //   return (
      //     <div className={classes.Inputscontainer}>
      //       {/* Main toggle for MultiAccounts uses parent indices */}
      //       <ToggleInput
      //         el={el}
      //         inputsToggleChangeHandler={inputsToggleChangeHandler}
      //         index={index}
      //         InnerIndex={InnerIndex}
      //       />
      //       {el.input && (
      //         <>
      //           <div className={classes.addbuttonInputContainer}>
      //             <InputWithButton
      //               lable={"Enter Username"}
      //               type="text"
      //               name="accountUsername"
      //               buttonText="Add"
      //               handler={(value) => {
      //                 if (value.trim() === "") {
      //                   failToast("Please enter username");
      //                   return;
      //                 } else if (
      //                   el.MultiAccounts.some(
      //                     (acc) => acc.username === value.trim()
      //                   )
      //                 ) {
      //                   failToast("Username already exists");
      //                   return;
      //                 } else {
      //                   setInputs((prev) => {
      //                     const newInputs = { ...prev };
      //                     const item =
      //                       newInputs.inputs[index].inputs[InnerIndex];
      //                     item.MultiAccounts = [
      //                       ...(item.MultiAccounts || []),
      //                       {
      //                         username: value.trim(),
      //                         activities: [
      //                           {
      //                             type: "toggleAndYoutube",
      //                             name: "Interact and Share a YouTube video",
      //                             description:
      //                               "The bot will interact with a YouTube video using a URL and share the link by posting a new tweet.",
      //                             input: false,
      //                             youtube_link: "",
      //                             prompt: "",
      //                           },
      //                         ],
      //                       },
      //                     ];
      //                     return newInputs;
      //                   });
      //                 }
      //               }}
      //             />
      //           </div>
      //           {el.MultiAccounts && el.MultiAccounts.length !== 0 && (
      //             <>
      //               {el.MultiAccounts.map((account, accountIndex) => {
      //                 const isOpen = openDropdowns[accountIndex];
      //                 return (
      //                   <div
      //                     className={classes.accountContainer}
      //                     key={accountIndex}
      //                   >
      //                     <div className={classes.accountHeaderContainer}>
      //                       <h6 className={classes.accountUsername}>
      //                         {account.username}
      //                       </h6>
      //                       <div className={classes.accountActions}>
      //                         <button
      //                           className={classes.removeAccountBtn}
      //                           onClick={() => {
      //                             setInputs((prev) => {
      //                               const newInputs = { ...prev };
      //                               const item =
      //                                 newInputs.inputs[index].inputs[
      //                                   InnerIndex
      //                                 ];
      //                               item.MultiAccounts =
      //                                 item.MultiAccounts.filter(
      //                                   (_, i) => i !== accountIndex
      //                                 );
      //                               return newInputs;
      //                             });
      //                           }}
      //                           aria-label="Remove account"
      //                         >
      //                           {/* Use your Cross icon component if available */}
      //                           <Cross />
      //                         </button>
      //                         <button
      //                           className={`${classes.accordionButton} ${
      //                             isOpen ? classes.opened : ""
      //                           }`}
      //                           onClick={() => {
      //                             setOpenDropdowns((prev) => ({
      //                               ...prev,
      //                               [accountIndex]: !prev[accountIndex],
      //                             }));
      //                           }}
      //                           aria-label={isOpen ? "Collapse" : "Expand"}
      //                         >
      //                           {isOpen ? (
      //                             <CustomChevronUp />
      //                           ) : (
      //                             <CustomChevronDown />
      //                           )}
      //                         </button>
      //                       </div>
      //                     </div>
      //                     {isOpen && (
      //                       <div className={classes.accordionContent}>
      //                         <p className={classes.setInputsHeading}>
      //                           Please set Inputs for this account:
      //                         </p>
      //                         {account.activities.map((activity, actIdx) => (
      //                           <div
      //                             key={actIdx}
      //                             className={classes.inputWrapper}
      //                           >
      //                             <div className={classes.descriptionContainer}>
      //                               <p>{activity.description}</p>
      //                             </div>
      //                             <div className={classes.inputCont}>
      //                               {/* Activity toggles use accountIndex and actIdx for correct state */}
      //                               {renderInputContent(
      //                                 activity,
      //                                 index,
      //                                 InnerIndex,
      //                                 {
      //                                   isMultiAccountActivity: true,
      //                                   parentIndex: index,
      //                                   accountIndex,
      //                                   actIdx,
      //                                 }
      //                               )}
      //                             </div>
      //                           </div>
      //                         ))}
      //                       </div>
      //                     )}
      //                   </div>
      //                 );
      //               })}
      //             </>
      //           )}
      //         </>
      //       )}
      //     </div>
      //   );

      // ------------------ Inputs for Telegram Bot -----------------------------------//
      case "telegramToggleAndURL":
        return (
          <div className={classes.Inputscontainer}>
            <ToggleInput
              el={el}
              inputsToggleChangeHandler={(idx, innerIdx) =>
                options.isMultiAccountActivity
                  ? inputsToggleChangeHandler(idx, innerIdx, options)
                  : inputsToggleChangeHandler(idx, innerIdx)
              }
              index={index}
              InnerIndex={InnerIndex}
            />
            {el.input && (
              <>
                {/* Number of groups to join */}
                <NumberInput
                  lable={"How many Telegram groups/channels?"}
                  min={0}
                  Value={el.numberOfGroups || 0}
                  onChange={(value) => {
                    const n = parseInt(value) || 0;
                    if (options.isMultiAccountActivity) {
                      setInputs((prevState) => {
                        const newInputs = { ...prevState };
                        const activity =
                          newInputs.inputs[options.parentIndex].inputs[
                            InnerIndex
                          ].MultiAccounts[options.accountIndex].activities[
                            options.actIdx
                          ];
                        let urls = Array.isArray(activity.telegram_group_urls)
                          ? activity.telegram_group_urls
                          : [];
                        if (n > urls.length) {
                          for (let i = urls.length; i < n; i++) urls.push("");
                        } else if (n < urls.length) {
                          urls = urls.slice(0, n);
                        }
                        activity.telegram_group_urls = urls;
                        activity.numberOfGroups = n;
                        return newInputs;
                      });
                    } else {
                      inputTextChangeHandler(
                        index,
                        InnerIndex,
                        n,
                        "numberOfGroups"
                      );
                      setInputs((prevState) => {
                        const newInputs = { ...prevState };
                        const item = newInputs.inputs[index].inputs[InnerIndex];
                        let urls = Array.isArray(item.telegram_group_urls)
                          ? item.telegram_group_urls
                          : [];
                        if (n > urls.length) {
                          for (let i = urls.length; i < n; i++) urls.push("");
                        } else if (n < urls.length) {
                          urls = urls.slice(0, n);
                        }
                        item.telegram_group_urls = urls;
                        item.numberOfGroups = n;
                        return newInputs;
                      });
                    }
                  }}
                />
                {/* Render group URL input fields */}
                {Array.isArray(el.telegram_group_urls) &&
                  el.telegram_group_urls.length > 0 && (
                    <div style={{ marginTop: 0 }}>
                      {el.telegram_group_urls.map((url, gIdx) => (
                        <InputText
                          key={gIdx}
                          label={`Group URL #${gIdx + 1}`}
                          type="text"
                          placeholder="Enter Telegram group/channel URL"
                          name={`telegram_group_url_${gIdx}`}
                          handler={(val) => {
                            if (options.isMultiAccountActivity) {
                              setInputs((prevState) => {
                                const newInputs = { ...prevState };
                                const activity =
                                  newInputs.inputs[options.parentIndex].inputs[
                                    InnerIndex
                                  ].MultiAccounts[options.accountIndex]
                                    .activities[options.actIdx];
                                activity.telegram_group_urls = Array.isArray(
                                  activity.telegram_group_urls
                                )
                                  ? activity.telegram_group_urls
                                  : [];
                                activity.telegram_group_urls[gIdx] = val;
                                return newInputs;
                              });
                            } else {
                              setInputs((prevState) => {
                                const newInputs = { ...prevState };
                                const item =
                                  newInputs.inputs[index].inputs[InnerIndex];
                                item.telegram_group_urls = Array.isArray(
                                  item.telegram_group_urls
                                )
                                  ? item.telegram_group_urls
                                  : [];
                                item.telegram_group_urls[gIdx] = val;
                                return newInputs;
                              });
                            }
                          }}
                          isTaskInputs={true}
                          value={url}
                        />
                      ))}
                    </div>
                  )}
              </>
            )}
          </div>
        );
      case "telegramToggleAndPost":
        return (
          <div className={classes.Inputscontainer}>
            <ToggleInput
              el={el}
              inputsToggleChangeHandler={(idx, innerIdx) =>
                options.isMultiAccountActivity
                  ? inputsToggleChangeHandler(idx, innerIdx, options)
                  : inputsToggleChangeHandler(idx, innerIdx)
              }
              index={index}
              InnerIndex={InnerIndex}
            />
            {el.input && (
              <>
                <NumberInput
                  lable={"How many messages/posts to interact?"}
                  min={0}
                  Value={el.numberOfMessages || 0}
                  onChange={(value) => {
                    const n = parseInt(value) || 0;
                    inputTextChangeHandler(
                      index,
                      InnerIndex,
                      n,
                      "numberOfMessages"
                    );
                    setInputs((prevState) => {
                      const newInputs = { ...prevState };
                      const item = newInputs.inputs[index].inputs[InnerIndex];
                      let messages = Array.isArray(item.messages)
                        ? item.messages
                        : [];
                      if (n > messages.length) {
                        for (let i = messages.length; i < n; i++) {
                          messages.push({
                            url: "",
                            keyword: "",
                            like: false,
                            comment: false,
                            share: false,
                            reply: "",
                            shareGroups: "",
                            report: false,
                          });
                        }
                      } else if (n < messages.length) {
                        messages = messages.slice(0, n);
                      }
                      item.messages = messages;
                      item.numberOfMessages = n;
                      return newInputs;
                    });
                  }}
                />
                {Array.isArray(el.messages) && el.messages.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    {el.messages.map((msg, mIdx) => (
                      <div
                        key={mIdx}
                        style={{
                          border: "1px solid #444",
                          borderRadius: 8,
                          padding: 12,
                          marginBottom: 12,
                        }}
                      >
                        <div
                          style={{
                            marginBottom: 10,
                            fontWeight: 600,
                            color: "#fff",
                          }}
                        >
                          Message #{mIdx + 1}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 15,
                          }}
                        >
                          <div style={{ marginTop: 5 }}>
                            <InputText
                              label={"Message/URL:"}
                              type={"text"}
                              placeholder={"Enter message or URL to interact"}
                              name={`message_url_${mIdx}`}
                              handler={(val) => {
                                setInputs((prevState) => {
                                  const newInputs = { ...prevState };
                                  const item =
                                    newInputs.inputs[index].inputs[InnerIndex];
                                  item.messages = Array.isArray(item.messages)
                                    ? item.messages
                                    : [];
                                  item.messages[mIdx] = item.messages[mIdx] || {
                                    url: "",
                                    keyword: "",
                                    like: false,
                                    comment: false,
                                    share: false,
                                    report: false,
                                    reply: "",
                                    shareGroups: "",
                                  };
                                  item.messages[mIdx].url = val;
                                  return newInputs;
                                });
                              }}
                              isTaskInputs={true}
                              value={msg.url || ""}
                            />
                          </div>
                          <div style={{ marginTop: 5 }}>
                            <InputText
                              label={"Keyword:"}
                              type={"text"}
                              placeholder={"Enter keyword"}
                              name={`keyword_${mIdx}`}
                              handler={(val) => {
                                setInputs((prevState) => {
                                  const newInputs = { ...prevState };
                                  const item =
                                    newInputs.inputs[index].inputs[InnerIndex];
                                  item.messages = Array.isArray(item.messages)
                                    ? item.messages
                                    : [];
                                  item.messages[mIdx] = item.messages[mIdx] || {
                                    url: "",
                                    keyword: "",
                                    like: false,
                                    comment: false,
                                    share: false,
                                    report: false,
                                    reply: "",
                                    shareGroups: "",
                                  };
                                  item.messages[mIdx].keyword = val;
                                  return newInputs;
                                });
                              }}
                              isTaskInputs={true}
                              value={msg.keyword || ""}
                            />
                          </div>
                          <div
                            style={{
                              marginTop: 5,
                              fontWeight: 500,
                              color: "#fff",
                            }}
                          >
                            Actions:
                          </div>
                          <div
                            style={{ display: "flex", gap: 60, marginTop: 0 }}
                          >
                            <label
                              style={{
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={!!msg.like}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setInputs((prevState) => {
                                    const newInputs = { ...prevState };
                                    const item =
                                      newInputs.inputs[index].inputs[
                                        InnerIndex
                                      ];
                                    item.messages = Array.isArray(item.messages)
                                      ? item.messages
                                      : [];
                                    item.messages[mIdx] = item.messages[
                                      mIdx
                                    ] || {
                                      url: "",
                                      keyword: "",
                                      like: false,
                                      comment: false,
                                      share: false,
                                      report: false,
                                      reply: "",
                                      shareGroups: "",
                                    };
                                    item.messages[mIdx].like = checked;
                                    return newInputs;
                                  });
                                }}
                              />
                              Like
                            </label>
                            <label
                              style={{
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={!!msg.comment}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setInputs((prevState) => {
                                    const newInputs = { ...prevState };
                                    const item =
                                      newInputs.inputs[index].inputs[
                                        InnerIndex
                                      ];
                                    item.messages = Array.isArray(item.messages)
                                      ? item.messages
                                      : [];
                                    item.messages[mIdx] = item.messages[
                                      mIdx
                                    ] || {
                                      url: "",
                                      keyword: "",
                                      like: false,
                                      comment: false,
                                      share: false,
                                      report: false,
                                      reply: "",
                                      shareGroups: "",
                                    };
                                    item.messages[mIdx].comment = checked;
                                    return newInputs;
                                  });
                                }}
                              />
                              Comment
                            </label>
                            <label
                              style={{
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={!!msg.share}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setInputs((prevState) => {
                                    const newInputs = { ...prevState };
                                    const item =
                                      newInputs.inputs[index].inputs[
                                        InnerIndex
                                      ];
                                    item.messages = Array.isArray(item.messages)
                                      ? item.messages
                                      : [];
                                    item.messages[mIdx] = item.messages[
                                      mIdx
                                    ] || {
                                      url: "",
                                      keyword: "",
                                      like: false,
                                      comment: false,
                                      share: false,
                                      report: false,
                                      reply: "",
                                      shareGroups: "",
                                    };
                                    item.messages[mIdx].share = checked;
                                    return newInputs;
                                  });
                                }}
                              />
                              Share
                            </label>
                            <label
                              style={{
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={!!msg.report}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setInputs((prevState) => {
                                    const newInputs = { ...prevState };
                                    const item =
                                      newInputs.inputs[index].inputs[
                                        InnerIndex
                                      ];
                                    item.messages = Array.isArray(item.messages)
                                      ? item.messages
                                      : [];
                                    item.messages[mIdx] = item.messages[
                                      mIdx
                                    ] || {
                                      url: "",
                                      keyword: "",
                                      like: false,
                                      comment: false,
                                      share: false,
                                      report: false,
                                      reply: "",
                                      shareGroups: "",
                                    };
                                    item.messages[mIdx].report = checked;
                                    return newInputs;
                                  });
                                }}
                              />
                              Report
                            </label>
                          </div>
                        </div>
                        {/* Show reply input and language dropdown if comment is checked */}
                        {msg.comment && (
                          <div
                            style={{
                              marginTop: 15,
                              display: "flex",
                              gap: 16,
                              alignItems: "flex-end",
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <InputText
                                label={"Reply to post:"}
                                type={"text"}
                                placeholder={"Enter reply text"}
                                name={`reply_${mIdx}`}
                                handler={(val) => {
                                  setInputs((prevState) => {
                                    const newInputs = { ...prevState };
                                    const item =
                                      newInputs.inputs[index].inputs[
                                        InnerIndex
                                      ];
                                    item.messages = Array.isArray(item.messages)
                                      ? item.messages
                                      : [];
                                    item.messages[mIdx] = item.messages[
                                      mIdx
                                    ] || {
                                      url: "",
                                      keyword: "",
                                      like: false,
                                      comment: false,
                                      share: false,
                                      reply: "",
                                      report: false,
                                      shareGroups: "",
                                      language: "English",
                                    };
                                    item.messages[mIdx].reply = val;
                                    return newInputs;
                                  });
                                }}
                                isTaskInputs={true}
                                value={msg.reply || ""}
                              />
                            </div>
                            <div style={{ minWidth: 160 }}>
                              <label
                                style={{
                                  color: "#fff",
                                  fontWeight: 50,
                                  marginBottom: 4,
                                  display: "block",
                                }}
                              >
                                Language:
                              </label>
                              <select
                                style={{
                                  padding: "6px 12px",
                                  borderRadius: 6,
                                  border: "1px solid #000",
                                  background: "#101010",
                                  color: "#fff",
                                  minWidth: 150,
                                  marginBottom: 4,
                                }}
                                value={msg.language || "English"}
                                onChange={(e) => {
                                  setInputs((prevState) => {
                                    const newInputs = { ...prevState };
                                    const item =
                                      newInputs.inputs[index].inputs[
                                        InnerIndex
                                      ];
                                    item.messages = Array.isArray(item.messages)
                                      ? item.messages
                                      : [];
                                    item.messages[mIdx] = item.messages[
                                      mIdx
                                    ] || {
                                      url: "",
                                      keyword: "",
                                      like: false,
                                      comment: false,
                                      share: false,
                                      reply: "",
                                      report: false,
                                      shareGroups: "",
                                      language: "English",
                                    };
                                    item.messages[mIdx].language =
                                      e.target.value;
                                    return newInputs;
                                  });
                                }}
                              >
                                <option value="English">English</option>
                                <option value="Russian">Russian</option>
                                <option value="Georgian">Georgian</option>
                              </select>
                            </div>
                          </div>
                        )}
                        {/* Show group names input if share is checked */}
                        {msg.share && (
                          <div style={{ marginTop: 15 }}>
                            <InputText
                              label={"Groups to share in (comma separated):"}
                              type={"text"}
                              placeholder={
                                "Enter group names, separated by commas"
                              }
                              name={`shareGroups_${mIdx}`}
                              handler={(val) => {
                                setInputs((prevState) => {
                                  const newInputs = { ...prevState };
                                  const item =
                                    newInputs.inputs[index].inputs[InnerIndex];
                                  item.messages = Array.isArray(item.messages)
                                    ? item.messages
                                    : [];
                                  item.messages[mIdx] = item.messages[mIdx] || {
                                    url: "",
                                    keyword: "",
                                    like: false,
                                    comment: false,
                                    share: false,
                                    reply: "",
                                    report: false,
                                    shareGroups: "",
                                  };
                                  item.messages[mIdx].shareGroups = val;
                                  return newInputs;
                                });
                              }}
                              isTaskInputs={true}
                              value={msg.shareGroups || ""}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        );
      case "telegramToggleAndPostShare":
        return (
          <div className={classes.Inputscontainer}>
            <ToggleInput
              el={el}
              inputsToggleChangeHandler={(idx, innerIdx) =>
                options.isMultiAccountActivity
                  ? inputsToggleChangeHandler(idx, innerIdx, options)
                  : inputsToggleChangeHandler(idx, innerIdx)
              }
              index={index}
              InnerIndex={InnerIndex}
            />
            {el.input && (
              <>
                <InputText
                  label={"Enter the URL of the group:"}
                  type={"text"}
                  placeholder={"Place URL here"}
                  name={"group_link"}
                  handler={(val) => {
                    inputTextChangeHandler(
                      index,
                      InnerIndex,
                      val,
                      "group_link"
                    );
                  }}
                  isTaskInputs={true}
                  value={el.group_link}
                />
                {/* Language Dropdown */}
                <div style={{ margin: "5px 0" }}>
                  <label
                    style={{
                      color: "#fff",
                      fontWeight: 500,
                      marginBottom: 2,
                      display: "block",
                    }}
                  >
                    Language:
                  </label>
                  <select
                    style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      border: "1px solid #000",
                      background: "#010",
                      color: "#fff",
                      minWidth: 150,
                    }}
                    value={el.language || "English"}
                    onChange={(e) => {
                      inputTextChangeHandler(
                        index,
                        InnerIndex,
                        e.target.value,
                        "language"
                      );
                    }}
                  >
                    <option value="English">English</option>
                    <option value="Russian">Russian</option>
                    <option value="Georgian">Georgian</option>
                  </select>
                </div>
                <InputText
                  label={"Enter the Prompt for the message here:"}
                  type={"text"}
                  placeholder={"Place prompt here"}
                  name={"prompt"}
                  handler={(val) => {
                    inputTextChangeHandler(index, InnerIndex, val, "prompt");
                  }}
                  isTaskInputs={true}
                  value={el.prompt}
                />
                <InputText
                  label={"Groups to share in (comma separated):"}
                  type={"text"}
                  placeholder={"Enter group names, separated by commas"}
                  name={"shareGroups"}
                  handler={(val) => {
                    inputTextChangeHandler(
                      index,
                      InnerIndex,
                      val,
                      "shareGroups"
                    );
                  }}
                  isTaskInputs={true}
                  value={el.shareGroups || ""}
                />
              </>
            )}
          </div>
        );
      case "telegramToggleAndReport":
        return (
          <div className={classes.Inputscontainer}>
            <ToggleInput
              el={el}
              inputsToggleChangeHandler={(idx, innerIdx) =>
                options.isMultiAccountActivity
                  ? inputsToggleChangeHandler(idx, innerIdx, options)
                  : inputsToggleChangeHandler(idx, innerIdx)
              }
              index={index}
              InnerIndex={InnerIndex}
            />
            {el.input && (
              <>
                <InputText
                  label={"Enter the Username (e.g., @wacko0247_bot):"}
                  type={"text"}
                  placeholder={"Place username here"}
                  name={"username"}
                  handler={(val) => {
                    inputTextChangeHandler(index, InnerIndex, val, "username");
                  }}
                  isTaskInputs={true}
                  value={el.username}
                />
                <InputText
                  label={"Enter the name (e.g., wackoCity):"}
                  type={"text"}
                  placeholder={"Place name here"}
                  name={"bot_name"}
                  handler={(val) => {
                    inputTextChangeHandler(index, InnerIndex, val, "bot_name");
                  }}
                  isTaskInputs={true}
                  value={el.bot_name}
                />
                <NumberInput
                  lable={"Number of reports:"}
                  min={1}
                  Value={el.reportsPerDay || 1}
                  onChange={(value) => {
                    const n = parseInt(value) || 1;
                    inputTextChangeHandler(
                      index,
                      InnerIndex,
                      n,
                      "reportsPerDay"
                    );
                  }}
                />
              </>
            )}
          </div>
        );
      default:
        return <p>Unknown input type</p>;
    }
  }
  return (
    inputs && (
      <div className={classes.main}>
        <div className={classes.inputsContainer}>
          {inputs.inputs.map((el, index) => {
            return (
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
                  <p>{el.name}</p>
                </button>
                {inputsShowList.includes(index) && (
                  <div className={classes.hiddendiv}>
                    {el.inputs.map((input, innerIndex) => {
                      return (
                        <>
                          <div key={innerIndex}>
                            <div className={classes.descriptionContainer}>
                              <p>{input.description}</p>
                            </div>
                            <div className={classes.inputCont}>
                              {renderInputContent(input, index, innerIndex)}
                            </div>
                          </div>
                        </>
                      );
                    })}
                    {el.name.trim() === "User Interaction Speed" && (
                      <p className={classes.tableP}>
                        User Interaction Speed Limits Table{" "}
                        <BlueButton handler={showTableHanler}>
                          <Table /> Table
                        </BlueButton>
                        {showUserInteractionTable && (
                          <CompleteOverlay>
                            <UserinteractionTable
                              hideFormHandler={hideFormHandler}
                              showState={showUserInteractionTable}
                            />
                          </CompleteOverlay>
                        )}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <GreyButton handler={NextHandler}>Next</GreyButton>
      </div>
    )
  );
}

export default Input;
