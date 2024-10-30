import { paramCase } from 'change-case';
import { useState, useEffect } from 'react';
// next
import Head from 'next/head';
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
  Card,
  Table,
  Button,
  Tooltip,
  TableBody,
  IconButton,
  TableContainer,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from 'src/redux/store';
import { getProducts } from 'src/redux/slices/product';
// components
import { useSettingsContext } from 'src/components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import ConfirmDialog from 'src/components/confirm-dialog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import orderData from './order.json';
import { DateTimePicker} from '@mui/x-date-pickers';

// sections
import { SalesOrderTableRow, SalesOrderTableToolbar } from 'src/sections/@dashboard/salesorder/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'NUMBER', label: 'SALES ORDER NUMBER', align: 'center'},
  { id: 'CUSTOMER', label: 'CUSTOMER', align: 'center' },
  { id: 'PRODUCT', label: 'PRODUCT', align: 'center' , width: 300 },
  { id: 'PRICE', label: 'PRODUCT PRICE', align: 'center' },
  { id: 'QUANTITY', label: 'QUANTITY', align: 'center' },
  { id: 'ORDERTOTAL', label: 'ORDER TOTAL', align: 'center' },
  { id: 'CREATEDON', label: 'CREATED ON', align: 'center' },
  { id: 'STATUS', label: 'STATUS', align: 'center' },
  { id: 'N_A', label: 'N/A', align: 'center' },
];

import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers';
// routes
import { PATH_DASHBOARD } from 'src/routes/paths';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import FormProvider, {
  RHFEditor,
  RHFSelect,
  RHFTextField,
  RHFMultiSelect,
  RHFAutocomplete,
} from 'src/components/hook-form';
//
import { FormSchema } from './schema';
import ValuesPreview from './ValuesPreview';

// ----------------------------------------------------------------------

const OPTIONS = [
  { value: 'option 1', label: 'Option 1' },
  { value: 'option 2', label: 'Option 2' },
  { value: 'option 3', label: 'Option 8' },
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
  //
  editor: '',
  switch: false,
  radioGroup: '',
  autocomplete: null,
  //
  password: '',
  confirmPassword: '',
  //
  startDate: new Date(),
  endDate: null,
  //
  singleUpload: null,
  multiUpload: [],
  //
  singleSelect: '',
  multiSelect: [],
  //
  checkbox: false,
  multiCheckbox: [],
  //
  slider: 8,
  sliderRange: [15, 80],
};

// ----------------------------------------------------------------------

SalesOrderAddPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function SalesOrderAddPage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: 'name',
  });

  const { themeStretch } = useSettingsContext();

  const { push } = useRouter();

  const dispatch = useDispatch();

  const { products, isLoading } = useSelector((state) => state.product);

  const [showPassword, setShowPassword] = useState(false);

  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState('');

  const [filterStatus, setFilterStatus] = useState([]);

  const [openConfirm, setOpenConfirm] = useState(false);
  
  const methods = useForm({
    resolver: yupResolver(FormSchema),
    defaultValues,
  });

  const {
    watch,
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log('DATA', data);
    reset();
  };

//   useEffect(() => {
//     dispatch(getProducts());
//   }, [dispatch]);

