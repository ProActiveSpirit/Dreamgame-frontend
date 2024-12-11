import React from 'react';
import { Stack, Typography, Divider, Autocomplete, TextField, InputAdornment } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import RHFTextField from '../../../../../../components/hook-form/RHFTextField';

export default function CostInformation() {
  const { control, watch, setValue, formState: { errors } } = useFormContext();

  return (
    <Stack spacing={2}>
      <Typography variant="h7" gutterBottom>
        Cost Information
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Controller
        name="costCurrency"
        control={control}
        render={({ field }) => (
          <Autocomplete
            {...field}
            fullWidth
            disableClearable
            options={['EUR', 'Dollar']}
            onChange={(event, newValue) => field.onChange(newValue)}
            size="small"
            renderInput={(params) => (
              <TextField
                {...params}
                label="Cost Currency"
                error={!!errors.costCurrency}
                helperText={errors.costCurrency?.message}
              />
            )}
          />
        )}
      />
      <RHFTextField
        name="costExtVat"
        label="Cost Ext Vat"
        InputProps={{
          type: 'number',
          endAdornment: <InputAdornment position="end">EUR</InputAdornment>,
        }}
        size="small"
        error={!!errors.costExtVat}
        helperText={errors.costExtVat?.message}
      />
      <RHFTextField
        name="costVat"
        label="Cost Vat"
        InputProps={{
          type: 'number',
          endAdornment: <InputAdornment position="end">%</InputAdornment>,
        }}
        size="small"
        error={!!errors.costVat}
        helperText={errors.costVat?.message}
      />
      <RHFTextField
        name="costIncVat"
        label="Cost Inc Vat"
        InputProps={{
          type: 'number',
          endAdornment: <InputAdornment position="end">EUR</InputAdornment>,
        }}
        size="small"
        error={!!errors.costIncVat}
        helperText={errors.costIncVat?.message}
      />
    </Stack>
  );
}