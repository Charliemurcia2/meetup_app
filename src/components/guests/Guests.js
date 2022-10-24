import React, { Fragment, useContext } from "react";
// import loadedMeetupsReducer, { types } from '../../Reducers/loadedMeetupsReducer'
import MeetupsContext from "../../store/meetups-context";
import useRequest from "../../hooks/use-request";

import classes from "./Guests.module.css";
import { types } from "../../Reducers/reducer";

const Guests = (props) => {
  const { state, URLS, dispatch } = useContext(MeetupsContext);
  const { callAPI } = useRequest();
  const meetupAttendees =
    typeof props.meetup.attendeesId === "string"
      ? props.meetup.attendeesId.split(",")
      : props.meetup.attendeesId;

  let guests = [];
  if (!meetupAttendees) {
    guests = [];
  } else {
    meetupAttendees.forEach((attendee) => {
      const realAttendee = state.users.filter((user) => user.id === attendee);
      if (realAttendee[0]) {
        guests.push(realAttendee[0]);
      }
    });
  }

  const deleteAttendee = (guestId) => {
    const removeAttendeeFromMeetup = meetupAttendees.filter(
      (attendee) => attendee !== guestId
    );
    callAPI(`${URLS.meetup}/${props.meetup.id}.json`, "PATCH", {
      attendeesId: removeAttendeeFromMeetup,
    }).then(() => {
      callAPI(`${URLS.meetup}.json`).then((data) => {
        dispatch({
          type: types.formattingData,
          payload: data,
        });
      });
    });
  };

  return (
    <Fragment>
      {/* {usersState.showUsers && <UsersSelect meetup={props.meetup}/>} */}
      <div className={classes["guests-card"]}>
        <h2>
          Attendees <span>({guests.length})</span>
        </h2>
        {guests && (
          <ul>
            {guests.map((guest) => (
              <li key={guest.id}>
                <img src={guest.image} alt="profile" />
                <p>{guest.name}</p>
                <button onClick={(event) => deleteAttendee(guest.id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Fragment>
  );
};

export default Guests;
