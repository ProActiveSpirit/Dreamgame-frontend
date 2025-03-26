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

export default function RegionPrice({product}) {
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

  const currencies = {
    no: 'NOK',
    be: 'EUR',
    de: 'EUR',
    es: 'EUR',
    fr: 'EUR',
    it: 'EUR',
    nl: 'EUR',
    pt: 'EUR',
    pl: 'PLN',
    gb: 'GBP',
    en: 'GBP',
  };

  const calculateRows = () => {
    if (loading || !exchangeRates) return [];

    // Split the region string into an array
    const regions = product?.region?.split(',') || [];
    
    return regions.map((region, index) => {
      const effectivePrice = (!product?.price || product?.price === 0) ? 5 : product?.price;
      return {
        id: _mock.id(index),
        Region: region.toUpperCase(),
        CostEUR: `${(effectivePrice * (exchangeRates[currencies[region]] || 1)).toFixed(2)} ${currencies[region]}`,
        CostExcVat: `${(effectivePrice * (exchangeRates[currencies[region]] || 1)).toFixed(2)} ${currencies[region]}`,
        SalesVat: `${product?.SalesVat ? product?.SalesVat : 0} %`,
        SalesIncVat: `${(effectivePrice * (exchangeRates[currencies[region]] || 1)).toFixed(2)} ${currencies[region]}`,
        SRPIncVat: `${(effectivePrice * (exchangeRates[currencies[region]] || 1)).toFixed(2)} ${currencies[region]}`,
      };
    });
  };

  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <DataGrid 
          columns={columns} 
          rows={calculateRows()} 
          disableSelectionOnClick 
          autoHeight 
          pagination={false}
        />
      </Container>  
    </>
  );
}
