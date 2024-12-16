import React from 'react';
import { Stack, Typography, Divider, Autocomplete, TextField, InputAdornment } from '@mui/material';
import { RHFTextField } from '../../../../../../components/hook-form';

export default function StockSalesInformation({ watch, setValue, errors }) {
  return (
    <Stack spacing={2}>
      <Typography variant="h7" gutterBottom>
        Stock Order API Sales Information
      </Typography>
      <Divider />
      <Autocomplete
        fullWidth
        disableClearable
        value={watch('costCurrency')}
        options={['EUR', 'Dollar']}
        onChange={(event, newValue) => setValue('costCurrency', newValue)}
        size="small"
        renderInput={(params) => (
          <TextField {...params} label="Stock Sales Currency" error={!!errors.costCurrency} helperText={errors.costCurrency?.message} />
        )}
      />
      <RHFTextField
        name="stockSalesIncVat"
        label="Stock Sales Inc Vat"
        InputProps={{
          type: 'number',
          endAdornment: <InputAdornment position="end">EUR</InputAdornment>,
        }}
        size="small"
        error={!!errors.stockSalesIncVat}
        helperText={errors.stockSalesIncVat?.message}
      />
    </Stack>
  );
}