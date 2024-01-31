import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { editUserDetails } from "@/types/user";

const initialState: editUserDetails = {
  id: "",
  name: "",
  email: "",
  aadhar: "",
  doj: "",
  image: "",
  pan: "",
  position: "",
  role: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    editUser: (state, action: PayloadAction<Partial<editUserDetails>>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { editUser } = userSlice.actions;
export const userSelector = (state: RootState) => state.userReducer;
export default userSlice.reducer;
