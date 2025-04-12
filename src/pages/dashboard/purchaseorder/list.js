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
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { getPurchaseOrders, deletePurchaseOrder } from '../../../redux/slices/purchaseorder';
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

// sections
import { PurchaseOrderTableRow, PurchaseOrderTableToolbar } from '../../../sections/@dashboard/purchaseorder/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'PURCHASE ORDER NUMBER', align: 'center' },
  { id: 'product', label: 'PRODUCT', align: 'center'},
  { id: 'provider', label: 'PROVIDER', align: 'center' },
  { id: 'Region', label: 'REGION', align: 'center' },
  { id: 'CostIncVat', label: 'COST INC VAT', align: 'center' },
  { id: 'Stocking', label: 'STOCKING', align: 'center' },
  { id: 'TotalCostIncVat', label: 'Total COST INC VAT', align: 'center' },
  { id: 'job', label: 'JOB', align: 'center' },
  { id: 'status', label: 'STATUS', align: 'center' },
  { id: 'start/end', label: 'START/END', align: 'center' },
  { id: 'Action', label: 'ACTION', align: 'center' },
];

// ----------------------------------------------------------------------

PurchaseOrderListPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function PurchaseOrderListPage() {
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
    onSelectAllRows,
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

  const { allOrders, isLoading } = useSelector((state) => state.purchaseorder);

  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState('');

  const [filterStatus, setFilterStatus] = useState([]);

  const [openConfirm, setOpenConfirm] = useState(false);

  useEffect(() => {
    dispatch(getPurchaseOrders());
  }, [dispatch]);

  useEffect(() => {
    if (allOrders.length) {
      const extractedData = allOrders.map((orderData) => ({
        id: orderData.id,
        costIncVat: orderData.costIncVat,
        costExtVat: orderData.costExtVat,
        totalQuantity: orderData.totalQuantity,
        totalPrice: orderData.totalPrice,
        createdOn: orderData.createdOn,
        region: orderData.region,
        status: orderData.status,
        job: orderData.job,
        startDate: orderData.startDate,
        endDate:orderData.endDate, 
        processQuantity: orderData.processQuantity,
        product: orderData?.product?.name || 'Unknown Product',
        provider: orderData?.product?.provider || 'Unknown Product',
      }));
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

  const handleEditRow = (id) => {
    push(PATH_DASHBOARD.purchaseorder.view(paramCase(id)));
  };

  const handleViewRow = (id) => {
    push(PATH_DASHBOARD.purchaseorder.view(paramCase(id)));
  };

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

  const handleDeleteRow = (id) => {
    console.log("id:" , id);
    const deleteRow = tableData.filter((row) => row.id !== id);
    setSelected([]);
    setTableData(deleteRow);
    dispatch(deletePurchaseOrder(id));
    if (page > 0 && dataInPage.length < 2) {
      setPage(page - 1);
    }
  };

  const handleDeleteRows = (selectedRows) => {
    const deleteRows = tableData.filter((row) => !selectedRows.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);

    if (page > 0 && selectedRows.length === dataInPage.length) {
      setPage(page - 1);
    }
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterStatus([]);
  };

  return (
    <>
      <Head>
        <title> Purchase Order List</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Purchase Order List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Purchase Orders',
              href: PATH_DASHBOARD.purchaseorder.list,
            },
            { name: 'List' },
          ]}
          action={
            <Button
              component={NextLink}
              href={PATH_DASHBOARD.purchaseorder.add}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Add Purchase Order
            </Button>
          }
        />

        <Card>
          <PurchaseOrderTableToolbar
            filterName={filterName}
            onFilterName={handleFilterName}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
          />

          <TableContainer>
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
                        <PurchaseOrderTableRow
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
          />
        </Card>
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

function applyFilter({ inputData, comparator, filterName }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  return inputData.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(filterName.toLowerCase())
    )
  );
}