import React from "react";
import { useContext } from "react";
import { useLocation } from "react-router-dom";

import classes from "./MeetupItem.module.css";
import Card from "../ui/Card";
import FavoritesContext from "../../store/favorites-context";
import useRequest from "../../hooks/use-request";
import MeetupsContext from "../../store/meetups-context";
import UsersCard from "../ui/UsersCard";
import Guests from "../guests/Guests";
import { types } from "../../Reducers/reducer";

const MeetupItem = (props) => {
  const location = useLocation();

  const { image, title, description, address, id, date, attendeesId } =
    props.meetup;

  const { URLS, dispatch, state } = useContext(MeetupsContext);
  const url = URLS.meetup;
  const favoritesCtx = useContext(FavoritesContext);
  const itemIsFavorite = favoritesCtx.itemIsFavorite(id);
  const { callAPI } = useRequest();

  const toggleFavoriteStatusHandler = () => {
    if (itemIsFavorite) {
      favoritesCtx.removeFavorite(id);
    } else {
      favoritesCtx.addFavorite({
        id,
        title,
        description,
        image,
        address,
        date,
        attendeesId,
      });
    }
  };

  const deleteMeetupHandler = () => {
    callAPI(`${url}/${id}.json`, "DELETE").then(() => {
      callAPI(`${URLS.meetup}.json`).then((data) => {
        dispatch({
          type: types.formattingData,
          payload: data,
        });
      });
      dispatch({
        type: types.isPopupDelete,
      });
    });
    console.log("after: ", state.isPopupDelete);
  };

  return (
    <li className={classes.item}>
      <Card>
        <div className={classes.image}>
          <img src={image} alt="" />
        </div>
        <div className={classes.content}>
          <h3>{title}</h3>
          <p>{date}</p>
          <address>{address}</address>
          <p>{description}</p>
        </div>
        <div className={classes.actions}>
          <button onClick={toggleFavoriteStatusHandler}>
            {itemIsFavorite ? "Removed from favorites" : "To Favorites"}
          </button>
          {location.pathname === "/" ? (
            <button onClick={deleteMeetupHandler}>Delete Meetup</button>
          ) : (
            ""
          )}
        </div>
        <UsersCard>
          <Guests meetup={props.meetup}></Guests>
        </UsersCard>
      </Card>
    </li>
  );
};

export default MeetupItem;
