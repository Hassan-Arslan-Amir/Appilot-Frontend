// export default Input;
import RightChevron from "../../../../assets/Icons/RightChevron";
import GreyButton from "../../../Buttons/GreyButton";
import classes from "./Input.module.css";
import { useEffect, useState } from "react";
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

  function inputsToggleChangeHandler(index, InnerIndex) {
    setInputs((prevState) => {
      if (prevState.type === "one") {
        return {
          ...prevState,
          inputs: prevState.inputs.map((item, i) =>
            i === index
              ? {
                  ...item,
                  inputs: item.inputs.map((el) => {
                    return { ...el, input: !el.input };
                  }),
                }
              : {
                  ...item,
                  inputs: item.inputs.map((el) => {
                    return { ...el, input: false };
                  }),
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

  function renderInputContent(el, index, InnerIndex) {
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
                                  accountIndex,
                                  inputIndex
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
      // Inputs for the Twitter Bot
      case "toggleAndInput":
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
                <NumberInput
                  lable={"How many profiles?"}
                  onChange={(value) => {
                    // Initialize posts array if not present or adjust its length
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
                        // Add new empty post objects
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
                              newInputs.inputs[index].inputs[InnerIndex].posts[
                                postIdx
                              ].username = val;
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
                              newInputs.inputs[index].inputs[InnerIndex].posts[
                                postIdx
                              ].numOfPosts = value;
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
                                newInputs.inputs[index].inputs[
                                  InnerIndex
                                ].posts[postIdx].numberOfLikes = value;
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
                                newInputs.inputs[index].inputs[
                                  InnerIndex
                                ].posts[postIdx].numberOfComments = value;
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
                                newInputs.inputs[index].inputs[
                                  InnerIndex
                                ].posts[postIdx].numberOfReposts = value;
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
                                newInputs.inputs[index].inputs[
                                  InnerIndex
                                ].posts[postIdx].numberOfQuotes = value;
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
                              newInputs.inputs[index].inputs[InnerIndex].posts[
                                postIdx
                              ].commentType = val;
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
              inputsToggleChangeHandler={inputsToggleChangeHandler}
              index={index}
              InnerIndex={InnerIndex}
            />
            {el.input && (
              <InputText
                label={"Enter Space Link:"}
                type={"text"}
                placeholder={"Place Space Link here"}
                name={"space_link"}
                handler={(val) => {
                  inputTextChangeHandler(index, InnerIndex, val, "space_link");
                }}
                isTaskInputs={true}
                value={el.space_link}
              />
            )}
          </div>
        );

      case "toggleAndRetweet":
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
                <NumberInput
                  lable={"How many Tweets?"}
                  onChange={(value) => {
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
                              newInputs.inputs[index].inputs[
                                InnerIndex
                              ].tweetData[idx].url = val;
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
                                  newInputs.inputs[index].inputs[
                                    InnerIndex
                                  ].tweetData[idx].like = e.target.checked;
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
                                  newInputs.inputs[index].inputs[
                                    InnerIndex
                                  ].tweetData[idx].comment = e.target.checked;
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
                                  newInputs.inputs[index].inputs[
                                    InnerIndex
                                  ].tweetData[idx].repost = e.target.checked;
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
                                  newInputs.inputs[index].inputs[
                                    InnerIndex
                                  ].tweetData[idx].quote = e.target.checked;
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
                                  newInputs.inputs[index].inputs[
                                    InnerIndex
                                  ].tweetData[idx].commentPrompt = val;
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
              inputsToggleChangeHandler={inputsToggleChangeHandler}
              index={index}
              InnerIndex={InnerIndex}
            />
            {el.input && (
              <InputText
                label={"Enter Prompt here along with #Hashtags and @Mentions: "}
                type={"text"}
                placeholder={"Place Prompt here"}
                name={"prompt"}
                handler={(val) => {
                  inputTextChangeHandler(index, InnerIndex, val, "prompt");
                }}
                isTaskInputs={true}
                value={el.prompt}
              />
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
      case "toggleAndProbability":
        if (!el.date) {
          setInputs((prevState) => {
            const newInputs = { ...prevState };
            newInputs.inputs[index].inputs[InnerIndex] = {
              ...el,
              date: getTodayDDMMYYYY(),
            };
            return newInputs;
          });
        }
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
                <div style={{ marginTop: 10 }}>
                  <label style={{ fontWeight: 500, color: "#fff" }}>
                    Date:
                  </label>
                  <input
                    type="text"
                    value={el.date || getTodayDDMMYYYY()}
                    onChange={(e) => {
                      inputTextChangeHandler(
                        index,
                        InnerIndex,
                        e.target.value,
                        "date"
                      );
                    }}
                    readOnly={false}
                    style={{
                      marginLeft: 8,
                      padding: 4,
                      borderRadius: 4,
                      border: "1px solid #000",
                      width: 120,
                      backgroundColor: "#000",
                      color: "#fff",
                    }}
                  />
                </div>
                <NumberInput
                  lable={"Probability:"}
                  onChange={(value) => {
                    inputTextChangeHandler(
                      index,
                      InnerIndex,
                      value,
                      "probability"
                    );
                  }}
                  min={0}
                  Value={el.probability}
                />
                <NumberInput
                  lable={"Number of Tweets to Interact Daily:"}
                  onChange={(value) => {
                    inputTextChangeHandler(
                      index,
                      InnerIndex,
                      value,
                      "tweetsPerDay"
                    );
                  }}
                  min={0}
                  Value={el.tweetsPerDay}
                />
              </>
            )}
            {/* Always render the date field (hidden) so it's sent to backend even if toggle is off */}
            <input
              type="hidden"
              value={el.date || getTodayDDMMYYYY()}
              readOnly
              name="date"
            />
          </div>
        );

      default:
        return <p>Unknown input type</p>;
    }
  }
  return (
    inputs && (
      // inputs?.inputs?.lenght > 0 && (
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
