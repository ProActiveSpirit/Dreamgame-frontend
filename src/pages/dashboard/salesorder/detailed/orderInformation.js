import { useState } from 'react';
// @mui
import { Box, Radio, TextField, Tooltip , RadioGroup, FormControlLabel, Container} from '@mui/material';
import { Masonry } from '@mui/lab';

import Label from 'src/components/label';
import { DateTimePicker} from '@mui/x-date-pickers';

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
      <Container maxWidth={'md'} >
        <Masonry columns={{ xs: 1}} spacing={4}>
          <Label color={'warning'} variant="filled">
            {"Pending"}
          </Label>
          <TextField
            variant={variant}
            required
            fullWidth
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

          <TextField
            variant={variant}
            required
            fullWidth
            label="Provider"
            defaultValue=""
          />
        </Masonry>

      </Container>
      {/* <ExtendPrice /> */}
    </>
  );
}
