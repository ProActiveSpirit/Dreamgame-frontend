import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, TextField, Tooltip , Paper, Container} from '@mui/material';
import { Masonry } from '@mui/lab';

import Label from 'src/components/label';

export default function ProductInformation({ variant }) {
  const [currency, setCurrency] = useState('EUR');

  const [values, setValues] = useState({
    amount: '',
    password: '',
    weight: '',
    weightRange: '',
    showPassword: false,
  });

  const style = {
    '& > *': { my: '8px !important' },
  };

  const COLORS = ['primary', 'warning','info', 'secondary'];
  const Stock = ['1','0','0','1' ];

  return (
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
              <Tooltip key={color} title={color}>
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
    </Masonry>
  );
}
