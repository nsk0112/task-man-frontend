import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    is_open: false
}


export const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        toggle: (state) => {
            state.is_open = !state.is_open
          },
    }
})


export const { toggle } = sidebarSlice.actions;

export default sidebarSlice.reducer;



