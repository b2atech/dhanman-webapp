import { useEffect, useState } from 'react';

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
import { getAllCountries } from 'api/services/CommonService';
import { getAllCities } from 'api/services/CommonService';
import { getAllStates } from 'api/services/CommonService';
import { ICountry, ICity, IState } from 'types/address';

// project imports
import AlertCustomerDelete from './AlertCustomerDelete';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { createCustomerRequest } from 'api/services/SalesService';

// types
import { ThemeMode } from 'types/config';

// constant
const getInitialValues = (customer: FormikValues | null) => {
  const newCustomer = {
    userId: '0f6dd08e-cfe7-498b-9fed-167d759b1a3b',
    clientId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    cityName: '',
    cityId: '',
    country: '',
    state: '',
    addressLine: ''
  };

  return newCustomer;
};

// ==============================|| CUSTOMER ADD / EDIT ||============================== //

export interface Props {
  customer?: any;
  onCancel: () => void;
}

const AddCustomer = ({ customer, onCancel }: Props) => {
  const [countries, setCountries] = useState<ICountry[]>();
  const [states, setStates] = useState<IState[]>();
  const [cities, setCities] = useState<ICity[]>();
  const [selectedCountryId, setSelectedCountryId] = useState('');
  const [selectedStateId, setSelectedStateId] = useState('');
  const [selectedCityId, setselectedCityId] = useState('');

  useEffect(() => {
    getAllCountries()
      .then((CountryList) => {
        if (Array.isArray(CountryList)) {
          setCountries(CountryList);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    setSelectedCountryId('');
    setSelectedStateId('');
    setselectedCityId('');
  }, [customer, onCancel]);

  useEffect(() => {
    getAllStates(selectedCountryId)
      .then((StateList) => {
        if (Array.isArray(StateList)) {
          setStates(StateList);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [selectedCountryId]);

  useEffect(() => {
    getAllCities(selectedStateId)
      .then((CityList) => {
        if (Array.isArray(CityList)) {
          setCities(CityList);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [selectedStateId]);

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
    cityName: Yup.string().max(255).required('Please Select City Name'),
    country: Yup.string().max(255).required('Please Select Country Name'),
    state: Yup.string().max(255).required('Please Select State Name'),
    addressLine: Yup.string().max(255).required('Please Enter Address')
  });

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    onCancel();
  };

  const formik = useFormik({
    initialValues: getInitialValues(customer!),
    validationSchema: CustomerSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const customerData = {
          userId: values.userId,
          clientId: values.clientId,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          cityId: values.cityId,
          phoneNumber: values.phoneNumber,
          city: values.cityName,
          addressLine: values.addressLine
        };
        if (customer) {
          dispatch(
            openSnackbar({
              open: true,
              message: 'Customer updated successfully.',
              anchorOrigin: { vertical: 'top', horizontal: 'right' },
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
          );
        } else {
          const response = await createCustomerRequest(customerData);
          if (response === 200) {
            dispatch(
              openSnackbar({
                open: true,
                message: 'Customer added successfully.',
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

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

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
                          helperText={touched.firstName && errors.firstName ? 'Please Enter First Name' : ''}
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
                          helperText={touched.lastName && errors.lastName ? 'Please Enter Last Name' : ''}
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
                        <InputLabel htmlFor="customer-country">Select Country</InputLabel>
                        <Autocomplete
                          fullWidth
                          autoHighlight
                          id="country"
                          options={countries || []}
                          getOptionLabel={(option) => option.name}
                          value={countries?.find((country) => country.id === selectedCountryId)}
                          onChange={(event, newValue) => {
                            if (newValue) {
                              setSelectedCountryId(newValue.id);
                              formik.setFieldValue('country', newValue.name);
                            } else {
                              setSelectedCountryId('');
                              formik.setFieldValue('country', '');
                            }
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Enter Country Name"
                              {...getFieldProps('country')}
                              error={Boolean(touched.country && errors.country)}
                              helperText={touched.country && errors.country ? 'Please Select Country Name' : ''}
                            />
                          )}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-state">Select State</InputLabel>
                        <Autocomplete
                          fullWidth
                          autoHighlight
                          id="customer-state"
                          options={states || []}
                          getOptionLabel={(option) => option.name}
                          value={states?.find((state) => state.id === selectedStateId)}
                          onChange={(event, newValue) => {
                            if (newValue) {
                              setSelectedStateId(newValue.id);
                              formik.setFieldValue('state', newValue.name);
                            } else {
                              setSelectedStateId('');
                              formik.setFieldValue('state', '');
                            }
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Enter state Name"
                              error={Boolean(touched.state && errors.state)}
                              helperText={touched.state && errors.state ? 'Please Select State Name' : ''}
                            />
                          )}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-cityName">Select City</InputLabel>
                        <Autocomplete
                          fullWidth
                          autoHighlight
                          id="customer-cityName"
                          options={cities || []}
                          getOptionLabel={(option) => `${option.name}     (${option.postalCode})`}
                          value={cities?.find((cities) => cities.id === selectedCityId)}
                          onChange={(event, newValue) => {
                            if (newValue) {
                              setselectedCityId(newValue.id);
                              formik.setFieldValue('cityName', newValue.name);
                              formik.setFieldValue('cityId', newValue.id);
                            } else {
                              setselectedCityId('');
                              formik.setFieldValue('cityName', '');
                              formik.setFieldValue('cityId', '');
                            }
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              id="customer-cityName"
                              placeholder="Enter City Name"
                              error={Boolean(touched.cityName && errors.cityName)}
                              helperText={touched.cityName && errors.cityName ? 'Please Select City Name' : ''}
                            />
                          )}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-address">Address</InputLabel>
                        <TextField
                          autoFocus
                          fullWidth
                          id="addressLine"
                          type="text"
                          placeholder="Enter Address"
                          {...getFieldProps('addressLine')}
                          error={Boolean(touched.addressLine && errors.addressLine)}
                          helperText={touched.addressLine && errors.addressLine ? 'Please Enter Address' : ''}
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
