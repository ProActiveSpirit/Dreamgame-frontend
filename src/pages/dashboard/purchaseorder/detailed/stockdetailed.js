import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// next
import { useRouter } from 'next/router';
// @mui
import { TextField, Stack, Container, Button, Autocomplete } from '@mui/material';
import { Masonry } from '@mui/lab';
import { DateTimePicker } from '@mui/x-date-pickers';
import Iconify from '../../../../components/iconify';
import ConfirmDialog from '../../../../components/confirm-dialog';
import StockOrderTable, { generateRandomData } from '../../../../sections/@dashboard/purchaseorder/detailed/stockOrder/stockOrder';
// redux
import { getPurchaseOrders, deletePurchaseOrder } from '../../../../redux/slices/purchaseorder';
import { useDispatch, useSelector } from '../../../../redux/store';

export default function StockDetailed({ variant = 'outlined' }) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isClient, setIsClient] = useState(false);
  const [action, setAction] = useState('');
  const [openConfirm, setOpenConfirm] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [deleteOption, setDeleteOption] = useState(null);
  const [bulkOption, setBulkOption] = useState(null);

  const dispatch = useDispatch();

  const { allOrders, isLoading } = useSelector((state) => state.purchaseorder);

  const {
    query: { name },
  } = useRouter();

  const currentOrder = useSelector((state) =>
    state.purchaseorder.allOrders.find((order) => order.id === name)
  );

  useEffect(() => {
    dispatch(getPurchaseOrders());
  }, [dispatch]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a loading spinner
  }

  const onSave = () => {
    setOpenConfirm(true);
    setAction("save");
  };

  const onGenerate = () => {
    setOpenConfirm(true);
    setAction("generate");
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const onReturn = () => {
    setOpenConfirm(true);
    setAction("return");
  };

  const onAction = () => {
    setOpenConfirm(false);
    
    if (action === 'generate') {
      // Generate random data - between 30-50 entries
      const dataCount = Math.floor(Math.random() * 21) + 30;
      const newData = generateRandomData(dataCount);
      setTableData(newData);
    }
  };

  const handleDeleteOptionChange = (event, newValue) => {
    setDeleteOption(newValue);
    
    if (newValue) {
      if (newValue.title === 'Delete Orders') {
        // Delete all orders
        setTableData([]);
      } else if (newValue.title === 'Delete Pending Orders') {
        // Delete only pending orders
        setTableData(tableData.filter(item => item.STATUS !== 'pending'));
      }
      // Reset the selection after action is performed
      setTimeout(() => setDeleteOption(null), 100);
    }
  };

  const handleBulkActionChange = (event, newValue) => {
    setBulkOption(newValue);
    // Add bulk action handling here if needed
    setTimeout(() => setBulkOption(null), 100);
  };

  return (
    <div>
      <Container maxWidth="lg">
        <Masonry columns={{ xs: 1 }} spacing={4}>
          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
            <TextField
              variant={variant}
              required
              size="small"
              label="Provider"
              defaultValue={currentOrder?.product?.provider}
            />
          </Stack>
          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
            <DateTimePicker
              renderInput={(props) => <TextField {...props} fullWidth />}
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
            />

            <DateTimePicker
              renderInput={(props) => <TextField {...props} fullWidth />}
              label="End Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
            />
          </Stack>
          <Stack spacing={1} direction={{ xs: 'column', sm: 'row' }}>
            <Button
              variant="contained"
              color="success"
              size="middle"
              startIcon={<Iconify icon="eva:save-fill" />}
              onClick={() => onSave()}
            >
              Save
            </Button>
            <Autocomplete
              style={{ width: "300px" }}
              options={deleteOrders}
              value={deleteOption}
              onChange={handleDeleteOptionChange}
              getOptionLabel={(option) => option.title}
              renderInput={(params) => <TextField {...params} label="Delete Orders" margin="none" />}
            />
            <Autocomplete
              style={{ width: "300px" }}
              options={bulkActions}
              value={bulkOption}
              onChange={handleBulkActionChange}
              getOptionLabel={(option) => option.title}
              renderInput={(params) => <TextField {...params} label="Bulk Actions" margin="none" />}
            />
            <Button
              variant="contained"
              color="error"
              startIcon={<Iconify icon="eos-icons:arrow-rotate" />}
              onClick={() => onGenerate()}
            >
              Generate Orders
            </Button>
            <p style={{ marginTop: "15px" }}>Total generated: {tableData.length}</p>
          </Stack>
          <Stack spacing={1} direction={{ xs: 'column', sm: 'row' }}>
            <TextField
              variant={variant}
              required
              size="small"
              defaultValue="0"
            />
            <Button
              variant="contained"
              color="error"
              startIcon={<Iconify icon="gg:corner-double-up-left" />}
              onClick={() => onReturn()}
            >
              Return Keys
            </Button>
          </Stack>
        </Masonry>
        <ConfirmDialog
          open={openConfirm}
          onClose={handleCloseConfirm}
          title={action}
          content={`Are you sure you want to ${action}?`}
          action={
            <Button variant="contained" color="error" onClick={() => onAction()}>
              {action}
            </Button>
          }
        />
      </Container>
      <StockOrderTable 
        tableData={tableData}
        onDataChange={(newData) => setTableData(newData)}
      />
    </div>
  );
}

StockDetailed.propTypes = {
  variant: PropTypes.string.isRequired,
};

export const deleteOrders = [
  { title: 'Delete Pending Orders', year: 1994 },
  { title: 'Delete Orders', year: 1972 },
];

export const bulkActions = [
  { title: 'Bulk Get Empty Orders(makes many request)', year: 1994 },
  { title: 'Bulk Return All the "Processing" Orders (makes many request)', year: 1972 },
  { title: 'Re-Schedule Errors', year: 1972 },
  { title: 'Re-attach orders to the current SO', year: 1972 },
  { title: 'Set Defaults', year: 1972 },
];