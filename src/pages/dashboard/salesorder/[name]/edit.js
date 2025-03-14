import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
// next
import { useRouter } from 'next/router';
// @mui
import { Tab, Card, Tabs, Container, Box } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { getSalesOrders } from '../../../../redux/slices/salesorder';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// layouts
import DashboardLayout from '../../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../../components/settings';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
// sections
import OrderInformation from '../detailed/orderInformation';
import BillingInformation from '../detailed/billingInformation';
import PurchaseOrder from '../detailed/purchaseOrder';
import RelatedOrder from '../detailed/relatedOrder';
import ActivationKeys from '../detailed/ActivationKeys';
import Packages from '../detailed/packages';

// import SaleOrders from '../order.json';
// ----------------------------------------------------------------------

SalesOrderEditPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function SalesOrderEditPage() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();

  const tabs = ["Order Information", "Billing Information", "PO Templates", "Related Purchase Orders", "Activation Keys", "Packages"]

  const [currentTab, setCurrentTab] = useState("PO Templates");
  const [generatedPOs, setGeneratedPOs] = useState([]);

  const {
    query: { name },
  } = useRouter();

  const currentOrder = useSelector((state) =>
    state.salesorder.allOrders.find((order) => order.id === name)
  );

  const changeTab = (value) => {
    setCurrentTab(value);
  }

  useEffect(() => {
    dispatch(getSalesOrders());
  }, [dispatch]);

  const TABS = [
    {
      value: 'Order Information',
      label: 'Order Information',
      component: <OrderInformation variant='outlined'/>,
    },
    {
      value: 'Billing Information',
      label: 'Billing Information',
      component: <BillingInformation />,
    },
    {
      value: 'PO Templates',
      label: 'PO Templates',
      component: (
        <PurchaseOrder 
          changeTab={changeTab} 
          setGeneratedPOs={setGeneratedPOs}
        />
      ),
    },
    {
      value: 'Related Purchase Orders',
      label: 'Related Purchase Orders',
      component: (
        <RelatedOrder generatedPOs={generatedPOs} />
      ),
    },
    {
      value: 'Activation Keys',
      label: 'Activation Keys',
      component: (
        <ActivationKeys />
      ),
    },
    {
      value: 'Packages',
      label: 'Packages',
      component: (
        <Packages />
      ),
    }
  ];

  return (
    <>
      <Container maxWidth={themeStretch ? 'lg' : false}>
        <CustomBreadcrumbs
          heading="Edit Sales Order"
          links={[  
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Sales Order',
              href: PATH_DASHBOARD.salesorder.list,
            },
            { name: currentOrder?.id },
          ]}
        />
        <Card
          sx={{
            mb: 3,
            height: 50,
            position: 'relative',
          }}
        >
          <Tabs
            value={currentTab}
            onChange={(event, newValue) => setCurrentTab(newValue)}
            sx={{
              width: 1,
              zIndex: 9,
              position: 'absolute',
              bgcolor: 'background.paper',
              '& .MuiTabs-flexContainer': {
                pl: { md: 3 },
                justifyContent: {
                  sm: 'center',
                  md: 'flex-start',
                },
              },
            }}
          >
            {TABS.map((tab) => (
              <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
            ))}
          </Tabs>
        </Card>

        {TABS.map(
          (tab) => tab.value === currentTab && <Box key={tab.value}> {tab.component} </Box>
        )}
      </Container>
    </>
  );
}
