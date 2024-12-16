import React from 'react';
import { Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';

export default function SubmitButton({ isSubmitting }) {
  return (
    <Box sx={{ textAlign: 'center', marginTop: 3 }}>
      <LoadingButton fullWidth color="info" size="large" type="submit" variant="contained" loading={isSubmitting}>
        Submit to Add
      </LoadingButton>
    </Box>
  );
}