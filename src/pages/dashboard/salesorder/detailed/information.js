import { useState } from 'react';
// @mui
import { Box, Radio, TextField, Tooltip , RadioGroup, FormControlLabel, Container} from '@mui/material';
import { Masonry } from '@mui/lab';

import Label from 'src/components/label';
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
          <TextField
            variant={variant}
            required
            fullWidth
            label="Name"
            size="small"
            defaultValue="13000 CALL OF DUTY POINTS (MV IIII, MIW II, Warzone) - [XBOX Series X|S /XBOX One]"
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
          <TextField
            variant={variant}
            required
            fullWidth
            label="Provider"
            size="small"
            defaultValue=""
          />

          <TextField
            variant={variant}
            required
            fullWidth
            label="Sku"
            size="small"
            defaultValue="8806188752425"
          />

          <TextField
            variant={variant}
            required
            fullWidth
            label="Publisher"
            size="small"
            defaultValue="Activision"
          />

          <TextField
            variant={variant}
            required
            fullWidth
            label="Provider Status"
            size="small"
            defaultValue=""
          />

          <Box
            sx={{
              p: 1,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'left',
              justifyContent: 'left',
              '& > *': { mx: 2 },
            }}
          >
            <RadioGroup row defaultValue="g">
              <FormControlLabel value="g" control={<Radio />} label="Yes" />
              <FormControlLabel value="p" control={<Radio size="small" />} label="No" />
            </RadioGroup>
          </Box>

        </Masonry>

      </Container>
      <ExtendPrice />
    </>
  );
}
