import React from 'react';
import { Stack, Box, Divider, Typography, TextField, Autocomplete } from '@mui/material';

export default function OrderInformation({ products, watch, setValue, errors }) {
  return (
    <Box sx={{ padding: 2, border: '1px solid #e0e0e0', borderRadius: 2, marginBottom: 3 }}>
      <Typography variant="h6" gutterBottom>
        Order Information
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Stack spacing={3}>
        <TextField variant="outlined" fullWidth label="Friendly Name" size="small" />
        <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
          <Autocomplete
            fullWidth
            options={products}
            getOptionLabel={(option) => `${option?.name || ''} (${option?.sku || ''})`}
            value={products.find((product) => product.id === watch('Product')) || null}
            isOptionEqualToValue={(option, value) => option.name === value?.name}
            onChange={(event, newValue) => setValue('Product', newValue?.id || '')}
            renderInput={(params) => (
              <TextField {...params} label="Related Sales Order" error={!!errors.Product} helperText={errors.Product?.message} />
            )}
            size="small"
          />
          <Autocomplete
            fullWidth
            options={products}
            getOptionLabel={(option) => `${option?.name || ''} (${option?.sku || ''})`}
            value={products.find((product) => product.id === watch('Product')) || null}
            isOptionEqualToValue={(option, value) => option.name === value?.name}
            onChange={(event, newValue) => setValue('Product', newValue?.id || '')}
            renderInput={(params) => (
              <TextField {...params} label="Product" error={!!errors.Product} helperText={errors.Product?.message} />
            )}
            size="small"
          />
        </Stack>
      </Stack>
    </Box>
  );
}