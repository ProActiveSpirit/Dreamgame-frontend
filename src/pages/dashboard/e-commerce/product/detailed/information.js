import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { MenuItem, TextField, IconButton, InputAdornment } from '@mui/material';
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

  return (
    <Masonry columns={{ xs: 1}} spacing={3}>
        <TextField
          variant={variant}
          required
          fullWidth
          label="Name"
          size="small"
          defaultValue="Game Name"
        />

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
