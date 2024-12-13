import { useEffect, useState } from 'react';
// @mui
import {
  Grid,
  Stack,
  Divider,
  TextField,
  RadioGroup,
  Autocomplete,
  Radio,
  Container,
  FormControlLabel,
  Typography,
} from '@mui/material';
import axios from 'axios';
// Validation schema
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { LoadingButton } from '@mui/lab';
// Redux
import { useDispatch, useSelector } from '../../../redux/store';
import { createSalesOrder } from '../../../redux/slices/salesorder';

// Components
import { useSettingsContext } from '../../../components/settings';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
// Routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// Layouts
import DashboardLayout from '../../../layouts/dashboard';

// ----------------------------------------------------------------------

// Default values for the form
export const defaultValues = {
  firstname: '',
  lastname: '',
  enail: '',
  website: '',
  ip: '',
  region: '',
};

// ----------------------------------------------------------------------

SalesOrderAddPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

// Validation schema using Yup
const FormSchema = Yup.object().shape({
  company: Yup.string()
    .required('Company Name is required')
    .min(2, 'Company Name must be at least 2 characters')
    .max(50, 'Company Name must not exceed 50 characters'),
  name: Yup.string()
    .required('Display Name is required')
    .min(2, 'Display Name must be at least 2 characters')
    .max(50, 'Display Name must not exceed 50 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  website: Yup.string()
    .url('Invalid website URL')
    .required('Website is required'),
});

export default function SalesOrderAddPage() {
  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();

  const [regions, setRegions] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedCurrencies, setSelectedCurrencies] = useState([]);

  useEffect(() => {
    const fetchRegionsAndCurrencies = async () => {
      try {
        // Fetch regions from a REST API (e.g., REST Countries API)
        const regionsResponse = await axios.get('https://restcountries.com/v3.1/all');
        const fetchedRegions = regionsResponse.data.map((country) => ({
          code: country.cca2, // ISO country code (e.g., "ES")
          name: country.name.common, // Country name (e.g., "Spain")
        }));

        // Fetch currencies (use a static list or API)
        const fetchedCurrencies = regionsResponse.data
          .flatMap((country) => Object.keys(country.currencies || {})) // Get unique currency codes
          .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
        
        console.log("fetchedRegions" , fetchedRegions);
        console.log("fetchedCurrencies" , fetchedCurrencies);
        setRegions(fetchedRegions);
        setCurrencies(fetchedCurrencies);
      } catch (error) {
        console.error('Error fetching regions or currencies:', error);
      }
    };

    fetchRegionsAndCurrencies();
  }, []);

  const methods = useForm({
    resolver: yupResolver(FormSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = methods;

  // Watch fields for dynamic updates
  const salesExtVat = watch('salesExtVat');
  const salesVat = watch('salesVat');

  const onSubmit = async (data) => {
    console.log('DATA', data); // Debug the form data
    dispatch(createSalesOrder(data));
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate API call
    reset(defaultValues); // Reset the form explicitly, including Autocomplete fields
  };

  return (
    <>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Customer Add"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Customer',
              href: PATH_DASHBOARD.customer.list,
            },
            { name: 'Add' },
          ]}
        />

        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="h7" gutterBottom>
            General
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={12} md={8}>
              <Stack spacing={1}>
                <RHFTextField
                  name="company"
                  label="Company Name"
                  InputProps={{ type: 'string' }}
                  size="small"
                  error={!!errors.company}
                  helperText={errors.company?.message}
                />
                <RHFTextField
                  name="name"
                  label="Display Name"
                  InputProps={{ type: 'string' }}
                  size="small"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
                <RHFTextField
                  name="website"
                  label="Website Url"
                  InputProps={{ type: 'string' }}
                  size="small"
                  error={!!errors.website}
                  helperText={errors.website?.message}
                />
                <RHFTextField
                  name="email"
                  label="Email"
                  InputProps={{ type: 'string' }}
                  size="small"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
                <RHFTextField
                  name="phone"
                  label="Phone"
                  InputProps={{ type: 'string' }}
                  size="small"
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
                <RHFTextField
                  name="linkedIn"
                  label="LinkedIn"
                  InputProps={{ type: 'string' }}
                  size="small"
                  error={!!errors.linkedin}
                  helperText={errors.linkedin?.message}
                />
                <RHFTextField
                  name="skype"
                  label="Skype"
                  InputProps={{ type: 'string' }}
                  size="small"
                  error={!!errors.skype}
                  helperText={errors.skype?.message}
                />
                <RHFTextField
                  name="facebook"
                  label="Facebook"
                  InputProps={{ type: 'string' }}
                  size="small"
                  error={!!errors.facebook}
                  helperText={errors.facebook?.message}
                />
                <RHFTextField
                  name="twitter"
                  label="Twitter"
                  InputProps={{ type: 'string' }}
                  size="small"
                  error={!!errors.twitter}
                  helperText={errors.twitter?.message}
                />
              </Stack>
            </Grid>
          </Grid>
          <Typography variant="h7" gutterBottom>
            Invoice Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={12} md={8}>
              <Stack spacing={1}>
                <RHFTextField
                  name="companyInvoice"
                  label="Company Name (Invoice)"
                  InputProps={{ type: 'string' }}
                  size="small"
                  error={!!errors.company}
                  helperText={errors.company?.message}
                />
                <RHFTextField
                  name="address"
                  label="Address"
                  InputProps={{ type: 'string' }}
                  size="small"
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
                <RHFTextField
                  name="zipCode"
                  label="ZipCode"
                  InputProps={{ type: 'string' }}
                  size="small"
                  error={!!errors.zipCode}
                  helperText={errors.zipCode?.message}
                />
                <RHFTextField
                  name="city"
                  label="City"
                  InputProps={{ type: 'string' }}
                  size="small"
                  error={!!errors.city}
                  helperText={errors.city?.message}
                />
                <RHFTextField
                  name="state"
                  label="State"
                  InputProps={{ type: 'string' }}
                  size="small"
                  error={!!errors.state}
                  helperText={errors.state?.message}
                />
                <RHFTextField
                  name="countryCode"
                  label="CountryCode"
                  InputProps={{ type: 'string' }}
                  size="small"
                  error={!!errors.linkedin}
                  helperText={errors.linkedin?.message}
                />
                {/* Sales Region Autocomplete */}
                <Autocomplete
                  multiple
                  fullWidth
                  options={regions}
                  getOptionLabel={(option) => `${option.code} - ${option.name}`} // E.g., "ES - Spain"
                  value={selectedRegions}
                  onChange={(event, newValue) => setSelectedRegions(newValue)}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField {...params} label="Sales Regions" placeholder="Select region(s)" />
                  )}
                />
                <RHFTextField
                  name="taxInformation"
                  label="Tax Information"
                  InputProps={{ type: 'string' }}
                  size="small"
                  error={!!errors.taxInformation}
                  helperText={errors.taxInformation?.message}
                />
                {/* Sales Currency Autocomplete */}
                <Autocomplete
                  multiple
                  fullWidth
                  options={currencies} // Array of currency codes (e.g., "AED", "ARD", etc.)
                  getOptionLabel={(option) => option} // Show currency code directly
                  value={selectedCurrencies}
                  onChange={(event, newValue) => setSelectedCurrencies(newValue)}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField {...params} label="Sales Currencies" placeholder="Select currency(ies)" />
                  )}
                />
                <RHFTextField
                  name="defaultVatRate"
                  label="Default Vat Rate"
                  InputProps={{ type: 'string' }}
                  size="small"
                  error={!!errors.defaultVatRate}
                  helperText={errors.defaultVatRate?.message}
                />
              </Stack>
            </Grid>
          </Grid>
          <Typography variant="h7" gutterBottom>
            Primary Contact Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={12} md={8}>
              <Stack spacing={1}>
                <RHFTextField
                  name="primaryName"
                  label="Name"
                  InputProps={{ type: 'string' }}
                  size="small"
                  error={!!errors.primaryName}
                  helperText={errors.primaryName?.message}
                />
                <RHFTextField
                  name="primarySurname"
                  label="Surname"
                  InputProps={{ type: 'string' }}
                  size="small"
                  error={!!errors.primarySurname}
                  helperText={errors.primarySurname?.message}
                />
                <RHFTextField
                  name="primaryEmail"
                  label="Email"
                  InputProps={{ type: 'string' }}
                  size="small"
                  error={!!errors.primaryEmail}
                  helperText={errors.primaryEmail?.message}
                />
                <RHFTextField
                  name="primaryPhone"
                  label="Phone"
                  InputProps={{ type: 'string' }}
                  size="small"
                  error={!!errors.primaryPhone}
                  helperText={errors.primaryPhone?.message}
                />
                <RHFTextField
                  name="primarySkype"
                  label="Skype"
                  InputProps={{ type: 'string' }}
                  size="small"
                  error={!!errors.primarySkype}
                  helperText={errors.primarySkype?.message}
                />
                <RHFTextField
                  name="primaryLinkedIn"
                  label="LinkedIn"
                  InputProps={{ type: 'string' }}
                  size="small"
                  error={!!errors.primaryLinkedIn}
                  helperText={errors.primaryLinkedIn?.message}
                />
                <RHFTextField
                  name="primaryFacebook"
                  label="Facebook"
                  InputProps={{ type: 'string' }}
                  size="small"
                  error={!!errors.primaryFacebook}
                  helperText={errors.primaryFacebook?.message}
                />
                <RHFTextField
                  name="primaryTwitter"
                  label="Twitter"
                  InputProps={{ type: 'string' }}
                  size="small"
                  error={!!errors.primaryTwitter}
                  helperText={errors.primaryTwitter?.message}
                />
              </Stack>
            </Grid>
          </Grid>
          <Divider sx={{ mb: 2 }} />
          <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={12} md={8}>
              <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                    In Active
                  </Typography>
                  <RadioGroup row defaultValue="g">
                    <FormControlLabel value="g" control={<Radio />} label="Yes" />
                    <FormControlLabel value="p" control={<Radio size="small" />} label="No" />
                  </RadioGroup>
              </Stack>
            </Grid>
          </Grid>
          {/* Submit Button */}
          <LoadingButton
            fullWidth
            color="info"
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Submit to Add
          </LoadingButton>
        </FormProvider>
      </Container>
    </>
  );
}