import { lazy } from 'react';

// project import
import MainLayout from 'layout/MainLayout';
import CommonLayout from 'layout/CommonLayout';
import Loadable from 'components/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

// pages routing
const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/404')));
const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/500')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('pages/maintenance/under-construction')));
const MaintenanceComingSoon = Loadable(lazy(() => import('pages/maintenance/coming-soon')));

//Render Applications
const AppInvoices = Loadable(lazy(() => import('pages/sales/invoice/list')));
const AppCreateInvoice = Loadable(lazy(() => import('pages/sales/invoice/create')));
const AppCustomers = Loadable(lazy(() => import('pages/sales/customer/list')));
const AppBills = Loadable(lazy(() => import('pages/purchase/bills/list')));
const AppCreateBill = Loadable(lazy(() => import('pages/purchase/bills/create')));
const AppVendors = Loadable(lazy(() => import('pages/purchase/vendors/list')));
const AppBills = Loadable(lazy(() => import('pages/purchase/bills/list')));
const AppCreateBill = Loadable(lazy(() => import('pages/purchase/bills/create')));
const AppVendors = Loadable(lazy(() => import('pages/purchase/vendors/VendorList')));
// const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));


// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: 'customers',
          element: <AppCustomers />
        }
      ]
    },
    {
      path: '/maintenance',
      element: <CommonLayout />,
      children: [
        {
          path: '404',
          element: <MaintenanceError />
        },
        {
          path: '500',
          element: <MaintenanceError500 />
        },
        {
          path: 'under-construction',
          element: <MaintenanceUnderConstruction />
        },
        {
          path: 'coming-soon',
          element: <MaintenanceComingSoon />
        }
      ]
    },
    {
      path: '/sales',
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: 'customers',
          element: <AppCustomers />,
          children: [
            {
              path: 'list',
              element: <AppCustomers />
            }
          ]
        },
        {
          path: 'invoices',
          children: [
            {
              path: 'list',
              element: <AppInvoices />
            },
            {
              path: 'create',
              element: <AppCreateInvoice />
            }
          ]
        },
        {
          path: 'payments',
          element: <MaintenanceComingSoon />,
          children: [
            {
              path: 'list',
              element: <MaintenanceComingSoon />
            },
            {
              path: 'receive',
              element: <MaintenanceComingSoon />
            }
          ]
        }
      ]
    },
    {
      path: '/purchase',
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: 'vendors',
          element: <AppVendors />,
          children: [
            {
              path: 'list',
              element: <AppVendors />
            }
          ]
        },
        {
          path: 'bills',
          children: [
            {
              path: 'list',
              element: <AppBills />
            },
            {
              path: 'create',
              element: <AppCreateBill />
            }
          ]
        },
        {
          path: 'payments',
          element: <MaintenanceComingSoon />,
          children: [
            {
              path: 'list',
              element: <MaintenanceComingSoon />
            },
            {
              path: 'make',
              element: <MaintenanceComingSoon />
            }
          ]
        }
      ]
    }
  ]
};

export default MainRoutes;
