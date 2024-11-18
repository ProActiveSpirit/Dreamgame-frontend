import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// @mui
import { TextField, Stack, Container, Button ,Autocomplete} from '@mui/material';
import { Masonry } from '@mui/lab';
import { DateTimePicker } from '@mui/x-date-pickers';
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';

export default function StockDetailed({ variant = 'outlined' }) {
  const [startDate, setStartDate] = useState(new Date());
  const [createdOn, setCreatedOn] = useState(new Date());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <Container maxWidth="md">
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
          >
            Save
          </Button>
          <Autocomplete
            style={{width:"180px"}}
            options={deleteOrders}
            getOptionLabel={(option) => option.title}
            renderInput={(params) => <TextField {...params} label="Delete Orders" margin="none" />}
          />
          <Autocomplete
            style={{width:"200px"}}
            options={bulkActions}
            getOptionLabel={(option) => option.title}
            renderInput={(params) => <TextField {...params} label="Bulk Actions" margin="none" />}
          />
          <Button
            variant="contained"
            color="error"
            startIcon={<Iconify icon="eos-icons:arrow-rotate" />}
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
          >
            Return Keys
          </Button>
        </Stack>
      </Masonry>
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