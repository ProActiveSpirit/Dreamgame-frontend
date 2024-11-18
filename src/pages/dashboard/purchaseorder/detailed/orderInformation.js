import React from 'react';
import PropTypes from 'prop-types';
// @mui
import { TextField, Stack, Container } from '@mui/material';
import { Masonry } from '@mui/lab';
import { DateTimePicker } from '@mui/x-date-pickers';
import Label from '../../../../components/label';

export default function OrderInformation( {variant = 'outlined' }) {
  return (
    <>
      <Container maxWidth="md">
        <Masonry columns={{ xs: 1 }} spacing={4}>
          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
            <Label color="warning" variant="filled" style={{ height: 36 }}>
              Pending
            </Label>
            <TextField
              variant={variant}
              required
              size="small"
              label="Provider"
              defaultValue=""
            />
          </Stack>
          <TextField
            variant={variant}
            required
            label="Customer"
            defaultValue="Dreamgame"
          />

          <DateTimePicker
            renderInput={(props) => <TextField {...props} fullWidth />}
            label="Start Date"
          />

          <DateTimePicker
            renderInput={(props) => <TextField {...props} fullWidth />}
            label="Created On"
          />
        </Masonry>
      </Container>
    </>
  );
}

OrderInformation.propTypes = {
  variant: PropTypes.string.isRequired,
};