import { paramCase } from 'change-case';
import { useState, useEffect } from 'react';
// next
import Head from 'next/head';
import { useRouter } from 'next/router';
// @mui
import {
  Card,
  Stack,
  Table,
  Button,
  Tooltip,
  TableBody,
  Container,
  Fab,
  TableContainer,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// layouts
import DashboardLayout from '../../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../../components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from '../../../../components/table';
import Scrollbar from '../../../../components/scrollbar';
import ConfirmDialog from '../../../../components/confirm-dialog';
import orderData from './relatedorder.json';
import Iconify from '../../../../components/iconify';
// sections
import { RelatedOrderTableRow } from '../../../../sections/@dashboard/salesorder/detailed/relatedorder';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'NUMBER', label: 'SALES ORDER NUMBER', align: 'center' },
  { id: 'PRODUCT', label: 'PRODUCT', align: 'center' },
  { id: 'PROVIDER', label: 'PROVIDER', align: 'center' },
  { id: 'REGION', label: 'REGION', align: 'center' },
  { id: 'INCVAT', label: 'COST INC VAT', align: 'center' },
  { id: 'QUANTITY', label: 'QUANTITY', align: 'center' },
  { id: 'STOCKING', label: 'STOCKING', align: 'center' },
  { id: 'TOTALVAT', label: 'TOTAL COST INC VAT', align: 'center' },
  { id: 'JOB', label: 'JOB', align: 'center' },
  { id: 'STATUS', label: 'STATUS', align: 'center' },
  { id: 'DATE', label: 'START/END', align: 'center', width: 300 },
];

// const STATUS_OPTIONS = [
//   { value: 'in_stock', label: 'In stock' },
//   { value: 'low_stock', label: 'Low stock' },
//   { value: 'out_of_stock', label: 'Out of stock' },
// ];

// ----------------------------------------------------------------------

RelatedOrderListPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function RelatedOrderListPage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    selected,
    setSelected,
    onSelectRow,
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

  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState('');

  const [filterStatus, setFilterStatus] = useState([]);

  const [openConfirm, setOpenConfirm] = useState(false);

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
  }, [dispatch]);

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

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleDeleteRow = (id) => {
    const deleteRow = tableData.filter((row) => row.NUMBER !== id);
    setSelected([]);
    setTableData(deleteRow);

    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
    }
  };

  const handleDeleteRows = (selectedRows) => {
    const deleteRows = tableData.filter((row) => !selectedRows.includes(row.NUMBER));
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
    push(PATH_DASHBOARD.salesorder.view(paramCase(id)));
  };

  const createPO = () => {};

  const startPO = () => {};

  const stopPO = () => {};

  return (
    <>
      <Head>
        <title> Ecommerce: Product List | Minimal UI</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'mg'}>
        <Stack spacing={1} direction={{ xs: 'column', sm: 'row' }}>
          <Tooltip title="Get Sync Orders" arrow placement="top">
            <Fab variant="outlined" size="small">
              <Iconify icon="prime:sync" width={20} height={20} />
            </Fab>
          </Tooltip>
          <Button
            variant="contained"
            color="info"
            startIcon={<Iconify icon="foundation:plus" />}
            onClick={createPO}
          >
            Create Purchase Order
          </Button>
          <Tooltip title="Start POs" arrow placement="top">
            <Fab size="small" color="success">
              <Iconify icon="codicon:debug-start" width={20} height={20} />
            </Fab>
          </Tooltip>
          <Tooltip title="Stop POs" arrow placement="top">
            <Fab size="small" color="success">
              <Iconify icon="lets-icons:stop-fill" width={20} height={20} />
            </Fab>
          </Tooltip>
          {/* <Button variant="contained" startIcon={<Iconify icon="codicon:debug-start" />} />
          <Iconify icon="lets-icons:stop-fill" /> */}
        </Stack>
        <Card>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            {/* <TableSelectedAction
              // dense={dense}
              // numSelected={selected.length}
              // rowCount={tableData.length}
              // onSelectAllRows={(checked) =>
              //   onSelectAllRows(
              //     checked,
              //     tableData.map((row) => row.id)
              //   )
              // }
              // action={
              //   <Tooltip title="Delete">
              //     <IconButton color="primary" onClick={handleOpenConfirm}>
              //       <Iconify icon="eva:trash-2-outline" />
              //     </IconButton>
              //   </Tooltip>
              // }
            /> */}

            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 1200 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  // onSelectAllRows={(checked) =>
                  //   onSelectAllRows(
                  //     checked,
                  //     tableData.map((row) => row.NUMBER)
                  //   )
                  // }
                />

                <TableBody>
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <RelatedOrderTableRow
                          key={row.NUMBER}
                          row={row}
                          selected={selected.includes(row.NUMBER)}
                          onSelectRow={() => onSelectRow(row.NUMBER)}
                          onDeleteRow={() => handleDeleteRow(row.NUMBER)}
                          onEditRow={() => handleEditRow(row.NUMBER)}
                          onViewRow={() => handleViewRow(row.NUMBER)}
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
