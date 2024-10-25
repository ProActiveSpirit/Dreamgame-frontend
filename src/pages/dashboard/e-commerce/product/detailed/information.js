import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, TextField, Label, Tooltip , Paper, Container} from '@mui/material';
import { Masonry } from '@mui/lab';

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

  const COLORS = ['primary', 'secondary', 'info', 'success', 'warning', 'error'];


  return (
    <Masonry columns={{ xs: 1}} spacing={4}>
        <TextField
          variant={variant}
          required
          fullWidth
          label="Name"
          size="small"
          defaultValue="Game Name"
        />

        <Box
            sx={{
                minHeight: 20,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'left',
                justifyContent: 'left',
                '& > *': { mx: 1 },
            }}
        >
            {COLORS.map((color) => (
                // <Tooltip key={color} title={color}>
                //     <Label color={color} variant="filled">
                     <div>   {color} </div>
                //     </Label>
                // </Tooltip>
            ))}
        </Box>       

        <TextField
          variant={variant}
          required
          fullWidth
          label="Provider"
          size="small"
          defaultValue="Hello Minimal"
        />

        <TextField
          variant={variant}
          required
          fullWidth
          label="Sku"
          size="small"
          defaultValue="Hello Minimal"
        />

        <TextField
          variant={variant}
          required
          fullWidth
          label="Publisher"
          size="small"
          defaultValue="Hello Minimal"
        />
    </Masonry>
  );
}