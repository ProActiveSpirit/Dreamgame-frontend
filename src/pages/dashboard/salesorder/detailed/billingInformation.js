import { useState } from 'react';
// @mui
import { TextField, Container } from '@mui/material';
import { Masonry } from '@mui/lab';

// import ExtendPrice from './extprice'

export default function BillingInformation() {
  return (
    <Container maxWidth='md'>
      <Masonry columns={{ xs: 1 }} spacing={2}>
        <TextField
          variant="outlined"
          required
          fullWidth
          label="Customer"
          defaultValue="Dreamgame"
        />
        
        <TextField
          variant="outlined"
          required
          fullWidth
          type="email"
          label="Email"
          defaultValue="adam@dreamgame.com"
        />

        <TextField
          variant="outlined"
          required
          fullWidth
          label="Address"
          defaultValue=""
        />

        <TextField
          variant="outlined"
          required
          fullWidth
          label="ZipCode"
          defaultValue=""
        />

        <TextField
          variant="outlined"
          required
          fullWidth
          label="City"
          defaultValue=""
        />

        <TextField
          variant="outlined"
          required
          fullWidth
          label="State"
          defaultValue=""
        />

        <TextField
          variant="outlined"
          required
          fullWidth
          label="Country Code"
          defaultValue="NL"
        />

        <TextField
          variant="outlined"
          required
          fullWidth
          label="Region"
          defaultValue="EU"
        />

        <TextField
          variant="outlined"
          required
          fullWidth
          label="Default Currency"
          defaultValue="EUR"
        />
      </Masonry>
    </Container>
    // <ExtendPrice /> Uncomment and ensure this component is defined and imported correctly
  );
}