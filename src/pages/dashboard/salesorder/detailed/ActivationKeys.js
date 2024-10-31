import { useState } from 'react';
// @mui
import { Box, Radio, Tooltip , RadioGroup,Checkbox, FormControlLabel, Container, Stack, TextField} from '@mui/material';
import { Masonry } from '@mui/lab';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import ExtendPrice from './extprice'

export default function ProductInformation({ variant }) {
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
          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
            <TextField
              variant={variant}
              required
              // fullWidth
              label="Quantity"
              // size="small"
              defaultValue="100"
            />
            <Box
              sx={{
                p: 1,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'left',
                justifyContent: 'left',
                '& > *': { mx: 0.5 },
              }}
            >
                {COLORS.map((color, index) => (
                  <Tooltip key={color} title={Status[index]}>
                    <Label color={color} variant="filled">
                      {Stock[index]}
                    </Label>
                  </Tooltip>
                ))}
            </Box>
          </Stack>

          <FormControlLabel
            key={'start'}
            value={'start'}
            label={'Include Pending Stocks'}
            // labelPlacement={''}
            control={<Checkbox />}
            sx={{ textTransform: 'capitalize' }}
          />

          <FormControlLabel
            key={'start'}
            value={'start'}
            label={'Include Processing Stocks'}
            // labelPlacement={'start'}
            control={<Checkbox />}
            sx={{ textTransform: 'capitalize' }}
          />

          <Stack spacing={5} direction={{ xs: 'column', sm: 'row' }}>
            <Label variant="filled" color="primary" startIcon={<Iconify icon="eva:email-fill" />}>
              Assign Keys
            </Label>
            <p>{"   Total assigned: 100"}</p>
            <Label variant="filled" color="primary" startIcon={<Iconify icon="eva:email-fill" />}>
              Resovle Keys
            </Label>
            <Label>{"0"}</Label>
          </Stack>

          <Box
            sx={{
              p: 1,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'left',
              justifyContent: 'left',
            }}
          >
            <RadioGroup row defaultValue="g">
              <FormControlLabel value="g" control={<Radio />} label="All (100)" />
              <FormControlLabel value="p" control={<Radio size="small" />} label="Packed (0)" />
              <FormControlLabel value="p" control={<Radio size="small" />} label="Unpacked (100)" />
            </RadioGroup>
          </Box>

          <Box
            sx={{
              p: 1,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'left',
              justifyContent: 'left',
            }}
          >
            <RadioGroup row defaultValue="g">
              <FormControlLabel value="g" control={<Radio />} label="All (100)" />
              <FormControlLabel value="p" control={<Radio size="small" />} label="Completed (0)" />
              <FormControlLabel value="p" control={<Radio size="small" />} label="Pending (100)" />
            </RadioGroup>
          </Box>

        </Masonry>

      </Container>
      <ExtendPrice />
    </>
  );
}
