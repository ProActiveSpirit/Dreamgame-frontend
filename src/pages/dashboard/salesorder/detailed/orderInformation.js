import { useEffect, useState } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
// next
import { useRouter } from 'next/router';

// @mui
import { TextField, Stack, Container } from '@mui/material';
import { Masonry } from '@mui/lab';
import { DateTimePicker } from '@mui/x-date-pickers';
import Label from '../../../../components/label';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { getSalesOrders } from '../../../../redux/slices/salesorder';

export default function OrderInformation( {variant = 'outlined' }) {
  const dispatch = useDispatch();

  const {
    query: { name },
  } = useRouter();

  const currentOrder = useSelector((state) => {
    return state.salesorder.allOrders.find((order) => order.id === name);
  });

  useEffect(() => {
    dispatch(getSalesOrders());
  }, [dispatch]);


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
          <TextField
            variant={variant}
            required
            label="Customer"
            defaultValue={currentOrder?.customer?.name}
          />

          <DateTimePicker
            renderInput={(props) => <TextField {...props} fullWidth />}
            label="Start Date"
            value={currentOrder?.startDate}
          />

          <DateTimePicker
            renderInput={(props) => <TextField {...props} fullWidth />}
            label="End Date"
            value={currentOrder?.endDate}
          />
        </Masonry>
      </Container>
    </>
  );
}

OrderInformation.propTypes = {
  variant: PropTypes.string.isRequired,
};