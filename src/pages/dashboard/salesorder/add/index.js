import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
// @mui
import {
  Grid,
  Stack,
  Divider,
  Container,
  MenuItem,
  TextField,
  Typography,
  Autocomplete,
  InputAdornment,
  Button,
} from '@mui/material';
// validation schema
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

import { LoadingButton } from '@mui/lab';
import { DateTimePicker } from '@mui/x-date-pickers';
// redux
import { useDispatch } from '../../../../redux/store';
// components
import { useSettingsContext } from '../../../../components/settings';
import {
  useTable,
  getComparator,
} from '../../../../components/table';
import ConfirmDialog from '../../../../components/confirm-dialog';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import FormProvider, {
  RHFSelect,
  RHFTextField,
} from '../../../../components/hook-form';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// layouts
import DashboardLayout from '../../../../layouts/dashboard';

// custom components
import { FormSchema } from '../../../../sections/_examples/extra/form/schema';
import orderData from './order.json';

// ----------------------------------------------------------------------

const OPTIONS = [
  { value: 'option 1', label: 'Option 1' },
  { value: 'option 2', label: 'Option 2' },
  { value: 'option 3', label: 'Option 3' },
  { value: 'option 4', label: 'Option 4' },
  { value: 'option 5', label: 'Option 5' },
  { value: 'option 6', label: 'Option 6' },
  { value: 'option 7', label: 'Option 7' },
  { value: 'option 8', label: 'Option 8' },
];

export const defaultValues = {
  age: 0,
  email: '',
  fullName: '',
  editor: '',
  switch: false,
  radioGroup: '',
  autocomplete: null,
  password: '',
  confirmPassword: '',
  startDate: new Date(),
  endDate: null,
  singleUpload: null,
  multiUpload: [],
  singleSelect: '',
  multiSelect: [],
  checkbox: false,
  multiCheckbox: [],
  slider: 8,
  sliderRange: [15, 80],
};

// ----------------------------------------------------------------------

SalesOrderAddPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function SalesOrderAddPage() {
  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    selected,
    setSelected,
  } = useTable({
    defaultOrderBy: 'name',
  });

  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();

  const [tableData, setTableData] = useState([]);

  const [openConfirm, setOpenConfirm] = useState(false);
  
  const methods = useForm({
    resolver: yupResolver(FormSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log('DATA', data);
    reset();
  };

  useEffect(() => {
    setTableData(orderData);
  }, [dispatch]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleDeleteRows = (selectedRows) => {
    const deleteRows = tableData.filter((row) => !selectedRows.includes(row.name));
    setSelected([]);
    setTableData(deleteRows);

    if (page > 0) {
      if (selectedRows.length === dataInPage.length) {
        setPage(page - 1);
      } else if (selectedRows.length === dataFiltered.length) {
        setPage(0);
      } else if (selectedRows.length > dataInPage.length) {
        const newPage = Math.ceil((tableData.length - selectedRows.length) / rowsPerPage) - 1;
        setPage(newPage);
      }
    }
  };

  return (
    <>
      <Container maxWidth={themeStretch ? false : 'mg'}>
        <CustomBreadcrumbs
          heading="SalesOrder Add"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'SalesOrder',
              href: PATH_DASHBOARD.salesorder.list,
            },
            { name: 'add' },
          ]}
        />

        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={5} md={6}>
              <Stack spacing={2}>
                <Block title="Basic">
                  <DateTimePicker
                    renderInput={(props) => <TextField {...props} fullWidth />}
                    label="Order Date"
                  />
                </Block>

                <Block >
                  <Autocomplete
                    fullWidth
                    options={top100Films}
                    getOptionLabel={(option) => option.title}
                    renderInput={(params) => <TextField {...params} label="Customer" margin="none" />}
                  />
                  <Autocomplete
                    fullWidth
                    options={top100Films}
                    getOptionLabel={(option) => option.title}
                    renderInput={(params) => <TextField {...params} label="Product" margin="none" />}
                  />
                </Block>
                <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                  <Block title="Basic">
                    <DateTimePicker
                      renderInput={(props) => <TextField {...props} fullWidth />}
                      label="Start Date"
                    />
                  </Block>

                  <Block title="Basic">
                    <DateTimePicker
                      renderInput={(props) => <TextField {...props} fullWidth />}
                      label="End Date"
                    />
                  </Block>
                </Stack>
                <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                  <Block>
                    <RHFTextField
                      name="age"
                      label="Quantity"
                      onChange={(event) =>
                        setValue('age', Number(event.target.value), { shouldValidate: true })
                      }
                      InputProps={{
                        type: 'number',
                      }}
                    />
                  </Block>
                  <Block>
                    <TextField
                      variant="outlined"
                      fullWidth
                      InputProps={{
                        endAdornment: <InputAdornment position="end">Kg</InputAdornment>,
                      }}
                    />
                  </Block>
                </Stack>
                <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                  <Block >
                    <Autocomplete
                      fullWidth
                      value="EUR"
                      options={["EUR", "Dollar"]}
                      onChange={(event, newValue) => {
                        setValue(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} label="Sales Currency" />}
                    />
                  </Block>
                  <Block>
                    <TextField
                      variant="outlined"
                      fullWidth
                      label="Sales Ext Vat"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">EUR</InputAdornment>,
                      }}
                    />
                  </Block>
                </Stack>
                <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                  <Block >
                    <Autocomplete
                      fullWidth
                      value="EUR"
                      options={["EUR", "Dollar"]}
                      onChange={(event, newValue) => {
                        setValue(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} label="Sales Vat" />}
                    />
                  </Block>
                  <Block>
                    <TextField
                      variant="outlined"
                      fullWidth
                      label="Sales Inc Vat"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">EUR</InputAdornment>,
                      }}
                    />
                  </Block>
                </Stack>
                <LoadingButton
                  fullWidth
                  color="info"
                  size="large"
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                >
                  Submit to add
                </LoadingButton>
              </Stack>
            </Grid>
          </Grid>
        </FormProvider>
      </Container>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content={
          <>
            Are you sure you want to delete <strong>{selected.length}</strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows(selected);
              handleCloseConfirm();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  return inputData;
}

// ----------------------------------------------------------------------

Block.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node,
  sx: PropTypes.object,
};

function Block({ label = '', sx, children }) {
  return (
    <Stack spacing={1} sx={{ width: 1, ...sx }}>
      <Typography
        variant="caption"
        sx={{
          textAlign: 'right',
          fontStyle: 'italic',
          color: 'text.disabled',
        }}
      >
        {label}
      </Typography>
      {children}
    </Stack>
  );
}


export const top100Films = [
  { title: 'BE', year: 1994 },
  { title: 'DE', year: 1972 },
  { title: 'ES', year: 1974 },
  { title: 'FR', year: 2008 },
  { title: 'NL', year: 1957 },
  { title: "PT", year: 1993 },
  { title: 'PL', year: 1994 },
  { title: 'NO', year: 2003 },
  { title: 'GB', year: 1966 },
];