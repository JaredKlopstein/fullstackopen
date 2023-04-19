import { createSlice } from '@reduxjs/toolkit'
  
const notificationSlice = createSlice({

    name: 'notification',
    initialState: 'Error',
    reducers: {
      setNotification: (state, action) => {
        return action.payload;
      }
    }
  });
  export const notificationChange = notification => {
    return setNotification(notification);
  }
  
  export const { setNotification } = notificationSlice.actions;
  export default notificationSlice.reducer;