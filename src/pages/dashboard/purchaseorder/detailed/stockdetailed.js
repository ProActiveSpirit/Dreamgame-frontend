import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// @mui
import { TextField, Stack, Container, Button ,Autocomplete} from '@mui/material';
import { Masonry } from '@mui/lab';
import { DateTimePicker } from '@mui/x-date-pickers';
import Iconify from '../../../../components/iconify';
import ConfirmDialog from '../../../../components/confirm-dialog';

// redux
import { getPurchaseOrders, deletePurchaseOrder } from '../../../../redux/slices/purchaseorder';
import { useDispatch, useSelector } from '../../../../redux/store';

export default function StockDetailed({ variant = 'outlined' }) {
  const [startDate, setStartDate] = useState(new Date());
  const [createdOn, setCreatedOn] = useState(new Date());
  const [isClient, setIsClient] = useState(false);
  const [action , setAction] = useState();
  const [openConfirm, setOpenConfirm] = useState(false);

  const dispatch = useDispatch();

  const { allOrders, isLoading } = useSelector((state) => state.purchaseorder);

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
    setOpenConfirm(true)
    setAction("save");
  }

  const onGenerate = () => {
    setOpenConfirm(true)
    setAction("generate");
  }

  const handleCloseConfirm = () => {
    setOpenConfirm(false)
  }

  const onReturn = () => {
    setOpenConfirm(true)
    setAction("return");
  }

  const onAction = () => {
    setOpenConfirm(false)
  }

  return (
    <Container maxWidth="lg">
      <Masonry columns={{ xs: 1 }} spacing={4}>
        <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
          <TextField
            variant={variant}
            required
            size="small"
            label="Provider"
            defaultValue="6"
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
            label="Created On"
            value={createdOn}
            onChange={(newValue) => setCreatedOn(newValue)}
          />
        </Stack>
        <Stack spacing={1} direction={{ xs: 'column', sm: 'row' }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<Iconify icon="eva:save-fill" />}
            onClick={() => onSave()}
          >
            Save
          </Button>
          <Autocomplete
            style={{width:"320px"}}
            options={deleteOrders}
            getOptionLabel={(option) => option.title}
            renderInput={(params) => <TextField {...params} label="Delete Orders" margin="none" />}
          />
          <Autocomplete
            style={{width:"350px"}}
            options={bulkActions}
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
          <p>Total generated: 0</p>
        </Stack>
        <Stack spacing={1} direction={{ xs: 'column', sm: 'row' }}>
          <TextField
            variant={variant}
            required
            size="small"
            // label="Provider"
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
  );
}

StockDetailed.propTypes = {
  variant: PropTypes.string.isRequired,
};

export const deleteOrders = [
  { title: 'Delete Pending Orders', year: 1994 },
  { title: 'Delete Orders', year: 1972 },
]

export const bulkActions = [
  { title: 'Bulk Get Empty Orders(makes many request)', year: 1994 },
  { title: 'Bulk Return All the "Processing" Orders (makes many request)', year: 1972 },
  { title: 'Re-Schedule Errors', year: 1972 },
  { title: 'Re-attach orders to the current SO', year: 1972 },
  { title: 'Set Defaults', year: 1972 },
]