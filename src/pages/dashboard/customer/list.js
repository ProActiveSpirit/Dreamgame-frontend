import { paramCase } from 'change-case';
import { useState, useEffect } from 'react';
import Head from 'next/head';
// import NextLink from 'next/link';
import { useRouter } from 'next/router';
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
import { useSelector, useDispatch } from 'react-redux'; // Import Redux hooks
import { getCustomers } from '../../../redux/slices/user';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
import DashboardLayout from '../../../layouts/dashboard';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import ConfirmDialog from '../../../components/confirm-dialog';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../../components/table';
import { CustomerTableRow } from '../../../sections/@dashboard/customer/list';

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'center' },
  { id: 'email', label: 'Email', align: 'center' },
  { id: 'website', label: 'Website', align: 'center' },
  { id: 'ip', label: 'IP Address', align: 'center' },
  { id: 'region', label: 'Region', align: 'center' },
];

UserListPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default function UserListPage() {
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
  } = useTable();

  const { themeStretch } = useSettingsContext();
  const { push } = useRouter();

  const dispatch = useDispatch();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [filterName] = useState('');
  const [filterRole] = useState('all');
  const [filterStatus] = useState('all');

  const { customers } = useSelector((state) => state.user); // Fetch products from Redux

  useEffect(() => {
    dispatch(getCustomers());
  }, [dispatch]);

  const dataFiltered = applyFilter({
    inputData: customers,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
    filterStatus,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleDeleteRow = (id) => {
    const deleteRow = customers.filter((row) => row.id !== id);
    setSelected([]);
    // Consider dispatching an action to update the user list in the store
  };

  const handleDeleteRows = (selectedRows) => {
    const deleteRows = customers.filter((row) => !selectedRows.includes(row.id));
    setSelected([]);
    // Consider dispatching an action to update the user list in the store
  };

  const handleEditRow = (id) => {
    push(PATH_DASHBOARD.customer.edit(paramCase(id)));
  };

  return (
    <>
      <Head>
        <title> User: List | Minimal UI</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'mg'}>
        <CustomBreadcrumbs
          heading="Customer List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Customer', href: PATH_DASHBOARD.customer.list },
            { name: 'List' },
          ]}
          action={
            <Button
              href={PATH_DASHBOARD.customer.add}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Customer
            </Button>
          }
        />

        <Card>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={customers.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  customers.map((row) => row.id)
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
              <Table size="small" sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={customers.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      customers.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <CustomerTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.name)}
                      />
                    ))}

                  <TableEmptyRows
                    height={52}
                    emptyRows={emptyRows(page, rowsPerPage, customers.length)}
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

// Utility function for filtering
function applyFilter({ inputData, comparator, filterName, filterStatus, filterRole }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter((user) =>
      user.name.toLowerCase().includes(filterName.toLowerCase())
    );
  }

  if (filterStatus !== 'all') {
    inputData = inputData.filter((user) => user.status === filterStatus);
  }

  if (filterRole !== 'all') {
    inputData = inputData.filter((user) => user.role === filterRole);
  }

  return inputData;
}
