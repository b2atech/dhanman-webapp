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
const AppInvoicedetails = Loadable(lazy(() => import('pages/sales/invoice/details')));
const AppPaymentRecieved = Loadable(lazy(() => import('pages/sales/paymentsreceived/list')));
const AppInvoiceEdit = Loadable(lazy(() => import('pages/sales/invoice/edit')));
const AppCustomers = Loadable(lazy(() => import('pages/sales/customer/list')));
const AppChartOfAccounts = Loadable(lazy(() => import('pages/company/chartOfAccounts/index')));
const AppCoaContainer = Loadable(lazy(() => import('pages/company/chartOfAccounts/coaContainer')));
const AppBills = Loadable(lazy(() => import('pages/purchase/bills/list')));
const AppCreateBill = Loadable(lazy(() => import('pages/purchase/bills/create')));
const AppVendors = Loadable(lazy(() => import('pages/purchase/vendors/list')));
const AppPullRequests = Loadable(lazy(() => import('pages/dev/pr')));
const AppBilldetails = Loadable(lazy(() => import('pages/purchase/bills/details')));
const AppProducts = Loadable(lazy(() => import('pages/inventory/products/list')));
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
      path: '/company',
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: 'coa',
          element: <CommonLayout />,
          children: [
            {
              path: 'list',
              element: <AppChartOfAccounts />
            },
            {
              path: 'coaContainer',
              element: <AppCoaContainer />
            }
          ]
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
            },
            {
              path: 'details/:id',
              element: <AppInvoicedetails />
            },
            {
              path: 'edit/:id',
              element: <AppInvoiceEdit />
            }
          ]
        },
        {
          path: 'payments',
          children: [
            {
              path: 'list',
              element: <AppPaymentRecieved />
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
              path: 'details/:id',
              element: <AppBilldetails />
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
    },
    {
      path: '/timesheet',
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: 'projects',
          element: <MaintenanceComingSoon />,
          children: [
            {
              path: 'list',
              element: <MaintenanceComingSoon />
            },
            {
              path: 'create',
              element: <MaintenanceComingSoon />
            }
          ]
        },
        {
          path: 'tasks',
          element: <MaintenanceComingSoon />,
          children: [
            {
              path: 'list',
              element: <MaintenanceComingSoon />
            },
            {
              path: 'create',
              element: <MaintenanceComingSoon />
            }
          ]
        },
        {
          path: 'logtime',
          element: <MaintenanceComingSoon />
        }
      ]
    },
    {
      path: '/inventory',
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: 'products',
          element: <AppProducts />,
          children: [
            {
              path: 'list',
              element: <AppProducts />
            },
            {
              path: 'create',
              element: <MaintenanceComingSoon />
            }
          ]
        },
        {
          path: 'orders',
          element: <MaintenanceComingSoon />,
          children: [
            {
              path: 'list',
              element: <MaintenanceComingSoon />
            },
            {
              path: 'create',
              element: <MaintenanceComingSoon />
            }
          ]
        }
      ]
    },
    {
      path: '/dev',
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: 'pr',
          element: <AppPullRequests />
        }
      ]
    }
  ]
};

export default MainRoutes;
