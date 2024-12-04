// @mui
import { DataGrid } from '@mui/x-data-grid';

// @mui
import {  Container } from '@mui/material';
// layouts
import DashboardLayout from '../../../../../layouts/dashboard';
// _mock_
// import { _analyticPost, _analyticOrderTimeline, _analyticTraffic } from '../../../../_mock/arrays';
// components
import { useSettingsContext } from '../../../../../components/settings';
// _mock_
import _mock from '../../../../../_mock';
import price from "./price.json"

// ----------------------------------------------------------------------

GeneralReportPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function GeneralReportPage() {
  // const theme = useTheme();

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
      field: 'CostVat',
      headerName: 'Cost Vat',
      width: 160,
      editable: true,
    },
    {
      field: 'CostIncVat',
      headerName: 'Cost Inc Vat',
      width: 160,
      editable: true,
    },
    {
      field: 'SalesExcVat',
      headerName: 'Sales Exc Vat',
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

  const _dataGrid = [...Array(11)].map((_, index) => ({
    id: price[index].id,
    Region: price[index].Region,
    CostEUR: price[index].CostEUR,
    CostExcVat: price[index].CostExcVat,
    CostVat: price[index].CostVat,
    CostIncVat: price[index].CostIncVat,
    SalesExcVat: price[index].SalesExcVat,
    SalesVat: price[index].SalesVat,
    SalesIncVat: price[index].SalesIncVat,
    SRPIncVat:price[index].SRPIncVat
  }));

  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <DataGrid columns={columns} rows={_dataGrid} disableSelectionOnClick style={{height: 700}} />
      </Container>
    </>
  );
}
