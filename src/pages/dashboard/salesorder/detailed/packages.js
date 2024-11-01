import PropTypes from 'prop-types';
// @mui
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
// components
import Iconify from 'src/components/iconify';
// _mock_
import _mock, { randomInArray } from 'src/_mock';

// ----------------------------------------------------------------------

DataGridBasic.propTypes = {
  data: PropTypes.array,
};

export default function DataGridBasic() {
  const columns = [
    {
      field: 'NUMBER',
      headerName: 'PACKAGE NUMBER',
      width: 220,
    },
    {
      field: 'CUSTOMER',
      headerName: 'CUSTOMER',
      width: 160,
      editable: true,
    },
    {
      field: 'EMAIL',
      headerName: 'EMAIL',
      width: 160,
      editable: true,
    },
    {
      field: 'PRODUCT',
      headerName: 'PRODUCT',
      width: 160,
      editable: true,
    }
  ];

  const _dataGrid = [...Array(36)].map((_, index) => ({
    id: _mock.id(index),
    NUMBER: "",
    CUSTOMER: "",
    email: "",
    PRODUCT: "",
  }));

  return <DataGrid columns={columns} rows={_dataGrid} checkboxSelection disableSelectionOnClick style={{height: 120}} />;
}
