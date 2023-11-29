import { useState } from 'react';

// material-ui
import { Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, InputLabel, Stack, TextField } from '@mui/material';
import { CloseOutlined } from '@ant-design/icons';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import IconButton from 'components/@extended/IconButton';

// third-party
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider, FormikValues } from 'formik';

// project imports
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { createPaidPaymentRequest } from 'api/services/BillService';
import AlertpaidPaymentDelete from './deleteAlert';

// types

// constant
const getInitialValues = (paidPayment: FormikValues | null) => {
  const newPaidPayment = {
    clientId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    vendorId: '',
    vendorName: '',
    transactionId: '',
    coaId: '',
    description: '',
    amount: ''
  };

  return newPaidPayment;
};

// ==============================|| CUSTOMER ADD / EDIT ||============================== //

export interface Props {
  paidpayment?: any;
  onCancel: () => void;
}

const AddPaidPayment = ({ paidpayment, onCancel }: Props) => {
  const PaidPaymentSchema = Yup.object().shape({
    vendorName: Yup.string().max(255).required('Please Enter vendor Name'),
    amount: Yup.number().positive('Please Enter a positive unit price').required('Please Enter Price'),
    description: Yup.string().max(255).required('Please Enter Address')
  });

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    onCancel();
  };

  const formik = useFormik({
    initialValues: getInitialValues(paidpayment!),
    validationSchema: PaidPaymentSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const piadPaymentData = {
          clientId: values.clientId,
          vendorId: values.vendorId,
          vendorName: values.vendorName,
          transactionId: values.transactionId,
          coaId: values.coaId,
          description: values.description,
          amount: values.amount
        };
        if (paidpayment) {
          dispatch(
            openSnackbar({
              open: true,
              message: 'Paid Payment updated successfully.',
              anchorOrigin: { vertical: 'top', horizontal: 'right' },
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
          );
        } else {
          const response = await createPaidPaymentRequest(piadPaymentData);
          if (response === 200) {
            dispatch(
              openSnackbar({
                open: true,
                message: 'Paid Payment added successfully.',
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
  const isCreating = !paidpayment;
  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <DialogTitle>{paidpayment ? 'Add Customer' : 'New Customer'}</DialogTitle>
              <IconButton shape="rounded" color="error" onClick={onCancel} style={{ marginRight: '5px' }}>
                <CloseOutlined />
              </IconButton>
            </Stack>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid item xs={12} md={8}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="vendor-name">Vendor Name </InputLabel>
                      <TextField
                        autoFocus
                        fullWidth
                        id="vendorName"
                        type="text"
                        placeholder="Enter Vendor Name"
                        {...getFieldProps('vendorName')}
                        error={Boolean(touched.vendorName && errors.vendorName)}
                        helperText={touched.vendorName && errors.vendorName ? 'Please Enter First Name' : ''}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="amount">Amount</InputLabel>
                      <TextField
                        fullWidth
                        id="amount"
                        type="decimal"
                        placeholder="Enter Amount"
                        {...getFieldProps('amount')}
                        error={Boolean(touched.amount && errors.amount)}
                        helperText={touched.amount && errors.amount ? (errors.amount as React.ReactNode) : ''}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="description">Description</InputLabel>
                      <TextField
                        autoFocus
                        fullWidth
                        id="description"
                        type="text"
                        placeholder="Enter Description"
                        {...getFieldProps('description')}
                        error={Boolean(touched.description && errors.description)}
                        helperText={touched.description && errors.description ? 'Please Enter Address' : ''}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
              <Grid container justifyContent="flex-end" alignItems={'end'}>
                <Grid item>
                  <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                      {paidpayment ? 'Edit' : 'Add'}
                    </Button>
                    <Button variant="contained" color="error" onClick={onCancel}>
                      Cancel
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
      {!isCreating && (
        <AlertpaidPaymentDelete title={paidpayment.vendorName} open={openAlert} handleClose={handleAlertClose} id={paidpayment.Id} />
      )}
    </>
  );
};

export default AddPaidPayment;
