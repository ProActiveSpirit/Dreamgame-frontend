import { useState } from 'react';
// @mui
import { TextField, Stack , Container} from '@mui/material';
import { Masonry } from '@mui/lab';

import { DateTimePicker} from '@mui/x-date-pickers';
import Label from '../../../components/label';


// import ExtendPrice from './extprice'

export default function OrderInformation({ variant }) {
  const [values, setValues] = useState({
    amount: '',
    password: '',
    weight: '',
    weightRange: '',
    showPassword: false,
  });

  const COLORS = ['primary', 'warning','info', 'secondary'];
  const Stock = ['1','0','0','1' ];
  const Status = ['generated keys' ,'pending keys to generate,','sold keys','sold keys pending generations'];

  return (
    <>
      <Container maxWidth='md' >
        <Masonry columns={{ xs: 1}} spacing={4}>
          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
            <Label color={'warning'} variant="filled" style={{height:36}}>
              {"Pending"}
            </Label>
            <TextField
              variant={variant}
              required
              // fullWidth
              size="small"
              label="Provider"
              defaultValue=""
            />
          </Stack>
          <TextField
            variant={variant}
            required
            // fullWidth
            label="Customer"
            defaultValue="Dreamgame"
          />

          <DateTimePicker
            renderInput={(props) => <TextField {...props} fullWidth />}
            label="Start Date"
            // value={value}
            // onChange={setValue}
          />

          <DateTimePicker
            renderInput={(props) => <TextField {...props} fullWidth />}
            label="Created On"
            // value={value}
            // onChange={setValue}
          />


        </Masonry>

      </Container>
      {/* <InvoiceNewEditDetails /> */}

      {/* <ExtendPrice /> */}
    </>
  );
}
