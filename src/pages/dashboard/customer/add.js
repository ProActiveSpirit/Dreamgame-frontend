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

// Validation schema
import { useRouter } from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
// Redux
import { useDispatch, useSelector } from '../../../redux/store';
import { createCustomer } from '../../../redux/slices/user';

// Components
import { useSettingsContext } from '../../../components/settings';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
// Routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// Layouts
import DashboardLayout from '../../../layouts/dashboard';
import axios from '../../../utils/axios';

// ----------------------------------------------------------------------

// Default values for the form
export const defaultValues = {
  address: '',
  city: '',
  company: '',
  companyInvoice: '',
  countryCode: '',
  defaultVatRate: '',
  email: '',
  facebook: '',
  inActive: 'true',
  linkedIn: '',
  name: '',
  phone: '',
  primaryEmail: '',
  primaryFacebook: '',
  primaryLinkedIn: '',
  primaryName: '',
  primaryPhone: '',
  primarySkype: '',
  primarySurname: '',
  primaryTwitter: '',
  salesCurrency: '',
  salesRegion: '',
  skype: '',
  state: '',
  taxInformation: '',
  twitter: '',
  website: '',
  zipCode: '',
};

// ----------------------------------------------------------------------

SalesOrderAddPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

// Validation schema using Yup
const FormSchema = Yup.object().shape({
  company: Yup.string().required('Company Name is required'),
  name: Yup.string()
    .required('Display Name is required')
    .min(2, 'Display Name must be at least 2 characters')
    .max(50, 'Display Name must not exceed 50 characters'),
  website: Yup.string()
    .url('Invalid website URL')
    .required('Website URL is required'),
  // ... existing validation rules ...
});

export default function SalesOrderAddPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();
  const router = useRouter();
  const [regions, setRegions] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [salesRegion, setSalesRegion] = useState();
  const [salesCurrency, setSalesCurrency] = useState();
  const [countryCode, setCountryCode] = useState();

  useEffect(() => {
    const fetchRegionsAndCurrencies = async () => {
      try {
        // Fetch regions and currencies from the REST Countries API
        const regionsResponse = await axios.get('https://restcountries.com/v3.1/all');

        // Extract regions data
        const fetchedRegions = regionsResponse.data.map((country) => ({
          code: country.cca2, // ISO country code (e.g., "ES")
          name: country.name.common, // Country name (e.g., "Spain")
        }));

        // Extract unique currency codes
        const fetchedCurrencies = regionsResponse.data
          .flatMap((country) => Object.keys(country.currencies || {})) // Get currency codes
          .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates

        setRegions(fetchedRegions); // Set regions state
        setCurrencies(fetchedCurrencies); // Set currencies state
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

  const inActive = watch('inActive', false);

  const onSubmit = async (data) => {
    try {
      const updatedData = {
        ...data,
        salesRegion: salesRegion?.code || '',
        salesCurrency, 
        countryCode,
      };
      
      const response = await dispatch(createCustomer(updatedData));
      
      // Check if the response was successful
      if (response?.payload?.message) {
        enqueueSnackbar(response.payload.message, { variant: 'success' });
        reset(defaultValues);
        router.push(PATH_DASHBOARD.customer.list);
      }
    } catch (error) {
      enqueueSnackbar(error.message || 'Error creating customer', { variant: 'error' });
      console.error('Error submitting form:', error);
    }
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
                  label="Company Name *"
                  size="small"
                  required
                  error={!!errors.company}
                  helperText={errors.company?.message}
                />
                <RHFTextField
                  name="name"
                  label="Display Name *"
                  size="small"
                  required
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
                <RHFTextField
                  name="website"
                  label="Website URL *"
                  size="small"
                  required
                  error={!!errors.website}
                  helperText={errors.website?.message}
                />
                <RHFTextField
                  name="email"
                  label="Email"
                  size="small"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
                <RHFTextField
                  name="phone"
                  label="Phone"
                  size="small"
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
                <RHFTextField
                  name="linkedIn"
                  label="LinkedIn"
                  size="small"
                  error={!!errors.linkedin}
                  helperText={errors.linkedin?.message}
                />
                <RHFTextField
                  name="skype"
                  label="Skype"
                  size="small"
                  error={!!errors.skype}
                  helperText={errors.skype?.message}
                />
                <RHFTextField
                  name="facebook"
                  label="Facebook"
                  size="small"
                  error={!!errors.facebook}
                  helperText={errors.facebook?.message}
                />
                <RHFTextField
                  name="twitter"
                  label="Twitter"
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
                  size="small"
                  error={!!errors.company}
                  helperText={errors.company?.message}
                />
                <RHFTextField
                  name="address"
                  label="Address"
                  size="small"
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
                <RHFTextField
                  name="zipCode"
                  label="ZipCode"
                  size="small"
                  error={!!errors.zipCode}
                  helperText={errors.zipCode?.message}
                />
                <RHFTextField
                  name="city"
                  label="City"
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
                  defaultValue="NL"
                  error={!!errors.CountryCode}
                  helperText={errors.CountryCode?.message}
                />
                {/* Sales Region Autocomplete */}
                <Autocomplete
                  fullWidth
                  options={regions || []} // Ensure fallback to an empty array
                  getOptionLabel={(option) => `${option.code} - ${option.name}`}
                  onChange={(event, newValue) => setSalesRegion(newValue)} // Log selected value
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
                  defaultValue="0"
                  error={!!errors.taxInformation}
                  helperText={errors.taxInformation?.message}
                />
                {/* Sales Currency Autocomplete */}
                <Autocomplete
                  fullWidth
                  options={currencies || []} // Ensure options is always an array
                  getOptionLabel={(option) => option} // Show currency code directly
                  onChange={(event, newValue) => setSalesCurrency(newValue)} // Handle selection
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Sales Currencies"
                      placeholder="Select currency(ies)"
                    />
                  )}
                />
                <RHFTextField
                  name="defaultVatRate"
                  label="Default Vat Rate"
                  InputProps={{ type: 'string' }}
                  size="small"
                  defaultValue="0"
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
                <RadioGroup
                  row
                  value={inActive} // Bind the form value
                  onChange={(event) => setValue('inActive', event.target.value === 'true')} // Update form value
                >
                  <FormControlLabel value="true" control={<Radio />} label="Yes" />
                  <FormControlLabel value="false" control={<Radio />} label="No" />
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
