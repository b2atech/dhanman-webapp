import { lazy } from 'react';

// project import
import MainLayout from 'layout/MainLayout';
import CommonLayout from 'layout/CommonLayout';
import Loadable from 'components/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';
import ComingSoon from 'pages/maintenance/coming-soon';

// pages routing
const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/404')));
const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/500')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('pages/maintenance/under-construction')));
const MaintenanceComingSoon = Loadable(lazy(() => import('pages/maintenance/coming-soon')));

//Render Applications
const AppInvoices = Loadable(lazy(() => import('pages/sales/invoice/list')));
const AppCreateInvoice = Loadable(lazy(() => import('pages/sales/invoice/create')));
const AppInvoicedetails = Loadable(lazy(() => import('pages/sales/invoice/details')));
const AppReceivedPayment = Loadable(lazy(() => import('pages/sales/receivedpayments/list')));
const AppReceivePayment = Loadable(lazy(() => import('pages/sales/receivedpayments/add')));
const AppInvoiceEdit = Loadable(lazy(() => import('pages/sales/invoice/edit')));
const AppCustomers = Loadable(lazy(() => import('pages/sales/customer/list')));
const AppChartOfAccounts = Loadable(lazy(() => import('pages/company/chartOfAccounts/index')));
const AppCoaContainer = Loadable(lazy(() => import('pages/company/chartOfAccounts/coaContainer')));
const AppBills = Loadable(lazy(() => import('pages/purchase/bills/list')));
const AppCreateBill = Loadable(lazy(() => import('pages/purchase/bills/create')));
const AppBillEdit = Loadable(lazy(() => import('pages/purchase/bills/edit')));
const AppVendors = Loadable(lazy(() => import('pages/purchase/vendors/list')));
const AppPullRequests = Loadable(lazy(() => import('pages/dev/pr')));
const AppBilldetails = Loadable(lazy(() => import('pages/purchase/bills/details')));
const AppProducts = Loadable(lazy(() => import('pages/inventory/products/list')));
const AppAddProduct = Loadable(lazy(() => import('pages/inventory/products/addproduct')));
const AppPaidPayments = Loadable(lazy(() => import('pages/purchase/paidpayments/list')));
const AppAccountGroups = Loadable(lazy(() => import('pages/company/accountGroup/list')));
const AppMakePayment = Loadable(lazy(() => import('pages/purchase/paidpayments/add')));
const AppProjects = Loadable(lazy(() => import('pages/timesheet/projects/list')));
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
        },
        {
          path: 'accountgroup',
          element: <CommonLayout />,
          children: [
            {
              path: 'list',
              element: <AppAccountGroups />
            },
            {
              path: 'add',
              element: <ComingSoon />
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
              element: <AppReceivedPayment />
            },
            {
              path: 'add',
              element: <AppReceivePayment />
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
              path: 'edit/:id',
              element: <AppBillEdit />
            },
            {
              path: 'create',
              element: <AppCreateBill />
            }
          ]
        },
        {
          path: 'payments',
          children: [
            {
              path: 'list',
              element: <AppPaidPayments />
            },
            {
              path: 'add',
              element: <AppMakePayment />
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
          children: [
            {
              path: 'list',
              element: <AppProjects />
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
          children: [
            {
              path: 'list',
              element: <AppProducts />
            },
            {
              path: 'create',
              element: <AppAddProduct />
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
    },
    {
      path: '/reports/inventoryreports',
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: 'closingstock',
          element: <ComingSoon />
        }
      ]
    }
  ]
};

export default MainRoutes;
