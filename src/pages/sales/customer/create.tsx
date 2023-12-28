// material-ui
import { Autocomplete, Button, Grid, InputLabel, Stack, TextField } from '@mui/material';

// project imports
import MainCard from 'components/MainCard';

// assets
import { useEffect, useState } from 'react';

// third-party
import * as Yup from 'yup';
import { useFormik, FormikValues, Form, FormikProvider } from 'formik';
import { getAllCountries } from 'api/services/CommonService';
import { getAllCities } from 'api/services/CommonService';
import { getAllStates } from 'api/services/CommonService';
import { ICountry, ICity, IState } from 'types/address';

// project imports
import AlertCustomerDelete from './AlertCustomerDelete';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { createCustomerRequest, updateCustomerRequest } from 'api/services/SalesService';
import config from 'config';
// constant
const getInitialValues = (customer: FormikValues | null) => {
  if (customer) {
    const newCustomer = {
      id: customer.id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      phoneNumber: customer.phoneNumber,
      email: customer.email,
      cityName: customer.cityName,
      cityId: customer.cityId,
      country: customer.countryId,
      state: customer.stateId,
      addressLine: customer.addressLine,
      gstIn: customer.gstIn
    };
    return newCustomer;
  } else {
    const newCustomer = {
      id: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      cityName: '',
      cityId: '',
      country: '',
      state: '',
      addressLine: '',
      gstIn: ''
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
  const [countries, setCountries] = useState<ICountry[]>();
  const [states, setStates] = useState<IState[]>();
  const [cities, setCities] = useState<ICity[]>();
  const [selectedCountryId, setSelectedCountryId] = useState('');
  const [selectedStateId, setSelectedStateId] = useState('');
  const [selectedCityId, setselectedCityId] = useState('');
  const companyId: string = String(config.companyId);

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

  const isCreating = !customer;

  const CustomerSchema = Yup.object().shape({
    firstName: Yup.string().max(255).required('Please Enter First Name'),
    lastName: Yup.string().max(255).required('Please Enter Last Name'),
    gstIn: Yup.string().max(15).required('Please Enter GST number Name'),
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

  const inputProps = {
    style: { borderRadius: 8 }
  };

  const handleCancel = () => {
    // Go back to the previous page
    window.history.back();
  };

  const formik = useFormik({
    initialValues: getInitialValues(customer!),
    enableReinitialize: true,
    validationSchema: CustomerSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const customerData = {
          userId: companyId,
          companyId: companyId,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          cityId: values.cityId,
          phoneNumber: values.phoneNumber,
          city: values.cityName,
          addressLine: values.addressLine,
          gstIn: values.gstIn
        };
        if (customer) {
          const response = await updateCustomerRequest(customerData);
          if (response === 204) {
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
            window.location.reload();
          }
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
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <MainCard title={customer ? 'Edit Customer' : 'New Customer'}>
              <Grid container direction="column" spacing={2} alignItems="left">
                <Grid container item xs={6} spacing={2}>
                  <Grid item xs={3}>
                    <Stack spacing={0.1}>
                      <InputLabel htmlFor="customer-name">First Name</InputLabel>
                      <TextField
                        fullWidth
                        id="firstName"
                        type="text"
                        placeholder="Enter Full Name"
                        {...getFieldProps('firstName')}
                        error={Boolean(touched.firstName && errors.firstName)}
                        helperText={touched.firstName && errors.firstName ? 'Please enter your First Name' : ''}
                        InputProps={inputProps}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={3}>
                    <Stack spacing={0.1}>
                      <InputLabel htmlFor="customer-lastName">Last Name</InputLabel>
                      <TextField
                        fullWidth
                        id="customer-lastName"
                        type="text"
                        placeholder="Enter Last Name"
                        {...getFieldProps('lastName')}
                        error={Boolean(touched.lastName && errors.lastName)}
                        helperText={touched.lastName && errors.lastName ? 'Please Enter Last Name' : ''}
                        InputProps={inputProps}
                      />
                    </Stack>
                  </Grid>
                </Grid>
                <Grid container item xs={6} spacing={2}>
                  <Grid item xs={3}>
                    <Stack spacing={0.1}>
                      <InputLabel htmlFor="customer-phoneNumber">Phone Number</InputLabel>
                      <TextField
                        fullWidth
                        id="customer-phoneNumber"
                        placeholder="Enter Phone Number"
                        InputProps={inputProps}
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
                  <Grid item xs={3}>
                    <Stack spacing={0.1}>
                      <InputLabel htmlFor="customer-email">E-mail</InputLabel>
                      <TextField
                        fullWidth
                        id="customer-email"
                        type="email"
                        placeholder="Enter Email"
                        InputProps={inputProps}
                        {...getFieldProps('email')}
                        error={Boolean(touched.email && errors.email)}
                        helperText={touched.email && errors.email ? (errors.email as React.ReactNode) : ''}
                      />
                    </Stack>
                  </Grid>
                </Grid>
                <Grid item xs={3}>
                  <Stack spacing={0.1}>
                    <InputLabel htmlFor="customer-gstIn">GST No.</InputLabel>
                    <TextField
                      fullWidth
                      id="gstIn"
                      type="text"
                      placeholder="Enter GST Number"
                      {...getFieldProps('gstIn')}
                      error={Boolean(touched.gstIn && errors.gstIn)}
                      helperText={touched.gstIn && errors.gstIn ? 'Please enter gst number ' : ''}
                      style={{ width: '24%' }}
                      InputProps={inputProps}
                    />
                  </Stack>
                </Grid>

                <Grid container item xs={9} spacing={2}>
                  <Grid item xs={2}>
                    <Stack spacing={0.1}>
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
                            style={{ borderRadius: 80 }}
                            {...getFieldProps('country')}
                            error={Boolean(touched.country && errors.country)}
                            helperText={touched.country && errors.country ? 'Please Select Country Name' : ''}
                          />
                        )}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={2}>
                    <Stack spacing={0.1}>
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
                  <Grid item xs={2}>
                    <Stack spacing={0.1}>
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
                </Grid>
                <Grid item xs={3}>
                  <Stack spacing={0.1}>
                    <InputLabel htmlFor="customer-address">Address</InputLabel>
                    <TextField
                      fullWidth
                      id="addressLine"
                      type="text"
                      placeholder="Enter Address"
                      {...getFieldProps('addressLine')}
                      error={Boolean(touched.addressLine && errors.addressLine)}
                      helperText={touched.addressLine && errors.addressLine ? 'Please Enter Address' : ''}
                      style={{ width: '24%' }}
                      variant="outlined"
                      InputProps={inputProps}
                      //className={classes.roundedTextField}
                    />
                  </Stack>
                </Grid>

                <Grid container direction="column" spacing={2} alignItems="left">
                  <Grid item xs={3}>
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                      <Button type="submit" variant="contained" disabled={isSubmitting}>
                        {customer ? 'Edit' : 'Add'}
                      </Button>
                      <Button variant="contained" color="error" onClick={handleCancel}>
                        Cancel
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
            </MainCard>
          </Form>
        </FormikProvider>
        {!isCreating && (
          <AlertCustomerDelete title={customer.fatherName} open={openAlert} handleClose={handleAlertClose} id={customer.Id} />
        )}
      </Grid>
    </Grid>
  );
};
export default AddCustomer;
