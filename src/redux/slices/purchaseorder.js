import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  allOrders: [], // Stores all PurchaseOrders
  order: null,   // Stores a single selected PurchaseOrder
};

const slice = createSlice({
  name: 'PurchaseOrders',
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

    // READ: Get All Purchase Orders
    getPurchaseOrdersSuccess(state, action) {
      state.isLoading = false;
      state.allOrders = action.payload;
    },

    // READ: Get a Single Purchase Order
    getPurchaseOrderSuccess(state, action) {
      state.isLoading = false;
      state.order = action.payload;
    },

    // CREATE: Add a New Purchase Order
    createPurchaseOrderSuccess(state, action) {
      state.isLoading = false;
      state.allOrders.push(action.payload);
    },

    // UPDATE: Update an Existing Purchase Order
    updatePurchaseOrderSuccess(state, action) {
      state.isLoading = false;
      const updatedOrder = action.payload;
      const index = state.allOrders.findIndex((order) => order.id === updatedOrder.id);
      if (index !== -1) {
        state.allOrders[index] = updatedOrder;
      }
    },

    // DELETE: Delete a Purchase Order
    deletePurchaseOrderSuccess(state, action) {
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
  getPurchaseOrdersSuccess,
  getPurchaseOrderSuccess,
  createPurchaseOrderSuccess,
  updatePurchaseOrderSuccess,
  deletePurchaseOrderSuccess,
} = slice.actions;

export function getPurchaseOrders() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const allOrders = await axios.get('/api/order/getPurchaseAll');
      dispatch(slice.actions.getPurchaseOrdersSuccess(allOrders.data.purchaseOrders));
    } catch (error) {
      console.error("Error fetching purchase orders: ", error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getPurchaseOrder(name) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/order/getSale', {
        params: { name },
      });
      dispatch(slice.actions.getPurchaseOrderSuccess(response.data));
    } catch (error) {
      console.error("Error fetching purchase order: ", error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function createPurchaseOrder(newOrder) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/order/addPurchase', newOrder);
      dispatch(slice.actions.createPurchaseOrderSuccess(response.data.data));
      return {success: true, data: response.data.data}
    } catch (error) {
      console.error("Error creating purchase order: ", error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updatePurchaseOrder(id, updatedOrder) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/api/order/editPurchase/${id}`, updatedOrder);
      dispatch(slice.actions.updatePurchaseOrderSuccess(response.data));
    } catch (error) {
      console.error("Error updating purchase order: ", error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deletePurchaseOrder(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.delete(`/api/order/deletePurchase/${id}`);
      dispatch(slice.actions.deletePurchaseOrderSuccess(id));
    } catch (error) {
      console.error("Error deleting purchase order: ", error);
      dispatch(slice.actions.hasError(error));
    }
  };
}