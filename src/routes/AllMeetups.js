import React, { useContext, useEffect } from 'react'

import MeetupList from '../components/meetups/MeetupList'
import DeletePopup from '../components/layout/DeletePopup'
// import SearchBar from '../components/layout/SearchBar'
import Loading from '../components/layout/Loading'
import useRequest from '../hooks/use-request'
import MeetupsContext from '../store/meetups-context'
import { types } from '../Reducers/reducer'



const AllMeetups = () => {
  const meetupCtx = useContext(MeetupsContext)
  const { URLS,  dispatch} = meetupCtx

  const {isLoading, callAPI} = useRequest()



  useEffect(() => {
    callAPI(`${URLS.meetup}.json`)
    .then(data => {
      dispatch({
        type: types.formattingData,
        payload: data
      })
    })
    callAPI(`${URLS.users}.json`)
    .then(data => {
      dispatch({
        type: types.formattingUsers,
        payload: data
      })
    })  
  }, []);

  return (
    <section>
      {isLoading && <Loading />}
      <DeletePopup />
      {/* <SearchBar /> */}
      <h1>All Meetups</h1>
      <MeetupList />
    </section>
  )
}

export default AllMeetups
