import React from 'react';
import { Typography, Divider, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

export default function SummaryInformation({ columns, rows, totals }) {
  return (
    <>
      <Typography variant="h7" gutterBottom>
        Purchase Order Summary Information
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <DataGrid columns={columns} rows={rows} disableSelectionOnClick autoHeight hideFooter />
      <Stack spacing={10} sx={{ mt: 3 }} direction={{ xs: 'column', md: 'row' }}>
        <Stack direction="row" justifyContent="flex-end">
          <Typography>Average Cost :</Typography>
        </Stack>
        <Stack direction="row" justifyContent="flex-end">
          <Typography>Quantity :</Typography>
        </Stack>
        <Stack direction="row" justifyContent="flex-end">
          <Typography variant="h6">Total Cost Inc Vat :</Typography>
          <Typography variant="h6" sx={{ textAlign: 'right', width: 120 }}>
            {totals.totalCostIncVat.toFixed(2)}
          </Typography>
        </Stack>
      </Stack>
    </>
  );
}