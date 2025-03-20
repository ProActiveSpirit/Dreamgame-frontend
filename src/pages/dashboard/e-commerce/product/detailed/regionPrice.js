import { useState , useEffect } from 'react';
// @mui
import { DataGrid } from '@mui/x-data-grid';
import {  Container } from '@mui/material';
// layouts
import DashboardLayout from '../../../../../layouts/dashboard';
// _mock_
// import { _analyticPost, _analyticOrderTimeline, _analyticTraffic } from '../../../../_mock/arrays';
// components
import { useSettingsContext } from '../../../../../components/settings';
// _mock_
import _mock from '../../../../../_mock';

// ----------------------------------------------------------------------

RegionPrice.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function RegionPrice({price, SalesVat}) {
  // const theme = useTheme();

  const [exchangeRates, setExchangeRates] = useState({});
  const [loading, setLoading] = useState(true);

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

  const columns = [

    {
      field: 'Region',
      headerName: 'Region',
      width: 120,
    },
    {
      field: 'CostEUR',                
      headerName: 'Cost-EUR',
      width: 160,
      editable: true,
    },
    {
      field: 'CostExcVat',
      headerName: 'Cost Exc Vat',
      width: 160,
      editable: true,
    },
    {
      field: 'SalesVat',
      headerName: 'Sales Vat',
      width: 160,
      editable: true,
    },
    {
      field: 'SalesIncVat',
      headerName: 'Sales Inc Vat',
      width: 160,
      editable: true,
    },
    {
      field: 'SRPIncVat',
      headerName: 'SRP Inc Vat',
      width: 160,
      editable: true,
    }
  ];

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

  // Calculate DataGrid rows with exchange rates
  const calculateRows = () =>
    loading || !exchangeRates
      ? []
      : regions.map((region, index) => {
          // Use price if it exists and is not 0, otherwise default to 5
          const effectivePrice = (!price || price === 0) ? 5 : price;
          
          return {
            id: _mock.id(index),
            Region: region,
            CostEUR: `${(effectivePrice * (exchangeRates[currencies[region]] || 1)).toFixed(2)} ${currencies[region]}`,
            CostExcVat: `${(effectivePrice * (exchangeRates[currencies[region]] || 1)).toFixed(2)} ${currencies[region]}`,
            SalesVat: `${SalesVat} %`,
            SalesIncVat: `${(effectivePrice * (exchangeRates[currencies[region]] || 1)).toFixed(2)} ${currencies[region]}`,
            SRPIncVat: `${(effectivePrice * (exchangeRates[currencies[region]] || 1)).toFixed(2)} ${currencies[region]}`,
          };
        });

  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <DataGrid columns={columns} rows={calculateRows()} disableSelectionOnClick style={{height: 595}} />
      </Container>  
    </>
  );
}
