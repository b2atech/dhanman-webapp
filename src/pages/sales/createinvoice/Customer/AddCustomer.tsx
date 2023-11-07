/* eslint-disable prettier/prettier */
import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  InputLabel,
  Stack,
  TextField,
  Autocomplete
} from '@mui/material';
import { UserAddOutlined, CloseOutlined } from '@ant-design/icons';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import IconButton from 'components/@extended/IconButton';

// third-party
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider, FormikValues } from 'formik';

// project imports
import AlertCustomerDelete from './AlertCustomerDelete';

import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

// types
import { ThemeMode } from 'types/config';

// constant
const getInitialValues = (customer: FormikValues | null) => {
  if (customer) {
    const newCustomer = {
      id: customer.id,
      clientId: '',
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      city: customer.city
    };

    return newCustomer;
  } else {
    const newCustomer = {
      id: '',
      clientId: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      city: ''
    };

    return newCustomer;
  }
};

// ==============================|| CUSTOMER ADD / EDIT ||============================== //

export interface Props {
  customer?: any;
  onCancel: () => void;
}

const AddCustomer = ({ customer, onCancel }: Props) => {
  const theme = useTheme();
  const isCreating = !customer;

  const CustomerSchema = Yup.object().shape({
    firstName: Yup.string().max(255).required('Please Enter First Name'),
    lastName: Yup.string().max(255).required('Please Enter Last Name'),
    phoneNumber: Yup.string()
      .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
      .required('Please Enter Phone Number'),
    email: Yup.string()
      .max(255)
      .required('Please Enter E-mail Address')
      .matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 'E-Mail Address Is Not Valid'),
    city: Yup.string().max(255).required('Please Enter City Name')
  });

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    onCancel();
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValues(customer!),
    validationSchema: CustomerSchema,
    onSubmit: (values, { setSubmitting }) => {
      try {
        if (customer) {
          dispatch(
            openSnackbar({
              open: true,
              message: 'Customer updated successfully.',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
          );
        } else {
          dispatch(
            openSnackbar({
              open: true,
              message: 'Customer added successfully.',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
          );
        }

        setSubmitting(false);
        onCancel();
      } catch (error) {
        console.error(error);
      }
    }
  });

  const { values, setFieldValue, errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Philadelphia'];

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <DialogTitle>{customer ? 'Edit Customer' : 'New Customer'}</DialogTitle>
              <IconButton shape="rounded" color="error" onClick={onCancel} style={{ marginRight: '5px' }}>
                <CloseOutlined />
              </IconButton>
            </Stack>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
                    <UserAddOutlined style={{ fontSize: '80px' }}>
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          backgroundColor: theme.palette.mode === ThemeMode.DARK ? 'rgba(255, 255, 255, .75)' : 'rgba(0,0,0,.65)',
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      ></Box>
                    </UserAddOutlined>
                    <TextField type="file" id="change-avtar" placeholder="Outlined" variant="outlined" sx={{ display: 'none' }} />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-name">First Name</InputLabel>
                        <TextField
                          autoFocus
                          fullWidth
                          id="firstName"
                          type="text"
                          placeholder="Enter First Name"
                          {...getFieldProps('firstName')}
                          error={Boolean(touched.firstName && errors.firstName)}
                          helperText={touched.firstName && errors.firstName ? (errors.firstName as React.ReactNode) : ''}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-lastName">Last Name</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-lastName"
                          type="text"
                          placeholder="Enter Last Name"
                          {...getFieldProps('lastName')}
                          error={Boolean(touched.lastName && errors.lastName)}
                          helperText={touched.lastName && errors.lastName ? (errors.lastName as React.ReactNode) : ''}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-phoneNumber">Phone Number</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-phoneNumber"
                          placeholder="Enter Phone Number"
                          {...getFieldProps('phoneNumber')}
                          error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                          helperText={touched.phoneNumber && errors.phoneNumber ? (errors.phoneNumber as React.ReactNode) : ''}
                          inputProps={{
                            inputMode: 'numeric',
                            pattern: '[0-9]*',
                            maxLength: 10,
                            onInput: (e) => {
                              e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                              if (e.currentTarget.value.length > 10) {
                                e.currentTarget.value = e.currentTarget.value.slice(0, 10);
                              }
                            }
                          }}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-email">E-mail</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-email"
                          type="email"
                          placeholder="Enter Email"
                          {...getFieldProps('email')}
                          error={Boolean(touched.email && errors.email)}
                          helperText={touched.email && errors.email ? (errors.email as React.ReactNode) : ''}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-city">City</InputLabel>
                        <Autocomplete
                          fullWidth
                          autoHighlight
                          options={cities}
                          value={values.city}
                          onChange={(event, newValue) => setFieldValue('city', newValue)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              id="customer-city"
                              placeholder="Enter City Name"
                              error={Boolean(touched.city && errors.city)}
                              helperText={touched.city && errors.city ? (errors.city as React.ReactNode) : ''}
                            />
                          )}
                        />
                      </Stack>
                    </Grid>
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
                      {customer ? 'Edit' : 'Add'}
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
      {!isCreating && <AlertCustomerDelete title={customer.fatherName} open={openAlert} handleClose={handleAlertClose} id={customer.Id} />}
    </>
  );
};

export default AddCustomer;
