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
import { useSnackbar } from '../../../../components/snackbar';

// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { saveRelatedPurchaseOrder, updateSalesOrder } from '../../../../redux/slices/salesorder';

export default function BillingInformation({ changeTab, variant, setGeneratedPOs }) {
  const { enqueueSnackbar } = useSnackbar();
  const [selectedRegions, setSelectedRegions] = useState([top100Films[1]]);
  const [exchangeRates, setExchangeRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));
  const [formData, setFormData] = useState({
    quantity: '',
    sales: '',
    expectedCost: '',
  });
  
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
  const [totals, setTotals] = useState({ totalQuantity: 0, totalCostIncVat: 0 });

  const generateEmpty = () => {
    if (!loading && exchangeRates) {
      console.log('selectedRegions : ', selectedRegions);

      const initialRows = selectedRegions.map((region, index) => {
        const costIncVat = parseFloat(
          (currentOrder?.salesExtVat ?? 0 * (exchangeRates[currencies[region.title]] || 1)).toFixed(2)
        );
        return {
          id: index,
          Region: region.title,
          Product: currentOrder?.product?.name,
          ProductId: currentOrder?.product?.id,
          CostIncVat: costIncVat,
          CostCurrency: currencies[region.title],
          Quantity: 0,
          TotalCostIncVat: (0 * costIncVat).toFixed(2),
        };
      });
      console.log('initialRows : ', initialRows);
      setRows(initialRows);
    }
  };

  const generateAutoCalculate = () => {
    if (!loading && exchangeRates) {
      console.log('selectedRegions : ', selectedRegions);
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
          id: index,
          Region: region.title,
          Product: currentOrder?.product?.name,
          ProductId: currentOrder?.product?.id,
          CostIncVat: costIncVat,
          CostCurrency: currencies[region.title],
          Quantity: quantity,
          TotalCostIncVat: (quantity * costIncVat).toFixed(2),
        };
      });
      console.log('initialRows : ', initialRows);
      setRows(initialRows);
      calculateTotals(initialRows);
    }
  };

  const handleInputChange = (field) => (event) => {
    const { value } = event.target;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Validate numeric fields
      const quantity = parseFloat(formData.quantity);
      const sales = parseFloat(formData.sales);
      const expectedCost = parseFloat(formData.expectedCost);

      if (Number.isNaN(quantity) || quantity <= 0) {
        enqueueSnackbar('Quantity must be greater than zero', { variant: 'error' });
        return;
      }

      if (Number.isNaN(sales) || sales <= 0) {
        enqueueSnackbar('Sales must be greater than zero', { variant: 'error' });
        return;
      }

      if (Number.isNaN(expectedCost) || expectedCost <= 0) {
        enqueueSnackbar('Expected Cost must be greater than zero', { variant: 'error' });
        return;
      }

      // Validate dates
      if (!startDate || !endDate) {
        enqueueSnackbar('Start Date and End Date are required', { variant: 'error' });
        return;
      }

      if (endDate <= startDate) {
        enqueueSnackbar('End Date must be after Start Date', { variant: 'error' });
        return;
      }

      // Validate regions
      if (!selectedRegions || selectedRegions.length === 0) {
        enqueueSnackbar('At least one region must be selected', { variant: 'error' });
        return;
      }

      const saveData = {
        id: currentOrder.id,
        totalQuantity: quantity,
        salesIncVat: sales,
        expectedCost,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        regions: selectedRegions.map(region => region.title),
        purchase: rows,
      };

      await dispatch(updateSalesOrder(saveData));
      enqueueSnackbar('Purchase order updated successfully', { variant: 'success' });
    } catch (error) {
      console.error('Error saving purchase order:', error);
      enqueueSnackbar('Failed to update purchase order', { variant: 'error' });
    }
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

  const handleQuantityChange = (id, value) => {
    const newQuantity = parseFloat(value) || 0;
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
              ).toFixed(2),
            }
          : row
      );
    } else {
      updatedRows = rows.map((row) =>
        row.id === id
          ? {
              ...row,
              Quantity: newQuantity,
              TotalCostIncVat: (newQuantity * row.CostIncVat).toFixed(2),
            }
          : row
      );
    }
    setRows(updatedRows);
    calculateTotals(updatedRows); 
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
      headerName: 'Quantity',
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

  useEffect(() => {
    if (currentOrder) {
      setFormData({
        quantity: currentOrder?.totalQuantity ?? '',
        sales: currentOrder?.salesIncVat ?? '',
        expectedCost: currentOrder?.expectedCost ?? '',
      });
      setStartDate(new Date(currentOrder?.startDate) || new Date());
      setEndDate(new Date(currentOrder?.endDate) || new Date(new Date().setDate(new Date().getDate() + 1)));
    }
  }, [currentOrder]);

  const generatePO = () =>   {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const onAction = () => {
    const transformedRows = rows.map((row) => ({
      NUMBER: name,
      PRODUCT: row.Product,
      PROVIDER: 'Dreamgame',
      REGION: row.Region,
      INCVAT: `${row.CostIncVat} ${row.CostCurrency}`,
      QUANTITY: row.Quantity,
      STOCKING: 'Pending',
      TOTALINCVAT: `${row.TotalCostIncVat} ${row.CostCurrency}`,
      JOB: 'false',
      STATUS: 'Processing',
      DATE: `${startDate ? startDate.toLocaleDateString() : ''} - ${endDate ? endDate.toLocaleDateString() : ''}`,
    }));
    saveRelatedPurchaseOrder(currentOrder.id, rows);
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
            value={formData.quantity}
            onChange={handleInputChange('quantity')}
            label="Quantity"
            type="number"
          />

          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
            <TextField
              variant="outlined"
              fullWidth
              value={formData.sales}
              onChange={handleInputChange('sales')}
              label="Sales"
              type="number"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">{currentOrder?.salesCurrency}</InputAdornment>
                ),
              }}
            />
            <TextField
              variant="outlined"
              fullWidth
              value={formData.expectedCost}
              onChange={handleInputChange('expectedCost')}
              label="Expected Cost"
              type="number"
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
              value={startDate}
              onChange={(newValue) => {
                setStartDate(newValue);
              }}
            />
            <DateTimePicker
              renderInput={(props) => <TextField {...props} fullWidth />}
              label="End Date"
              value={endDate}
              onChange={(newValue) => {
                setEndDate(newValue);
              }}
            />
          </Stack>

          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
            <Autocomplete
              multiple
              fullWidth
              options={top100Films}
              getOptionLabel={(option) => option.title}
              value={selectedRegions}
              onChange={(event, newValue) => setSelectedRegions(newValue)}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField {...params} label="Template Regions" placeholder="Country Code" />
              )}
            />
            <button
              type="button"
              onClick={handleAddAllRegions}
              style={{
                width: '100px',
                color: 'green',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '16px',
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
        onClick={handleSave}
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