//   useEffect(() => {
//     if (products.length) {
//       setTableData(products);
//     }
//   }, [products]);

  useEffect(() => {
    setTableData(orderData);
  },[dispatch])

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 60 : 80;

  const isFiltered = filterName !== '' || !!filterStatus.length;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleFilterStatus = (event) => {
    const {
      target: { value },
    } = event;
    setPage(0);
    setFilterStatus(typeof value === 'string' ? value.split(',') : value);
  };

  const handleDeleteRow = (id) => {
    const deleteRow = tableData.filter((row) => row.name !== id);
    setSelected([]);
    setTableData(deleteRow);

    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
    }
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

  const handleEditRow = (id) => {
    push(PATH_DASHBOARD.eCommerce.edit(paramCase(id)));
  };

  const handleViewRow = (id) => {
    push(PATH_DASHBOARD.eCommerce.view(paramCase(id)));
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterStatus([]);
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
                  // value={value}
                  // onChange={setValue}
                />
              </Block>

                <Block label="RHFSelect">
                  <RHFSelect name="singleSelect" label="Customer">
                    <MenuItem value="">None</MenuItem>
                    <Divider sx={{ borderStyle: 'dashed' }} />
                    {OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.label}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Block>
                <Block label="RHFSelect">
                  <RHFSelect name="singleSelect" label="Product">
                    <MenuItem value="">None</MenuItem>
                    <Divider sx={{ borderStyle: 'dashed' }} />
                    {OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.label}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Block>

                <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                  <Block title="Basic">
                    <DateTimePicker
                      renderInput={(props) => <TextField {...props} fullWidth />}
                      label="Start Date"
                      // value={value}
                      // onChange={setValue}
                    />
                  </Block>

                  <Block title="Basic">
                    <DateTimePicker
                      renderInput={(props) => <TextField {...props} fullWidth />}
                      label="End Date"
                      // value={value}
                      // onChange={setValue}
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
                      variant={"outlined"}
                      fullWidth
                      // value={values.weight}
                      // onChange={handleChange('weight')}
                      // helperText="Weight"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">Kg</InputAdornment>,
                      }}
                    />
                  </Block>
                </Stack>
                <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                  <Block label="RHFAutocomplete">
                    <Autocomplete
                      fullWidth
                      value={"EUR"}
                      options={["EUR","Dollar"]}
                      onChange={(event, newValue) => {
                        setValue(newValue);
                      }}
                      // // inputValue={inputValue}
                      // onInputChange={(event, newInputValue) => {
                      //   setInputValue(newInputValue);
                      // }}
                      renderInput={(params) => <TextField {...params} label="Sales Currency" />}
                    />
                  </Block>
                  <Block>
                    <TextField
                      variant={"outlined"}
                      fullWidth
                      // value={values.weight}
                      // onChange={handleChange('weight')}
                      label="Sales Ext Vat"
                      // helperText="Weight"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">EUR</InputAdornment>,
                      }}
                    />
                  </Block>
                </Stack>
                <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                  <Block label="RHFAutocomplete">
                    <Autocomplete
                      fullWidth
                      value={"EUR"}
                      options={["EUR","Dollar"]}
                      onChange={(event, newValue) => {
                        setValue(newValue);
                      }}
                      // // inputValue={inputValue}
                      // onInputChange={(event, newInputValue) => {
                      //   setInputValue(newInputValue);
                      // }}
                      renderInput={(params) => <TextField {...params} label="Sales Vat" />}
                    />
                  </Block>
                  <Block>
                    <TextField
                      variant={"outlined"}
                      fullWidth
                      // value={values.weight}
                      // onChange={handleChange('weight')}
                      label="Sales Inc Vat"
                      // helperText="Weight"
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

        <Card>
          <SalesOrderTableToolbar
            filterName={filterName}
            filterStatus={filterStatus}
            onFilterName={handleFilterName}
            onFilterStatus={handleFilterStatus}
            // statusOptions={STATUS_OPTIONS}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row.name)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={handleOpenConfirm}>
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 1200 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.name)
                    )
                  }
                />

                <TableBody>
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <SalesOrderTableRow
                          key={row.name}
                          row={row}
                          selected={selected.includes(row.name)}
                          onSelectRow={() => onSelectRow(row.name)}
                          onDeleteRow={() => handleDeleteRow(row.name)}
                          onEditRow={() => handleEditRow(row.name)}
                          onViewRow={() => handleViewRow(row.name)}
                        />
                      ) : (
                        !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                      )
                    )}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            //
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {selected.length} </strong> items?
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

function applyFilter({ inputData, comparator, filterName, filterStatus }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (product) => product.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus.length) {
    inputData = inputData.filter((product) => filterStatus.includes(product.inventoryType));
  }

  return inputData;
}


// ----------------------------------------------------------------------

Block.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node,
  sx: PropTypes.object,
};

function Block({ label = 'RHFTextField', sx, children }) {
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
        {/* {label} */}
      </Typography>
      {children}
    </Stack>
  );
}