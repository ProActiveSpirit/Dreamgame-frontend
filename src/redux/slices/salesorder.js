import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  allOrders: [], // Stores all SalesOrders
  order: null,   // Stores a single selected SalesOrder
};

const slice = createSlice({
  name: 'SalesOrders',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HANDLE ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // READ: Get All Sales Orders
    getSalesOrdersSuccess(state, action) {
      state.isLoading = false;
      state.allOrders = action.payload;
    },

    // READ: Get a Single Sales Order
    getSalesOrderSuccess(state, action) {
      state.isLoading = false;
      state.order = action.payload;
    },

    // CREATE: Add a New Sales Order
    createSalesOrderSuccess(state, action) {
      state.isLoading = false;
      state.allOrders.push(action.payload);
    },

    // UPDATE: Update an Existing Sales Order
    updateSalesOrderSuccess(state, action) {
      state.isLoading = false;
      const updatedOrder = action.payload;
      const index = state.allOrders.findIndex((order) => order.id === updatedOrder.id);
      if (index !== -1) {
        state.allOrders[index] = updatedOrder;
      }
    },

    // DELETE: Delete a Sales Order
    deleteSalesOrderSuccess(state, action) {
      state.isLoading = false;
      const deletedOrderId = action.payload;
      state.allOrders = state.allOrders.filter((order) => order.id !== deletedOrderId);
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  startLoading,
  hasError,
  getSalesOrdersSuccess,
  getSalesOrderSuccess,
  createSalesOrderSuccess,
  updateSalesOrderSuccess,
  deleteSalesOrderSuccess,
} = slice.actions;

export function getSalesOrders() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const allOrders = await axios.get('/api/order/getSalesAll');
      dispatch(slice.actions.getSalesOrdersSuccess(allOrders));
    } catch (error) {
      console.error("Error fetching sales orders: ", error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getSalesOrder(name) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/order/getSale', {
        params: { name },
      });
      dispatch(slice.actions.getSalesOrderSuccess(response.data));
    } catch (error) {
      console.error("Error fetching sales order: ", error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function createSalesOrder(newOrder) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/order/addSales', newOrder);
      dispatch(slice.actions.createSalesOrderSuccess(response.data));
    } catch (error) {
      console.error("Error creating sales order: ", error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateSalesOrder(id, updatedOrder) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/api/order/editSales/${id}`, updatedOrder);
      dispatch(slice.actions.updateSalesOrderSuccess(response.data));
    } catch (error) {
      console.error("Error updating sales order: ", error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteSalesOrder(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.delete(`/api/order/SalesOrder/${id}`);
      dispatch(slice.actions.deleteSalesOrderSuccess(id));
    } catch (error) {
      console.error("Error deleting sales order: ", error);
      dispatch(slice.actions.hasError(error));
    }
  };
}