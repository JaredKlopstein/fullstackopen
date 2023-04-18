import { createSlice } from '@reduxjs/toolkit'
  
const filterSlice = createSlice({
    name: 'filter',
    initialState: '',
    reducers: {
      setFilter: (state, action) => {
        return action.payload;
      }
    }
  });

  export const filterChange = filter => {
    return setFilter(filter);
  }

  export const { setFilter } = filterSlice.actions;
  export default filterSlice.reducer;