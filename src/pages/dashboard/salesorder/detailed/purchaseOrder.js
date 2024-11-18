import { useState } from 'react';
import PropTypes from 'prop-types';

// @mui
import { Box, Autocomplete, TextField, Stack, InputAdornment, Container } from '@mui/material';
import { Masonry } from '@mui/lab';

import { DateTimePicker } from '@mui/x-date-pickers';

import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';

// import ExtendPrice from './extprice'

export default function BillingInformation({ variant }) {
  const [values, setValues] = useState({
    amount: '',
    password: '',
    weight: '',
    weightRange: '',
    showPassword: false,
  });

  // State to manage selected regions in the Autocomplete
  const [selectedRegions, setSelectedRegions] = useState([top100Films[1]]);
  const [allRegion, setAllRegions] = useState(false);

  // Function to handle setting all regions
  const handleAddAllRegions = () => {
    setSelectedRegions(top100Films); // Set all options as selected
  };

  return (
    <Container maxWidth="md">
      <Masonry columns={{ xs: 1 }} spacing={2}>
        <TextField
          variant={variant}
          required
          fullWidth
          label="Quantity"
          defaultValue="100"
        />

        <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
          <TextField
            variant="outlined"
            fullWidth
            value="38"
            // onChange={handleChange('weight')}
            label="Sales"
            // helperText="Weight"
            InputProps={{
              endAdornment: <InputAdornment position="start">EUR</InputAdornment>,
            }}
          />
          <TextField
            variant="outlined"
            fullWidth
            value="36"
            // onChange={handleChange('weight')}
            label="Expected Cost"
            // helperText="Weight"
            InputProps={{
              endAdornment: <InputAdornment position="end">EUR</InputAdornment>,
            }}
          />
        </Stack>
        <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
          <DateTimePicker
            renderInput={(props) => <TextField {...props} fullWidth />}
            label="Start Date"
            // value={value}
            // onChange={setValue}
          />
          <DateTimePicker
            renderInput={(props) => <TextField {...props} fullWidth />}
            label="End Date"
            // value={value}
            // onChange={setValue}
          />
        </Stack>

        <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
          <Autocomplete
            multiple
            fullWidth
            options={top100Films}
            getOptionLabel={(option) => option.title}
            value={selectedRegions} // Bind the selected regions to the value prop
            onChange={(event, newValue) => setSelectedRegions(newValue)} // Update the state on change
            filterSelectedOptions
            renderInput={(params) => (
              <TextField {...params} label="Template Regions" placeholder="Country Code" />
            )}
          />
          <button
            type="button" // Set explicit button type
            onClick={handleAddAllRegions}
            style={{
              width: '100px',
              color: 'green',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '16px', // Increase font size
            }}
          >
            (+) add all
          </button>
        </Stack>
        <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
          <Label variant="filled" color="warning" size="large" startIcon={<Iconify icon="eva:save-fill" />}>
            Save & Generate Auto-Calculated
          </Label>
          <Label variant="filled" color="primary" startIcon={<Iconify icon="eva:save-fill" />}>
            Save & Generate Empty
          </Label>
          <Label variant="filled" color="error" startIcon={<Iconify icon="eva:save-fill" />}>
            Generate POs from the template
          </Label>
        </Stack>
      </Masonry>
    </Container>
  );
}

BillingInformation.propTypes = {
  variant: PropTypes.string.isRequired,
};

// ----------------------------------------------------------------------

export const top100Films = [
  { title: 'BE', year: 1994 },
  { title: 'DE', year: 1972 },
  { title: 'ES', year: 1974 },
  { title: 'FR', year: 2008 },
  { title: 'NL', year: 1957 },
  { title: 'PT', year: 1993 },
  { title: 'PL', year: 1994 },
  { title: 'NO', year: 2003 },
  { title: 'GB', year: 1966 },
];