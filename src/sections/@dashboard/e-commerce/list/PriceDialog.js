import { useState } from 'react';
// @mui
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';

// @mui
import { DataGrid } from '@mui/x-data-grid';
// components
import _mock from '../../../../_mock';

// ----------------------------------------------------------------------

export default function PriceDialog({row , onCloseDialog}) {

  const { name, price , provider } = row;

  const [open, setOpen] = useState(true);

  const [fullWidth, setFullWidth] = useState(true);

  const [maxWidth, setMaxWidth] = useState( provider === "Nexway" ? 'md' : 'xs');

  const columnsNexway = [
    {
      field: 'Region',
      headerName: 'Region',
      width: 150,
    },
    {
      field: 'CostEUR',
      headerName: 'Cost-EUR',
      width: 150,
      editable: true,
    },
    {
      field: 'CostExcVat',
      headerName: 'Cost Exc Vat',
      width: 150,
      editable: true,
    },
    {
      field: 'SalesExcVat',
      headerName: 'Sales Exc Vat',
      width: 150,
      editable: true,
    },
    {
      field: 'SRPIncVat',
      headerName: 'SRP Inc Vat',
      width: 150,
      editable: true,
    }
  ];

  const columns = [
    {
      field: 'Region',
      headerName: 'Region',
      width: 150,
    },
    {
      field: 'CostEUR',
      headerName: 'Cost-EUR',
      width: 150,
      editable: true,
    }
  ];

  const regions = ["NO","BE","DE","ES","FR","NL","PT","PL","GB"]

  const _dataGrid = [...Array(9)].map((_, index) => ({
    id: _mock.id(index),
    Region: regions[index],
    CostEUR: `${price+index}EUR`,
  }));

  const _dataGridNexway = [...Array(9)].map((_, index) => ({
    id: _mock.id(index),
    Region: regions[index],
    CostEUR: `${price+index}EUR`,
    CostExcVat: `${((price+index)/2).toFixed(2)}EUR`,
    SalesExcVat: `${((price+index)*3).toFixed(2)}EUR`,
    SRPIncVat: `${((price+index)*1.5).toFixed(2)}EUR`,
  }));

  const handleClose = () => {
    setOpen(false);
    onCloseDialog()
  };

  return (
    <>
      <Dialog open={open} maxWidth={maxWidth} onClose={handleClose} fullWidth={fullWidth}>
        <DialogTitle>{name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Product Price
          </DialogContentText>
          { provider === "Nexway" ? <DataGrid columns={columnsNexway} rows={_dataGridNexway} style={{height: 600}} />
            : <DataGrid columns={columns} rows={_dataGrid} style={{height: 600}} />
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
