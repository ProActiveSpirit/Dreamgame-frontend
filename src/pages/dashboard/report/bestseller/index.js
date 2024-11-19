// @mui
import { DataGrid } from '@mui/x-data-grid';

// @mui
import { useTheme } from '@mui/material/styles';
import {  Container } from '@mui/material';
// layouts
import DashboardLayout from '../../../../layouts/dashboard';
// _mock_
// import { _analyticPost, _analyticOrderTimeline, _analyticTraffic } from '../../../../_mock/arrays';
// components
import { useSettingsContext } from '../../../../components/settings';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
// _mock_
import _mock from '../../../../_mock';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------

GeneralReportPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function GeneralReportPage() {
  // const theme = useTheme();

  const columns = [
    {
      field: 'NUMBER',
      headerName: 'NUMBER',
      width: 420,
    },
    {
      field: 'SKU',
      headerName: 'SKU', 
      width: 360,
      editable: true,
    },
    {
      field: 'SOLDCOUNT',
      headerName: 'SOLDCOUNT',
      width: 160,
      editable: true,
    },
    {
      field: 'CREATEDON',
      headerName: 'CREATED ON',
      width: 160,
      editable: true,
    }
  ];

  const _dataGrid = [...Array(36)].map((_, index) => ({
    id: _mock.id(index),
    NUMBER: _mock.id(index),
    SKU: _mock.id(index),
    SOLDCOUNT: _mock.number.age(index),
    CREATEDON: _mock.time(index)
  }));

  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
            heading="Reports"
            links={[
                { name: 'Dashboard', href: PATH_DASHBOARD.root },
                {
                name: 'Reports',
                href: PATH_DASHBOARD.report.bestseller,
                },
                { name: 'BestSeller' },
            ]}
        />
        <DataGrid columns={columns} rows={_dataGrid} checkboxSelection disableSelectionOnClick style={{height: 700}} />
      </Container>
    </>
  );
}
