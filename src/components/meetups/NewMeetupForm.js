import React, { useContext } from "react";
import useInput from "../../hooks/use-input";
import useRequest from "../../hooks/use-request";
import MeetupsContext from "../../store/meetups-context";
import { types } from "../../Reducers/reducer";
import { useHistory } from "react-router-dom";

import Card from "../ui/Card";
import classes from "./NewMeetupForm.module.css";

const notEmptyValidation = (value) => value.trim() !== "";
const imageValidation = (value) => {
  const regex = new RegExp(
    "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
  );
  return regex.test(value);
};

const NewMeetupForm = (props) => {
  const { callAPI } = useRequest();
  const meetupsCtx = useContext(MeetupsContext);
  const history = useHistory();

  const {
    value: enteredTitle,
    valueChangeHandler: titleChangeHandler,
    isValid: enteredTitleIsValid,
    hasError: titleInputHasError,
    inputBlurHandler: titleBlurHandler,
    clearInput: clearTitle,
  } = useInput(notEmptyValidation);
  const {
    value: enteredImage,
    valueChangeHandler: imageChangeHandler,
    isValid: enteredImageIsValid,
    hasError: imageInputHasError,
    inputBlurHandler: imageBlurHandler,
    clearInput: clearImage,
  } = useInput(imageValidation);
  const {
    value: enteredAddress,
    valueChangeHandler: addressChangeHandler,
    isValid: enteredAddressIsValid,
    hasError: addressInputHasError,
    inputBlurHandler: addressBlurHandler,
    clearInput: clearAddress,
  } = useInput(notEmptyValidation);
  const {
    value: enteredDescription,
    valueChangeHandler: descriptionChangeHandler,
    isValid: enteredDescriptionIsValid,
    hasError: descriptionInputHasError,
    inputBlurHandler: descriptionBlurHandler,
    clearInput: clearDescription,
  } = useInput(notEmptyValidation);
  const {
    value: enteredDate,
    valueChangeHandler: dateChangeHandler,
    isValid: enteredDateIsValid,
    hasError: dateInputHasError,
    inputBlurHandler: dateBlurHandler,
    clearInput: clearDate,
  } = useInput(notEmptyValidation);

  let formIsValid = false;

  if (
    enteredTitleIsValid &&
    enteredImageIsValid &&
    enteredAddressIsValid &&
    enteredDescriptionIsValid &&
    enteredDateIsValid
  ) {
    formIsValid = true;
  }

  const submitHandler = (event) => {
    event.preventDefault();

    const meetupData = {
      title: enteredTitle,
      image: enteredImage,
      address: enteredAddress,
      description: enteredDescription,
      date: enteredDate,
      attendeesId: "",
    };

    callAPI(`${meetupsCtx.URLS.meetup}.json`, "POST", meetupData).then(() => {
      callAPI(`${meetupsCtx.URLS.meetup}.json`).then((data) => {
        meetupsCtx.dispatch({
          type: types.formattingData,
          payload: data,
        });
      });
      clearTitle();
      clearImage();
      clearAddress();
      clearDate();
      clearDescription();
    });
  };

  const titleInputClasses = titleInputHasError
    ? `${classes.control} ${classes.invalid}`
    : classes.control;
  const imageInputClasses = imageInputHasError
    ? `${classes.control} ${classes.invalid}`
    : classes.control;
  const addressInputClasses = addressInputHasError
    ? `${classes.control} ${classes.invalid}`
    : classes.control;
  const descriptionInputClasses = descriptionInputHasError
    ? `${classes.control} ${classes.invalid}`
    : classes.control;
  const dateInputClasses = dateInputHasError
    ? `${classes.control} ${classes.invalid}`
    : classes.control;

  return (
    <Card>
      <form className={classes.form} onSubmit={submitHandler}>
        <div className={titleInputClasses}>
          <label htmlFor="title">Meetup Title</label>
          <input
            type="text"
            required
            id="title"
            value={enteredTitle}
            onChange={titleChangeHandler}
            onBlur={titleBlurHandler}
          />
        </div>
        {titleInputHasError && (
          <p className={classes.feed}>Title must not be empty</p>
        )}
        <div className={imageInputClasses}>
          <label htmlFor="image">Meetup Image</label>
          <input
            type="url"
            required
            id="image"
            value={enteredImage}
            onChange={imageChangeHandler}
            onBlur={imageBlurHandler}
          />
        </div>
        {imageInputHasError && (
          <p className={classes.feed}>Please enter valid image url</p>
        )}
        <div className={addressInputClasses}>
          <label htmlFor="address">Address</label>
          <input
            type="text"
            required
            id="address"
            value={enteredAddress}
            onChange={addressChangeHandler}
            onBlur={addressBlurHandler}
          />
        </div>
        <div className={dateInputClasses}>
          <label htmlFor="date">Date</label>
          <input
            type="date"
            required
            id="date"
            value={enteredDate}
            onChange={dateChangeHandler}
            onBlur={dateBlurHandler}
          />
        </div>
        {dateInputHasError && (
          <p className={classes.feed}>Please enter a date</p>
        )}
        <div className={descriptionInputClasses}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            required
            rows="5"
            value={enteredDescription}
            onChange={descriptionChangeHandler}
            onBlur={descriptionBlurHandler}
          ></textarea>
        </div>
        {descriptionInputHasError && (
          <p className={classes.feed}>Description must not be empty</p>
        )}
        <div className={classes.actions}>
          <button disabled={!formIsValid}>Add Meetup</button>
        </div>
      </form>
    </Card>
  );
};

export default NewMeetupForm;
