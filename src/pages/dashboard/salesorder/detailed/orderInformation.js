import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// next
import { useRouter } from 'next/router';
import { DataGrid } from '@mui/x-data-grid';
import { useForm } from 'react-hook-form';

// @mui
import { 
  TextField, 
  Stack, 
  Container, 
  Typography, 
  Divider, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete 
} from '@mui/material';
import { Masonry } from '@mui/lab';
import { DateTimePicker } from '@mui/x-date-pickers';
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';

// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { getSalesOrders, updateSalesOrder } from '../../../../redux/slices/salesorder';
import { getCustomers } from '../../../../redux/slices/user';

export default function OrderInformation({ variant = 'outlined' }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState(null);
  const [openCustomerDialog, setOpenCustomerDialog] = useState(false);

  // Add form control
  const {
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      Customer: '',
    },
  });

  // Get customers from redux store
  const customers = useSelector((state) => state.user.customers);

  // Columns definition
  const columns = [
    { field: 'Product', headerName: 'Product', flex: 0.3 },
    { field: 'Sku', headerName: 'Sku', flex: 0.1 },
    { field: 'Quantity', headerName: 'Quantity', flex: 0.1 },
    { field: 'SalesExcVat', headerName: 'Sales Exc Vat', flex: 0.15 },
    { field: 'SalesVat', headerName: 'Sales Vat', flex: 0.15 },
    { field: 'SalesIncVat', headerName: 'Sales Inc Vat', flex: 0.2 },
  ];

  const {
    query: { name },
  } = useRouter();

  const currentOrder = useSelector((state) =>
    state.salesorder.allOrders.find((order) => order.id === name)
  );

  const [rows, setRows] = useState([]);

  // Fetch customers and sales orders
  useEffect(() => {
    dispatch(getCustomers());
    dispatch(getSalesOrders());
  }, [dispatch]);
  
  useEffect(() => {
    if (currentOrder && currentOrder.length) {
      const initialRows = currentOrder.map((order, index) => ({
        id: index,
        Product: order.product.name,
        Sku: order.product.sku,
        Quantity: order.totalQuantity,
        SalesExcVat: order.salesExtVat, 
        SalesVat: order.salesVat,
        SalesIncVat: order.salesIncVat,
      }));
      setRows(initialRows);
      setEditedOrder(currentOrder);
      // Set initial customer value
      if (currentOrder.customerId) {
        setValue('Customer', currentOrder.customerId);
      }
    }
  }, [currentOrder, setValue]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      console.log("editedOrder", editedOrder);
      // await dispatch(updateSalesOrder(editedOrder));
      setIsEditing(false);
      // Show success message
    } catch (error) {
      // Show error message
      console.error('Failed to update order:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditedOrder(currentOrder);
    setIsEditing(false);
  };

  const handleCustomerChange = (event, newValue) => {
    setValue('Customer', newValue?.id || '');
    setEditedOrder({
      ...editedOrder,
      customerId: newValue?.id || '',
      customerName: newValue?.name || '',
    });
  };

  const handleCloseCustomerDialog = () => {
    setOpenCustomerDialog(false);
  };

  return (
    <>
      <Container maxWidth="xl">
        <Stack 
          direction="row" 
          justifyContent="space-between" 
          alignItems="center" 
          sx={{ mb: 3 }}
        >
          <Stack direction="row" spacing={2}>
            {isEditing ? (
              <>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<Iconify icon="eva:save-fill" />}
                  onClick={handleSaveClick}
                >
                  Save Changes
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Iconify icon="eva:close-fill" />}
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:edit-fill" />}
                onClick={handleEditClick}
              >
                Edit Sales Order
              </Button>
            )}
          </Stack>
        </Stack>

        <Masonry columns={{ xs: 1 }} spacing={4}>
          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="subtitle2">Order Status:</Typography>
              <Label color="warning" variant="filled" style={{ height: 36 }}>
                {currentOrder?.status}
              </Label>
            </Stack>
            <TextField
              variant={variant}
              required
              size="small"
              label="Provider"
              value={currentOrder?.product?.provider || ''}
              onChange={(e) => 
                setEditedOrder({
                  ...currentOrder,
                  product: { ...currentOrder.product, provider: e.target.value }
                })
              }
              disabled={!isEditing}
            />
          </Stack>
          <Autocomplete
            fullWidth
            disabled={!isEditing}
            options={customers || []}
            getOptionLabel={(option) => (option?.name ? option.name : '')}
            value={
              customers?.find((customer) => customer.id === watch('Customer')) || null
            }
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            onChange={handleCustomerChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Customer"
                error={!!errors?.Customer}
                helperText={errors?.Customer?.message}
              />
            )}
          />
          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
            <DateTimePicker
              disabled={!isEditing}
              label="Order Date"
              value={editedOrder?.startDate}
              onChange={(newValue) => {
                setEditedOrder({
                  ...editedOrder,
                  orderDate: newValue
                });
              }}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  fullWidth 
                  size="small"
                  disabled={!isEditing}
                />
              )}
            />

            <DateTimePicker
              disabled={!isEditing}
              label="Created on"
              value={editedOrder?.createdOn}
              onChange={(newValue) => {
                setEditedOrder({
                  ...editedOrder,
                  createdOn: newValue
                });
              }}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  fullWidth 
                  size="small"
                  disabled={!isEditing}
                />
              )}
            />
          </Stack>
        </Masonry>
        <Typography variant="h6" gutterBottom>
        Product Information
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <div style={{ height: 200, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          disableSelectionOnClick
          autoHeight
          hideFooter
        />
      </div>

      <Stack spacing={10} sx={{ mt: 3 }} direction={{ xs: 'column', md: 'row' }}>
        <Stack direction="row" justifyContent="flex-end">
          <Typography>Total Exc Vat:</Typography>
          <Typography sx={{ textAlign: 'right', width: 120 }}>
            {editedOrder?.expectedCost}
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="flex-end">
          <Typography>Vat (0%)</Typography>
          <Typography sx={{ textAlign: 'right', width: 120 }}>
            {editedOrder?.salesVat}
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="flex-end">
          <Typography variant="h6">Total Inc Vat :</Typography>
          <Typography variant="h6" sx={{ textAlign: 'right', width: 120 }}>
            {editedOrder?.totalPrice}
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="flex-end">
          <Typography>Total Cost :</Typography>
          <Typography sx={{ textAlign: 'right', width: 120 }}>
            Not set yet
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="flex-end">
          <Typography>Profit :</Typography>
          <Typography sx={{ textAlign: 'right', width: 120 }}>
            Not set yet
          </Typography>
        </Stack>
      </Stack>

      </Container>

      {/* Change Customer Dialog */}
      <Dialog 
        open={openCustomerDialog} 
        onClose={handleCloseCustomerDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Change Customer</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Autocomplete
              fullWidth
              options={customers || []}
              getOptionLabel={(option) => (option?.name ? option.name : '')}
              value={
                customers?.find((customer) => customer.id === watch('Customer')) || null
              }
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              onChange={handleCustomerChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Customer"
                  error={!!errors?.Customer}
                  helperText={errors?.Customer?.message}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCustomerDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              handleSaveClick();
              handleCloseCustomerDialog();
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

OrderInformation.propTypes = {
  variant: PropTypes.string.isRequired,
};