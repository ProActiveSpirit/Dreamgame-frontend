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
          size='small'
          label="Customer"
          defaultValue="Dreamgame"
        />
        
        <TextField
          variant="outlined"
          required
          fullWidth
          size='small'
          type="email"
          label="Email"
          defaultValue="adam@dreamgame.com"
        />

        <TextField
          variant="outlined"
          required
          fullWidth
          size='small'
          label="Address"
          defaultValue=""
        />

        <TextField
          variant="outlined"
          required
          fullWidth
          size='small'
          label="ZipCode"
          defaultValue=""
        />

        <TextField
          variant="outlined"
          required
          fullWidth
          size='small'
          label="City"
          defaultValue=""
        />

        <TextField
          variant="outlined"
          required
          fullWidth
          size='small'
          label="State"
          defaultValue=""
        />

        <TextField
          variant="outlined"
          required
          fullWidth
          size='small'
          label="Country Code"
          defaultValue="NL"
        />

        <TextField
          variant="outlined"
          required
          fullWidth
          size='small'
          label="Region"
          defaultValue="EU"
        />

        <TextField
          variant="outlined"
          required
          fullWidth
          size='small'
          label="Default Currency"
          defaultValue="EUR"
        />
      </Masonry>
    </Container>
    // <ExtendPrice /> Uncomment and ensure this component is defined and imported correctly
  );
}