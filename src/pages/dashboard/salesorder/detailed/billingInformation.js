import { useState } from 'react';
// @mui
import { TextField, Container} from '@mui/material';
import { Masonry } from '@mui/lab';

// import ExtendPrice from './extprice'

export default function BillingInformation(variant) {
  // const [values, setValues] = useState({
  //   amount: '',
  //   password: '',
  //   weight: '',
  //   weightRange: '',
  //   showPassword: false,
  // });

  return (
    <>
      <Container maxWidth='md' >
        <Masonry columns={{ xs: 1}} spacing={2}>
          <TextField
            variant={variant}
            required
            fullWidth
            label="Customer"
            defaultValue="Dreamgame"
          />
          
          <TextField
            variant={variant}
            required
            fullWidth
            type="email"
            label="Email"
            defaultValue="adam@dreamgame.com"
          />

          <TextField
            variant={variant}
            required
            fullWidth
            label="Address"
            defaultValue=""
          />

          <TextField
            variant={variant}
            required
            fullWidth
            label="ZipCode"
            defaultValue=""
          />

          <TextField
            variant={variant}
            required
            fullWidth
            label="City"
            defaultValue=""
          />

          <TextField
            variant={variant}
            required
            fullWidth
            label="State"
            defaultValue=""
          />

          <TextField
            variant={variant}
            required
            fullWidth
            label="Country Code"
            defaultValue="NL"
          />

          <TextField
            variant={variant}
            required
            fullWidth
            label="Region"
            defaultValue="EU"
          />

          <TextField
            variant={variant}
            required
            fullWidth
            label="Default Currency"
            defaultValue="EUR"
          />
        </Masonry>

      </Container>
      {/* <ExtendPrice /> */}
    </>
  );
}
