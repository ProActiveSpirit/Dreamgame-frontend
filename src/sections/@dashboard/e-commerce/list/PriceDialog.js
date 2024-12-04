import { useState, useEffect } from 'react';
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

export default function PriceDialog({ row, onCloseDialog }) {
  const { name, price, provider } = row;

  const [open, setOpen] = useState(true);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState(provider === 'Nexway' ? 'md' : 'xs');

  const [exchangeRates, setExchangeRates] = useState({});
  const [loading, setLoading] = useState(true);

  const regions = ['NO', 'BE', 'DE', 'ES', 'FR', 'NL', 'PT', 'PL', 'GB'];
  const currencies = {
    NO: 'NOK',
    BE: 'EUR', // No conversion needed
    DE: 'EUR', // No conversion needed
    ES: 'EUR', // No conversion needed
    FR: 'EUR', // No conversion needed
    NL: 'EUR', // No conversion needed
    PT: 'EUR', // No conversion needed
    PL: 'PLN',
    GB: 'GBP',
  };

  // Fetch exchange rates
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch(
          'https://api.exchangerate-api.com/v4/latest/EUR'
        );
        const data = await response.json();
        setExchangeRates(data.rates);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
        setLoading(false);
      }
    };

    fetchExchangeRates();
  }, []);

  const columnsNexway = [
    {
      field: 'Region',
      headerName: 'Region',
      width: 150,
    },
    {
      field: 'CostExcVat',
      headerName: 'Cost Exc Vat',
      width: 150,
      editable: true,
    },
    {
      field: 'CostEUR',
      headerName: 'Cost-EUR',
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
    },
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
    },
  ];

  // Calculate DataGrid rows with exchange rates
  const calculateRows = () =>
    loading || !exchangeRates
      ? []
      : regions.map((region, index) => ({
          id: _mock.id(index),
          Region: region,
          CostEUR: `${(price * (exchangeRates[currencies[region]] || 1)).toFixed(
            2
          )} ${currencies[region]}`,
        }));

  const calculateRowsNexway = () =>
    loading || !exchangeRates
      ? []
      : regions.map((region, index) => {
          const localCurrency = currencies[region];
          const exchangeRate = exchangeRates[localCurrency] || 1; // Default to 1 if no conversion needed
          const localPrice = (price * exchangeRate).toFixed(2);

          return {
            id: _mock.id(index),
            Region: region,
            CostEUR: `${(localPrice * 1.2).toFixed(2)} ${localCurrency}`,
            CostExcVat: `${localPrice} ${localCurrency}`,
            SalesExcVat: `${(localPrice * 1.5).toFixed(2)} ${localCurrency}`,
            SRPIncVat: `${(localPrice * 1.8).toFixed(2)} ${localCurrency}`,
          };
        });

  const handleClose = () => {
    setOpen(false);
    onCloseDialog();
  };

  return (
    <>
      <Dialog open={open} maxWidth={maxWidth} onClose={handleClose} fullWidth={fullWidth}>
        <DialogTitle>{name}</DialogTitle>
        <DialogContent>
          <DialogContentText>Product Price</DialogContentText>
          {loading && <p>Loading exchange rates...</p>}
          {!loading && (
            provider === 'Nexway' ? (
              <DataGrid
                columns={columnsNexway}
                rows={calculateRowsNexway()}
                style={{ height: 600 }}
              />
            ) : (
              <DataGrid
                columns={columns}
                rows={calculateRows()}
                style={{ height: 600 }}
              />
            )
          )}
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