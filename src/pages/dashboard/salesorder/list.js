import { paramCase } from 'change-case';
import { useState, useEffect } from 'react';
// next
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// @mui
import {
  Card,
  Table,
  Button,
  Tooltip,
  TableBody,
  Container,
  IconButton,
  TableContainer,
} from '@mui/material';

// import { width } from '@mui/system';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// layouts
import DashboardLayout from '../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../components/settings';
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
} from '../../../components/table';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import ConfirmDialog from '../../../components/confirm-dialog';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
// import orderData from './order.json';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { getSalesOrders, deleteSalesOrder } from '../../../redux/slices/salesorder';

// sections
import { SalesOrderTableRow, SalesOrderTableToolbar } from '../../../sections/@dashboard/salesorder/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'SALES ORDER NUMBER', align: 'center'},
  // { id: 'CUSTOMER', label: 'CUSTOMER', align: 'center' },
  { id: 'PRODUCT', label: 'PRODUCT', align: 'center' , width: 300 },
  { id: 'PRICE', label: 'PRODUCT PRICE', align: 'center' },
  { id: 'QUANTITY', label: 'QUANTITY', align: 'center' },
  { id: 'ORDERTOTAL', label: 'ORDER TOTAL', align: 'center' },
  { id: 'CREATEDON', label: 'CREATED ON', align: 'center' },
  { id: 'STATUS', label: 'STATUS', align: 'center' },
  { id: 'N_A', label: 'N/A', align: 'center' },
  { id: 'Action', label: 'ACTION', align: 'center' },
];

// ----------------------------------------------------------------------

SalesOrderListPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function SalesOrderListPage() {
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
    defaultOrderBy: 'customer',
  });

  const { themeStretch } = useSettingsContext();

  const { push } = useRouter();

  const dispatch = useDispatch();

  const { allOrders, isLoading } = useSelector((state) => state.salesorder);

  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState('');

  const [filterStatus, setFilterStatus] = useState([]);

  const [openConfirm, setOpenConfirm] = useState(false);

  useEffect(() => {
    dispatch(getSalesOrders());
  }, [dispatch]);

  useEffect(() => {
    if (allOrders.length) {
      const extractedData = allOrders.map((orderData) => ({
        id:orderData.id,
        salesIncVat:orderData.salesIncVat,
        processQuantity:orderData.processQuantity,
        totalQuantity:orderData.totalQuantity,
        totalPrice:orderData.totalPrice,
        createdOn:orderData.createdOn,
        status:orderData.status,
        N_A:orderData.N_A,
        // customer: orderData.customer?.name || "Unknown Customer",
        product: orderData.product?.name || "Unknown Product",
      }));
      console.log("extractedData"  ,extractedData);
      setTableData(extractedData);
    }
  }, [allOrders]);

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
    const deleteRow = tableData.filter((row) => row.id !== id);
    setSelected([]);
    setTableData(deleteRow);
    dispatch(deleteSalesOrder(id));
    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
    }
  };

  const handleDeleteRows = (selectedRows) => {
    const deleteRows = tableData.filter((row) => !selectedRows.includes(row.id));
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
    push(PATH_DASHBOARD.salesorder.view(paramCase(id)));
  };

  const handleViewRow = (id) => {
    push(PATH_DASHBOARD.salesorder.view(paramCase(id)));
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterStatus([]);
  };

  return (
    <>
      <Head>
        <title> ORDERS: SalesOrder List</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'mg'}>
        <CustomBreadcrumbs
          heading="SalesOrder List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'SalesOrder',
              href: PATH_DASHBOARD.salesorder.list,
            },
            { name: 'List' },
          ]}
          action={
            <Button
              component={NextLink}
              href={PATH_DASHBOARD.salesorder.add}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Add Sales Order
            </Button>
          }
        />
        {/* <Stack direction="row" alignItems="center">
          <FormControlLabel label="All(98265)" control={<Checkbox  />} />
          <FormControlLabel label="Pending(113)" control={<Checkbox />} />
          <FormControlLabel label="Processing(168)" control={<Checkbox />} />
          <FormControlLabel label="processing-W(0)" control={<Checkbox />} />
          <FormControlLabel label="processing-E(0)" control={<Checkbox />} />
          <FormControlLabel label="Completed(96522)" control={<Checkbox />} />
          <FormControlLabel label="Completed-E(1462)" control={<Checkbox />} />
        </Stack> */}
        <Card>
          <SalesOrderTableToolbar
            filterName={filterName}
            filterStatus={filterStatus}
            onFilterName={handleFilterName}
            onFilterStatus={handleFilterStatus}
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
                  tableData.map((row) => row.id)
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
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <SalesOrderTableRow
                          key={row.id}
                          row={row}
                          selected={selected.includes(row.id)}
                          onSelectRow={() => onSelectRow(row.id)}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                          onEditRow={() => handleEditRow(row.id)}
                          onViewRow={() => handleViewRow(row.id)}
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

  // Helper function to flatten an object
  function flattenObject(obj, prefix = "") {
    return Object.keys(obj).reduce((acc, key) => {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        // Recursively flatten nested objects
        Object.assign(acc, flattenObject(value, newKey));
      } else if (Array.isArray(value)) {
        // Convert arrays to strings for searching
        acc[newKey] = value.join(", ");
      } else {
        // Add primitive values (strings, numbers, etc.)
        acc[newKey] = value;
      }

      return acc;
    }, {});
  }

  // Filter the input data
  return inputData.filter((item) => {
    // Flatten the object
    const flatItem = flattenObject(item);

    // Check if any field in the flattened object contains the filterName (case-insensitive)
    return Object.values(flatItem).some((value) =>
      String(value).toLowerCase().includes(filterName.toLowerCase())
    );
  });
}
