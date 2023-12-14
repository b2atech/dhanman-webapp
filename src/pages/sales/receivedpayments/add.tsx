import { useEffect, useState, useMemo } from 'react';

// material-ui
import {
  Autocomplete,
  Button,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  TextareaAutosize,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';

// third-party
import * as Yup from 'yup';
import { useFormik, FormikValues } from 'formik';
import { Column, useTable, HeaderGroup, Cell, CellProps } from 'react-table';

// project imports
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { createReceivedPaymentRequest, getAllInvoices, getAllCustomers } from 'api/services/SalesService';
//import AlertreceivedPaymentDelete from './deleteAlert';
import MainCard from 'components/MainCard';
import { IInvoice } from 'types/invoice';

// constant
const getInitialValues = (receivedPayment: FormikValues | null) => {
  const newReceivedPayment = {
    customernames: '',
    companyId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    customerId: '',
    customerName: '',
    transactionId: '',
    coaId: '',
    description: '',
    amount: ''
  };

  return newReceivedPayment;
};

// ==============================|| Received Payment ADD / EDIT ||============================== //

export interface Props {
  receivedpayment?: any;
  onCancel: () => void;
}
const moment = require('moment');

const AddReceivedPayment = ({ receivedpayment, onCancel }: Props) => {
  const ReceivedPaymentSchema = Yup.object().shape({
    customerName: Yup.string().max(255).required('Please Enter customer Name'),
    amount: Yup.number().positive('Please Enter a positive unit price').required('Please Enter Price'),
    description: Yup.string().max(255).required('Please Enter Description')
  });

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    onCancel();
  };

  const formik = useFormik({
    initialValues: getInitialValues(receivedpayment!),
    validationSchema: ReceivedPaymentSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const receivedPaymentData = {
          companyId: values.companyId,
          customerId: values.customerId,
          customerName: values.customerName,
          transactionId: values.transactionId,
          coaId: values.coaId,
          description: values.description,
          amount: values.amount,
          paymentMode: paymentMode
        };
        if (receivedpayment) {
          dispatch(
            openSnackbar({
              open: true,
              message: 'Received Payment updated successfully.',
              anchorOrigin: { vertical: 'top', horizontal: 'right' },
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
          );
        } else {
          const response = await createReceivedPaymentRequest(receivedPaymentData);
          if (response === 200) {
            dispatch(
              openSnackbar({
                open: true,
                message: 'Received Payment added successfully.',
                anchorOrigin: { vertical: 'top', horizontal: 'right' },
                variant: 'alert',
                alert: {
                  color: 'success'
                },
                close: false
              })
            );
            window.location.reload();
          }
        }

        setSubmitting(false);
        onCancel();
      } catch (error) {
        console.error(error);
      }
    }
  });
  // const isCreating = !receivedpayment;
  const {
    errors,
    touched,
    //  handleSubmit,
    //isSubmitting,
    getFieldProps,
    handleChange
  } = formik;
  const [customernames, setCustomerNames] = useState<any>();
  const [paymentMode, setPaymentMode] = useState('');
  const [paymentThrough, setPaymentThrough] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState();
  const [invoices, setInvoices] = useState<IInvoice[]>();
  const [totalAmount, setTotalAmount] = useState<number>(0);
  //const placeholder

  useEffect(() => {
    getAllCustomers('3fa85f64-5717-4562-b3fc-2c963f66afa6')
      .then((customerList) => {
        if (Array.isArray(customerList)) {
          const customerData = customerList.map((customer) => ({
            id: customer.id,
            name: `${customer.firstName} ${customer.lastName}`
          }));
          setCustomerNames(customerData);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedCustomerId && selectedCustomerId !== '') {
      getAllInvoices('3fa85f64-5717-4562-b3fc-2c963f66afa6')
        .then((invoiceList) => {
          if (Array.isArray(invoiceList)) {
            var list = invoiceList.filter(
              (e) => e.customerId === selectedCustomerId && (e.invoiceStatus === 'Approved' || e.invoiceStatus === 'Partially Received')
            );
            setInvoices(list);
            const total = list.reduce((acc, current) => acc + current.amount, 0);
            setTotalAmount(total);
          } else {
            console.error('API response is not an array:', invoiceList);
          }
        })
        .catch((error) => {
          console.error('Error fetching invoice data:', error);
        });
    }
  }, [selectedCustomerId]);

  const columns = useMemo(
    () => [
      {
        Header: 'Invoice NO.',
        accessor: 'invoiceNumber',
        className: 'cell-center'
      },
      {
        Header: 'Invoice Date',
        accessor: 'invoiceDate',
        className: 'cell-center',
        Cell: (props: CellProps<{}, any>) => <>{moment(props.value).format('DD MMM YYYY')}</>
      },
      {
        Header: 'Due Date',
        accessor: 'dueDate',
        className: 'cell-center',
        Cell: (props: CellProps<{}, any>) => <>{moment(props.value).format('DD MMM YYYY')}</>
      },
      {
        Header: 'Status',
        className: 'cell-center',
        accessor: 'invoiceStatus',
        Cell: ({ value }: { value: string }) => {
          switch (value) {
            case 'Draft':
              return <Chip color="secondary" label="Draft" size="medium" variant="light" />;
            case 'Pending Approval':
              return <Chip color="default" label="Pending Approval" size="medium" variant="light" />;
            case 'Approved':
              return <Chip color="primary" label="Approved" size="medium" variant="light" />;
            case 'Partially Received':
              return <Chip color="info" label="Partially Received" size="medium" variant="light" />;
            case 'Received':
              return <Chip color="success" label="Received" size="medium" variant="light" />;
            case 'Rejected':
              return <Chip color="error" label="Rejected" size="medium" variant="light" />;
            case 'Cancelled':
            default:
              return <Chip color="warning" label="Cancelled" size="medium" variant="light" />;
          }
        }
      },
      {
        Header: 'Amount',
        accessor: 'amount',
        className: 'cell-right'
      }
    ],
    []
  );

  return (
    <>
      <MainCard>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid></Grid>
          <Grid item xs={6}>
            <MainCard>
              <Grid container spacing={1} direction="column">
                <Grid item xs={12}>
                  <InputLabel sx={{ mb: 1 }}>Customer Name</InputLabel>
                  <FormControl sx={{ width: '100%' }} error={Boolean(touched.customernames && errors.customernames)}>
                    {customernames && customernames.length > 0 ? (
                      <Autocomplete
                        id="controllable-states-demo"
                        options={(customernames || []) as any[]}
                        getOptionLabel={(option: any) => `${option.name}`}
                        onChange={(event, newValue) => {
                          if (newValue.id) {
                            setSelectedCustomerId(newValue.id);
                          }
                          handleChange({ target: { name: 'customerName', value: newValue ? newValue.name : '' } });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={Boolean(touched.customernames && errors.customernames)}
                            helperText={touched.customernames && errors.customernames ? errors.customernames : ''}
                          />
                        )}
                      />
                    ) : (
                      <Box display="flex" flexDirection="row" alignItems="left" justifyContent="left" height="100px">
                        <CircularProgress size={30} thickness={4} />
                        <Grid flexDirection={'column'}>
                          <Typography variant="body1" style={{ marginTop: '32x' }}>
                            Loading Customer Names,
                          </Typography>
                          <Typography variant="body1" style={{ marginTop: '32x' }}>
                            Please Wait...!
                          </Typography>
                        </Grid>
                      </Box>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <InputLabel sx={{ mb: 1 }}>Amount</InputLabel>
                  <TextField
                    sx={{ width: '100%' }}
                    id="totalAmount"
                    type="decimal"
                    placeholder={String(totalAmount)}
                    {...getFieldProps('totalAmount')}
                    helperText={`total payable amount : ${totalAmount}`}
                  />
                </Grid>
                <Grid item xs={12} sx={{ width: '100%' }}>
                  <Stack spacing={2}>
                    <InputLabel sx={{ mb: 1 }}>Payment Mode</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Payment Mode"
                      value={paymentMode}
                      onChange={(event) => setPaymentMode(event.target.value)}
                    >
                      <MenuItem value={10}>Cash</MenuItem>
                      <MenuItem value={20}>Cheque</MenuItem>
                      <MenuItem value={30}>NEFT</MenuItem>
                      <MenuItem value={40}>RTGS</MenuItem>
                      <MenuItem value={50}>UPI</MenuItem>
                    </Select>
                  </Stack>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
          <Grid item xs={6}>
            <MainCard>
              <Grid container direction="column" spacing={2}>
                <Grid item xs={12}>
                  <InputLabel sx={{ mb: 1 }}>Description</InputLabel>
                  <TextareaAutosize
                    id="description"
                    minRows={3}
                    maxRows={10}
                    placeholder="Enter Description"
                    style={{
                      width: '100%',
                      resize: 'vertical',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                      padding: '8px',
                      fontFamily: 'inherit'
                    }}
                  />
                </Grid>
                <Grid item xs={12} sx={{ width: '100%' }}>
                  <Stack spacing={2}>
                    <InputLabel sx={{ mb: 1 }}>Payment Through</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Payment Through"
                      value={paymentThrough}
                      onChange={(event) => setPaymentThrough(event.target.value)}
                    >
                      <MenuItem value={10}>Liability</MenuItem>
                      <MenuItem value={20}>Expense</MenuItem>
                      <MenuItem value={30}>Revenue</MenuItem>
                      <MenuItem value={40}>Asset</MenuItem>
                    </Select>
                  </Stack>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
          <Grid item xs={12}>
            <MainCard content={false} title="Invoices">
              <ReactTable columns={columns} data={invoices ?? []} striped={true} />
            </MainCard>
          </Grid>
          <Grid item xs={12}>
            <MainCard>
              <Grid container spacing={1} direction="row">
                <Grid item xs={8}></Grid>
                <Grid item xs={4}>
                  <Grid paddingTop={2}>
                    <Grid item xs={12}>
                      <Stack spacing={2} justifyContent="flex-end" alignItems="flex-end" textAlign="right">
                        <Stack direction="row" justifyContent="right" alignItems="right">
                          <Typography variant="subtitle1" sx={{ whiteSpace: 'nowrap' }}>
                            Grand Total :
                          </Typography>
                          <Typography variant="subtitle1" paddingLeft={5}>
                            {invoices?.reduce((acc, current) => acc + current.amount, 0)}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="flex-end" sx={{ mt: 8 }}>
                        <Button variant="outlined" color="secondary" onClick={handleAlertClose}>
                          Cancel
                        </Button>
                        <Button variant="contained" sx={{ whiteSpace: 'nowrap', textTransform: 'none' }}>
                          Pay Invoice's
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
        </Grid>
      </MainCard>
    </>
  );
};

export default AddReceivedPayment;

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data, striped }: { columns: Column[]; data: IInvoice[]; striped?: boolean }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data
  });

  return (
    <Table {...getTableProps()}>
      <TableHead>
        {headerGroups.map((headerGroup: HeaderGroup<{}>) => (
          <TableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column: HeaderGroup<{}>) => (
              <TableCell {...column.getHeaderProps([{ className: column.className }])}>{column.render('Header')}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody {...getTableBodyProps()} {...(striped && { className: 'striped' })}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <TableRow {...row.getRowProps()}>
              {row.cells.map((cell: Cell<{}>) => (
                <TableCell {...cell.getCellProps([{ className: cell.column.className }])}>{cell.render('Cell')}</TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
