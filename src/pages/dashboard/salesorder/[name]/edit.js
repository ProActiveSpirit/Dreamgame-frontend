import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
// next
import { useRouter } from 'next/router';
// @mui
import { Tab, Card, Tabs, Container, Box } from '@mui/material';
// redux
import { useDispatch, useSelector } from 'src/redux/store';
import { getProducts } from 'src/redux/slices/product';
// routes
import { PATH_DASHBOARD } from 'src/routes/paths';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// sections
import {
  OrderInformation,
  BillingInformation,
  PurchaseOrder,
  RelatedOrder,
  ActivationKeys,
  Packages
} from '../detailed';
//_mock
import {
  _userAbout,
  _userFeeds,
  _userFriends,
  _userGallery,
  _userFollowers,
} from 'src/_mock/arrays';
import SaleOrders from '../order.json';
// ----------------------------------------------------------------------

SalesOrderEditPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function SalesOrderEditPage() {
  const { themeStretch } = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('Order Information');

  const dispatch = useDispatch();


  const {
    query: { name },
  } = useRouter();

  const currentProduct = SaleOrders.find((order) => paramCase(order.NUMBER) === name);

  // useEffect(() => {
  //   dispatch(getProducts());
  // }, [dispatch]);
  const TABS = [
    {
      value: 'Order Information',
      label: 'Order Information',
      component: <OrderInformation />,
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
        <PurchaseOrder />
      ),
    },
    {
      value: 'Related Purchase Orders',
      label: 'Related Purchase Orders',
      component: (
        <RelatedOrder />
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
            { name: currentProduct?.NUMBER },
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