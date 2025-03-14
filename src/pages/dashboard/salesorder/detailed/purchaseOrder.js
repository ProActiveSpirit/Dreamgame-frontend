import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
// next
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
// form
import { DateTimePicker } from '@mui/x-date-pickers';
// @mui
import {
  Button,
  Autocomplete,
  TextField,
  Stack,
  InputAdornment,
  Container,
  Typography,
  Divider,
} from '@mui/material';
import { Masonry } from '@mui/lab';
import ConfirmDialog from '../../../../components/confirm-dialog';
import Iconify from '../../../../components/iconify';

// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { saveRelatedPurchaseOrder } from '../../../../redux/slices/salesorder';

// _mock_
import _mock from '../../../../_mock';

export default function BillingInformation({ changeTab, variant, setGeneratedPOs }) {
  const [selectedRegions, setSelectedRegions] = useState([top100Films[1]]);
  const [exchangeRates, setExchangeRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [openConfirm, setOpenConfirm] = useState(false);

  const {
    query: { name },
  } = useRouter();

  const dispatch = useDispatch();

  const currentOrder = useSelector((state) =>
    state.salesorder.allOrders.find((order) => order.id === name)
  );

  const currencies = {
    NO: 'NOK',
    BE: 'EUR',
    DE: 'EUR',
    ES: 'EUR',
    FR: 'EUR',
    NL: 'EUR',
    PT: 'EUR',
    PL: 'PLN',
    GB: 'GBP',
  };

  const [rows, setRows] = useState([]);
  const [totals, setTotals] = useState({ totalQuantity: 0, totalCostIncVat: 0 }); // State for totals

  // Calculate initial rows when component mounts or when dependencies change
  const generateEmpty = () => {
    if (!loading && exchangeRates) {
      const initialRows = selectedRegions.map((region, index) => {
        const quantity = currentOrder?.totalQuantity 
          ? Math.floor(currentOrder.totalQuantity / selectedRegions.length) 
          : 0;
        const costIncVat = parseFloat(
          (currentOrder?.salesExtVat ?? 0 * (exchangeRates[currencies[region.title]] || 1)).toFixed(2)
        );
        return {
          id: currentOrder.id,
          Region: region.title,
          Product: currentOrder?.product?.name,
          ProductId: currentOrder?.product?.id,
          CostIncVat: costIncVat,
          CostCurrency: currencies[region.title],
          Quantity: quantity,
          TotalCostIncVat: (quantity * costIncVat).toFixed(2),
        };
      });

      setRows(initialRows);
      calculateTotals(initialRows);
    }
  };

  const generateAutoCalculate = () => {
    if (!loading && exchangeRates) {
      const eachQuantity = currentOrder?.totalQuantity 
        ? Math.floor(currentOrder.totalQuantity / selectedRegions.length)
        : 0;

      const initialRows = selectedRegions.map((region, index) => {
        const costIncVat = parseFloat(
          (currentOrder?.salesExtVat ?? 0 * (exchangeRates[currencies[region.title]] || 1)).toFixed(2)
        );
        const quantity = index === 0
          ? (currentOrder?.totalQuantity ?? 0) - eachQuantity * (selectedRegions.length - 1)
          : eachQuantity;
        
        return {
          id: currentOrder.id,
          Region: region.title,
          Product: currentOrder?.product?.name,
          ProductId: currentOrder?.product?.id,
          CostIncVat: costIncVat,
          CostCurrency: currencies[region.title],
          Quantity: quantity,
          TotalCostIncVat: (quantity * costIncVat).toFixed(2),
        };
      });

      setRows(initialRows);
      calculateTotals(initialRows);
    }
  };

  const saveChange = () => {
    console.log('rows : ', rows);
    const data = {
      id: currentOrder.id,
      purchase: rows,
    };
    dispatch(saveRelatedPurchaseOrder(data));
  };

  // Function to recalculate totals (total quantity and total cost inc vat)
  const calculateTotals = (updatedRows) => {
    const totalQuantity = updatedRows.reduce((sum, row) => sum + row.Quantity, 0);
    const totalCostIncVat = updatedRows.reduce(
      (sum, row) => sum + parseFloat(row.TotalCostIncVat || 0),
      0
    );
    setTotals({ totalQuantity, totalCostIncVat });
  };

  // Handler to update Quantity and TotalCostIncVat
  const handleQuantityChange = (id, value) => {
    const newQuantity = parseFloat(value) || 0; // Convert input to number, default to 0 if invalid
    let updatedRows;
    if ((currentOrder?.totalQuantity ?? 0) - totals.totalQuantity - newQuantity < 0) {
      updatedRows = rows.map((row) =>
        row.id === id
          ? {
              ...row,
              Quantity: (currentOrder?.totalQuantity ?? 0) - totals.totalQuantity,
              TotalCostIncVat: (
                ((currentOrder?.totalQuantity ?? 0) - totals.totalQuantity) *
                row.CostIncVat
              ).toFixed(2), // Recalculate total
            }
          : row
      );
    } else {
      updatedRows = rows.map((row) =>
        row.id === id
          ? {
              ...row,
              Quantity: newQuantity,
              TotalCostIncVat: (newQuantity * row.CostIncVat).toFixed(2), // Recalculate total
            }
          : row
      );
    }
    setRows(updatedRows); // Update rows in state
    calculateTotals(updatedRows); // Recalculate totals after updating rows
  };

  // Columns definition
  const columns = [
    { field: 'Region', headerName: 'Region', width: 150 },
    { field: 'Product', headerName: 'Product', width: 350 },
    {
      field: 'CostIncVat',
      headerName: 'Cost (Inc. VAT)',
      width: 150,
      valueGetter: (params) => `${params.row.CostIncVat} ${params.row.CostCurrency}`,
    },
    {
      field: 'Quantity',
      headerName: 'Quantity (%)',
      width: 150,
      renderCell: (params) => (
        <TextField
          variant="outlined"
          size="small"
          type="number"
          value={params.row.Quantity}
          onChange={(e) => handleQuantityChange(params.row.id, e.target.value)}
        />
      ),
    },
    {
      field: 'TotalCostIncVat',
      headerName: 'Total Cost (Inc. VAT)',
      width: 200,
      valueGetter: (params) => `${params.row.TotalCostIncVat} ${params.row.CostCurrency}`,
    },
  ];

  // Function to handle setting all regions
  const handleAddAllRegions = () => {
    setSelectedRegions(top100Films); // Set all options as selected
  };

  // Fetch exchange rates
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
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

  const generatePO = () =>   {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const onAction = () => {
    // Transform rows data to match RelatedOrder format
    const transformedRows = rows.map((row) => ({
      NUMBER: row.id,
      PRODUCT: row.Product,
      PROVIDER: 'Dreamgame',
      REGION: row.Region,
      INCVAT: `${row.CostIncVat} ${row.CostCurrency}`,
      QUANTITY: row.Quantity,
      STOCKING: 'Pending',
      TOTALINCVAT: `${row.TotalCostIncVat} ${row.CostCurrency}`,
      JOB: 'false',
      STATUS: 'Processing',
      DATE: `${currentOrder.startDate}\n${currentOrder.endDate}`,
    }));

    setGeneratedPOs(transformedRows);
    setOpenConfirm(false);
    changeTab('Related Purchase Orders');
  };

  return (
    <>
      <Container maxWidth="md">
        <Masonry columns={{ xs: 1 }} spacing={2}>
          <TextField
            variant={variant}
            required
            fullWidth
            value={currentOrder?.totalQuantity ?? ''}
            label="Quantity"
            // defaultValue={currentOrder?.totalQuantity}
          />

          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
            <TextField
              variant="outlined"
              fullWidth
              value={currentOrder?.salesIncVat ?? ''}
              // defaultValue={currentOrder?.totalQuantity}
              // onChange={handleChange('weight')}
              label="Sales"
              // helperText="Weight"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">{currentOrder?.salesCurrency}</InputAdornment>
                ),
              }}
            />
            <TextField
              variant="outlined"
              fullWidth
              value={currentOrder?.expectedCost ?? ''}
              // onChange={handleChange('weight')}
              label="Expected Cost"
              // helperText="Weight"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">{currentOrder?.salesCurrency}</InputAdornment>
                ),
              }}
            />
          </Stack>
          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
            <DateTimePicker
              renderInput={(props) => <TextField {...props} fullWidth />}
              label="Start Date"
              value={currentOrder?.startDate}
              // onChange={setValue}
            />
            <DateTimePicker
              renderInput={(props) => <TextField {...props} fullWidth />}
              label="End Date"
              value={currentOrder?.endDate}
              // onChange={setValue}
            />
          </Stack>

          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
            <Autocomplete
              multiple
              fullWidth
              options={top100Films}
              getOptionLabel={(option) => option.title}
              value={selectedRegions} // Bind the selected regions to the value prop
              onChange={(event, newValue) => setSelectedRegions(newValue)} // Update the state on change
              filterSelectedOptions
              renderInput={(params) => (
                <TextField {...params} label="Template Regions" placeholder="Country Code" />
              )}
            />
            <button
              type="button" // Set explicit button type
              onClick={handleAddAllRegions}
              style={{
                width: '100px',
                color: 'green',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '16px', // Increase font size
              }}
            >
              (+) add all
            </button>
          </Stack>
          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
            <Button
              variant="contained"
              color="warning"
              size="large"
              startIcon={<Iconify icon="eva:save-fill" />}
              onClick={generateAutoCalculate}
            >
              Save & Generate Auto-Calculated
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="eva:save-fill" />}
              onClick={generateEmpty}
            >
              Save & Generate Empty
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<Iconify icon="eos-icons:arrow-rotate" />}
              onClick={generatePO}
            >
              Generate POs from the template
            </Button>
          </Stack>
        </Masonry>
      </Container>

      <Typography variant="h6" gutterBottom>
        Purchase Order Template
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Button
        variant="contained"
        color="info"
        size="large"
        startIcon={<Iconify icon="eva:save-fill" />}
        onClick={saveChange}
      >
        Save & changes
      </Button>

      <DataGrid columns={columns} rows={rows} disableSelectionOnClick autoHeight hideFooter />

      {/* Summary Section */}
      <Stack spacing={10} sx={{ mt: 3 }} direction={{ xs: 'column', md: 'row' }}>
        <Stack direction="row" justifyContent="flex-end">
          <Typography>Average Cost :</Typography>
          <Typography sx={{ textAlign: 'right', width: 120 }}>
            {totals.totalQuantity > 0
              ? (totals.totalCostIncVat / totals.totalQuantity).toFixed(2)
              : '-'}
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="flex-end">
          <Typography>Quantity :</Typography>
          <Typography sx={{ textAlign: 'right', width: 120 }}>
            {totals.totalQuantity !== currentOrder?.totalQuantity
              ? `${(currentOrder?.totalQuantity ?? 0) - totals.totalQuantity} / ${
                  currentOrder?.totalQuantity
                } (-${totals.totalQuantity})`
              : `${totals.totalQuantity} / ${totals.totalQuantity}`}
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="flex-end">
          <Typography variant="h6">Total Cost Inc Vat :</Typography>
          <Typography variant="h6" sx={{ textAlign: 'right', width: 120 }}>
            {totals.totalCostIncVat.toFixed(2)} {/* Display total cost */}
          </Typography>
        </Stack>
      </Stack>
      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Confirm"
        content="Are you sure to generate POs from the template?"
        action={
          <Button variant="contained" color="error" onClick={() => onAction()}>
            Generate
          </Button>
        }
      />
    </>
  );
}

BillingInformation.propTypes = {
  variant: PropTypes.string.isRequired,
};

// ----------------------------------------------------------------------

export const top100Films = [
  { title: 'BE', year: 1994 },
  { title: 'DE', year: 1972 },
  { title: 'ES', year: 1974 },
  { title: 'FR', year: 2008 },
  { title: 'NL', year: 1957 },
  { title: 'PT', year: 1993 },
  { title: 'PL', year: 1994 },
  { title: 'NO', year: 2003 },
  { title: 'GB', year: 1966 },
];
