import { createSlice } from '@reduxjs/toolkit'
  
const notificationSlice = createSlice({

    name: 'notification',
    initialState: '',
    reducers: {
      setNotification: (state, action) => {
        return action.payload;
      },
    }
  });

  export const notificationChange = notification => {
    return setNotification(notification);
  }
  export const setAndRemoveNotification = (notification) => {
    return (dispatch) => {
      dispatch(setNotification(notification));
      
      setTimeout(() => {
        dispatch(setNotification(''));
      }, 5000);
    };
  };
  
  export const { setNotification,removeNotification } = notificationSlice.actions;
  export default notificationSlice.reducer;