import { createSlice } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

const initialState = {
  isLoading: false,
  error: null,
  users: [],
  user: null,
  customers:[],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    getUsersSuccess(state, action) {
      state.isLoading = false;
      state.users = action.payload;
    },
    getUserSuccess(state, action) {
      state.isLoading = false;
      state.user = action.payload;
    },
    updateUser(state, action) {
      state.isLoading = false;
      const index = state.users.findIndex((user) => user.id === action.payload.id);
      if (index >= 0) {
        state.users[index] = action.payload;
      }
    },
    getCustomerSuccess(state, action) {
      state.isLoading = false;
      state.customers = action.payload.customer;
      console.log("action.payload.customer" , action.payload.customer);
    }
  },
});

export const { startLoading, hasError, getUsersSuccess, getUserSuccess, updateUser, getCustomerSuccess } = userSlice.actions;

export default userSlice.reducer;

// Thunks for async actions
export function fetchUsers() {
  return async (dispatch) => {
    dispatch(startLoading());
    try {
      const response = await axios.post('/api/users/getAll');
      console.log("response" ,response.data.users);
      dispatch(getUsersSuccess(response.data.users));
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

export function fetchUser(userId) {
  return async (dispatch) => {
    dispatch(startLoading());
    try {
      const response = await axios.get(`/api/users/${userId}`);
      dispatch(getUserSuccess(response.data.user));
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}


// Thunk to update user verification status
export function updateAdminVerified(userId, adminVerified) {
  return async (dispatch) => {
    dispatch(startLoading());
    try {
      const response = await axios.patch(`/api/users/${userId}`, { adminVerified });
      dispatch(updateUser(response.data));
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// Thunk to get Customers information status
export function getCustomers() {
  return async (dispatch) => {
    dispatch(startLoading());
    try {
      const response = await axios.post("/api/users/getCustomer");
      dispatch(getCustomerSuccess(response.data));
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}