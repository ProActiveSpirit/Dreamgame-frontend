import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  allOrders: [], // Stores all SalesOrders
  newOrder: null, // Ne
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
      state.newOrder = action.payload;
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

    // SAVE RELATED PURCHASE ORDER
    saveRelatedPurchase(state, action) {
      state.isLoading = false;
      // Implementation of saveRelatedPurchase action
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
  saveRelatedPurchase,
} = slice.actions;

export function getSalesOrders() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const allOrders = await axios.get('/api/order/getSalesAll');
      console.log("allOrders" , allOrders.data.salesOrders);
      dispatch(slice.actions.getSalesOrdersSuccess(allOrders.data.salesOrders));
    } catch (error) {
      console.error("Error fetching sales orders: ", error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function createSalesOrder(newOrder) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/order/addSales', newOrder);
      console.log("response" , response.data.data);
      dispatch(slice.actions.createSalesOrderSuccess(response.data.data));
      return {success: true, data: response.data.data}

    } catch (error) {
      console.error("Error creating sales order: ", error);
      dispatch(slice.actions.hasError(error));
      return { success: false, error }; 

    }
  };
}

export function updateSalesOrder(updatedOrder) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/api/order/editSales`, updatedOrder);
      dispatch(slice.actions.updateSalesOrderSuccess(response.data));
      return {success: true, data: response.data.data}

    } catch (error) {
      console.error("Error updating sales order: ", error);
      dispatch(slice.actions.hasError(error));
      return { success: false, error }; 
    }
  };
}

export function deleteSalesOrder(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.delete(`/api/order/deleteSale/${id}`);
      dispatch(slice.actions.deleteSalesOrderSuccess(id));
    } catch (error) {
      console.error("Error deleting sales order: ", error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function saveRelatedPurchaseOrder(id, data) {
  return async (dispatch) => {
    try {
      dispatch(slice.actions.startLoading());
      const response = await axios.put(`/api/order/saveRelatedPurchase/${id}`, data);
      dispatch(slice.actions.saveRelatedPurchase(data));
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error("Error in saveRelatedPurchaseOrder:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      dispatch(slice.actions.hasError(error));
      return { success: false, error };
    }
  };
}