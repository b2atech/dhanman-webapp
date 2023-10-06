import { lazy } from 'react';

// project import
import MainLayout from 'layout/MainLayout';
import CommonLayout from 'layout/CommonLayout';
import Loadable from 'components/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';
import StatusPage from 'pages/master/status';
import Vendors from 'pages/purchase/createbills/vendors';
import Createinvoice from 'pages/sales/createinvoice/createinvoice';
import Invoicedetails from 'pages/sales/createinvoice/invoicedetails';
import Invoicelist from 'pages/sales/createinvoice/invoicelist';
import Invoiceedit from 'pages/sales/createinvoice/invoiceedit';
import CreateBills from 'pages/purchase/createbills/createbills';
import BillsDetails from 'pages/purchase/createbills/billsdetails';
import BillsList from 'pages/purchase/createbills/billslist';
import EditBill from 'pages/purchase/createbills/editbill';
import AddVendor from 'pages/purchase/createbills/Vendor/addVendor';
import CustomerListPage from 'pages/sales/createinvoice/Customer/customers';

// pages routing
const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/404')));
const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/500')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('pages/maintenance/under-construction')));
const MaintenanceComingSoon = Loadable(lazy(() => import('pages/maintenance/coming-soon')));
const Customers = Loadable(lazy(() => import('pages/sales/createinvoice/Customer/customers')));

// render - sample page
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
          element: <Customers />
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
      path: '/invoice',
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: 'list',
          element: <Invoicelist />
        },
        {
          path: 'vendors',
          element: <Vendors />
        },
        {
          path: 'createinvoice',
          element: <Createinvoice />
        },
        {
          path: 'invoicedetails',
          element: <Invoicedetails />
        },
        {
          path: 'invoiceedit',
          element: <Invoiceedit />
        },
        {
          path: 'createbills',
          element: <CreateBills />
        },
        {
          path: 'billsdetails',
          element: <BillsDetails />
        },
        {
          path: 'billslist',
          element: <BillsList />
        },
        {
          path: 'editbill',
          element: <EditBill />
        },
        {
          path: 'status',
          element: <StatusPage />
        }
      ]
    },
    {
      path: '/master',
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: 'customers',
          element: <Customers />
        },
        {
          path: 'vendors',
          element: <Vendors />
        },
        {
          path: 'createinvoice',
          element: <Createinvoice />
        },
        {
          path: 'invoicedetails',
          element: <Invoicedetails />
        },
        {
          path: 'invoiceedit',
          element: <Invoiceedit />
        },
        {
          path: 'createbills',
          element: <CreateBills />
        },
        {
          path: 'billsdetails',
          element: <BillsDetails />
        },
        {
          path: 'billslist',
          element: <BillsList />
        },
        {
          path: 'editbill',
          element: <EditBill />
        },
        {
          path: 'addVendor',
          element: <AddVendor />
        },
        {
          path: 'newlist',
          element: <CustomerListPage />
        },
        {
          path: 'status',
          element: <StatusPage />
        }
      ]
    }
  ]
};

export default MainRoutes;
