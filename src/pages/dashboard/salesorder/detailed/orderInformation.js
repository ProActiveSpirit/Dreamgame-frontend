import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// next
import { useRouter } from 'next/router';
import { DataGrid } from '@mui/x-data-grid';

// @mui
import { TextField, Stack, Container, Typography, Divider, Button } from '@mui/material';
import { Masonry } from '@mui/lab';
import { DateTimePicker } from '@mui/x-date-pickers';
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';

// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { getSalesOrders } from '../../../../redux/slices/salesorder';
import { getProducts } from '../../../../redux/slices/product';

export default function OrderInformation( {variant = 'outlined' }) {
  const dispatch = useDispatch();

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
  const { salesOrders } = useSelector((state) => state.salesorder);

  useEffect(() => {
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
    }
  }, [currentOrder]);

  const [totals, setTotals] = useState({ totalQuantity: 0, totalCostIncVat: 0 }); // State for totals

  const calculateTotals = (updatedRows) => {
    const totalQuantity = updatedRows.reduce((sum, row) => sum + row.Quantity, 0);  
    const totalCostIncVat = updatedRows.reduce((sum, row) => sum + row.TotalCostIncVat, 0);
    setTotals({ totalQuantity, totalCostIncVat });
  };

  const handleQuantityChange = (id, value) => {
    const updatedRows = rows.map((row) => 
      row.id === id ? { ...row, Quantity: parseInt(value) } : row
    );
    setRows(updatedRows);
    calculateTotals(updatedRows);
  };  



  return (
    <>
      <Container maxWidth="md">
        <Masonry columns={{ xs: 1 }} spacing={4}>
          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
            <Label color="warning" variant="filled" style={{ height: 36 }}>
              {currentOrder?.status}
            </Label>
            <TextField
              variant={variant}
              required
              size="small"
              label="Provider"
              defaultValue={currentOrder?.product?.provider}
            />
          </Stack>
          {/* <TextField
            variant={variant}
            required
            size="small"
            label="Customer"
            defaultValue={currentOrder?.customer?.name}
          /> */}
          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
            <DateTimePicker
              renderInput={(props) => <TextField {...props} fullWidth size="small" />}
              label="Start Date"
              value={currentOrder?.startDate}
            />

            <DateTimePicker
              renderInput={(props) => <TextField {...props} fullWidth size="small" />}
              label="End Date"
              value={currentOrder?.endDate}
            />
          </Stack>

          
        </Masonry>
      </Container>
      <Typography variant="h6" gutterBottom>
        Purchase Order Template
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
            {currentOrder?.expectedCost}
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="flex-end">
          <Typography>Vat (0%)</Typography>
          <Typography sx={{ textAlign: 'right', width: 120 }}>
            {currentOrder?.salesVat}
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="flex-end">
          <Typography variant="h6" >Total Inc Vat :</Typography>
          <Typography variant="h6" sx={{ textAlign: 'right', width: 120 }}>
            {currentOrder?.totalPrice}
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="flex-end">
          <Typography >Total Cost :</Typography>
          <Typography sx={{ textAlign: 'right', width: 120 }}>
            {"Not set yet"}
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="flex-end">
          <Typography >Profit :</Typography>
          <Typography sx={{ textAlign: 'right', width: 120 }}>
            {"Not set yet"}
          </Typography>
        </Stack>
      </Stack>
    </>
  );
}

OrderInformation.propTypes = {
  variant: PropTypes.string.isRequired,
};