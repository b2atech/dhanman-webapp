import { useEffect, useState } from 'react';

// material-ui
import {
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
import { CloseOutlined } from '@ant-design/icons';
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

import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

// types
import AlertVendorDelete from './AlertVendorDelete';
import { createVendorRequest, updateVendorRequest } from 'api/services/BillService';
import config from 'config';
// constant
const companyId: string = String(config.companyId);
const getInitialValues = (vendor: FormikValues | null) => {
  if (vendor) {
    return {
      userId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      companyId: companyId,
      firstName: vendor.firstName,
      lastName: vendor.lastName,
      phoneNumber: vendor.phoneNumber,
      email: vendor.email,
      country: vendor.country,
      state: vendor.state,
      cityName: vendor.cityName,
      cityId: vendor.cityId,
      addressLine: vendor.addressLine,
      id: vendor.id,
      gstIn: vendor.gstIn
    };
  } else {
    return {
      userId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      clientId: companyId,
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      country: '',
      state: '',
      cityName: '',
      cityId: '',
      addressLine: '',
      id: '',
      gstIn: ''
    };
  }
};

// ==============================|| VENDOR ADD / EDIT ||============================== //

export interface Props {
  vendor?: any;
  onCancel: () => void;
}

const AddVendor = ({ vendor, onCancel }: Props) => {
  const [countries, setCountries] = useState<ICountry[]>();
  const [states, setStates] = useState<IState[]>();
  const [cities, setCities] = useState<ICity[]>();
  const [selectedCountryId, setSelectedCountryId] = useState('');
  const [selectedStateId, setSelectedStateId] = useState('');
  const [selectedCityId, setselectedCityId] = useState('');

  useEffect(() => {
    setSelectedCountryId('');
    setSelectedStateId('');
    setselectedCityId('');
  }, [vendor, onCancel]);

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

  const isCreating = !vendor;

  const VendorSchema = Yup.object().shape({
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

  const formik = useFormik({
    initialValues: getInitialValues(vendor!),
    enableReinitialize: true,
    validationSchema: VendorSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const vendorData = {
          vendorId: values.id,
          userId: values.userId,
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

        if (vendor) {
          const response = await updateVendorRequest(vendorData);
          if (response === 204) {
            dispatch(
              openSnackbar({
                open: true,
                message: 'Vendor updated successfully.',
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
          const response = await createVendorRequest(vendorData);
          if (response === 200) {
            dispatch(
              openSnackbar({
                open: true,
                message: 'Vendor added successfully.',
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
              <DialogTitle>{vendor ? 'Edit Vendor' : 'New Vendor'}</DialogTitle>
              <IconButton shape="rounded" type="reset" color="error" onClick={onCancel} style={{ marginRight: '5px' }}>
                <CloseOutlined />
              </IconButton>
            </Stack>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid item xs={12} md={8}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="vendor-name">First Name</InputLabel>
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
                  <Grid item xs={6}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="vendor-lastName">Last Name</InputLabel>
                      <TextField
                        fullWidth
                        id="vendor-lastName"
                        type="text"
                        placeholder="Enter Last Name"
                        {...getFieldProps('lastName')}
                        error={Boolean(touched.lastName && errors.lastName)}
                        helperText={touched.lastName && errors.lastName ? 'Please Enter Last Name' : ''}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="vendor-phoneNumber">Phone Number</InputLabel>
                      <TextField
                        fullWidth
                        id="vendor-phoneNumber"
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
                  <Grid item xs={6}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="vendor-gstIn">GST No.</InputLabel>
                      <TextField
                        autoFocus
                        fullWidth
                        id="gstIn"
                        type="text"
                        placeholder="Enter gst number"
                        {...getFieldProps('gstIn')}
                        error={Boolean(touched.gstIn && errors.gstIn)}
                        helperText={touched.gstIn && errors.gstIn ? 'Please Enter gst number ' : ''}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="vendor-email">E-mail</InputLabel>
                      <TextField
                        fullWidth
                        id="vendor-email"
                        type="email"
                        placeholder="Enter Email"
                        {...getFieldProps('email')}
                        error={Boolean(touched.email && errors.email)}
                        helperText={touched.email && errors.email ? 'Please Enter Valid E-mail Address' : ''}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="vendor-country">Select Country</InputLabel>
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
                  <Grid item xs={6}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="vendor-state">Select State</InputLabel>
                      <Autocomplete
                        fullWidth
                        autoHighlight
                        id="state"
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
                            placeholder="Enter State Name"
                            error={Boolean(touched.state && errors.state)}
                            helperText={touched.state && errors.state ? 'Please Select State Name' : ''}
                          />
                        )}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="vendor-cityName">Select City</InputLabel>
                      <Autocomplete
                        fullWidth
                        autoHighlight
                        id="cityName"
                        options={cities || []}
                        getOptionLabel={(option) => `${option.name}     (${option.postalCode})`}
                        value={cities?.find((city) => city.id === selectedCityId)}
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
                            placeholder="Enter City Name"
                            error={Boolean(touched.cityName && errors.cityName)}
                            helperText={touched.cityName && errors.cityName ? 'Please Select City Name' : ''}
                          />
                        )}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="vendor-address">Address</InputLabel>
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
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
              <Grid container justifyContent="flex-end" alignItems={'end'}>
                <Grid item>
                  <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button type="submit" color="primary" variant="contained" disabled={isSubmitting}>
                      {vendor ? 'Edit' : 'Add'}
                    </Button>
                    <Button variant="contained" type="reset" color="error" onClick={onCancel}>
                      Cancel
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
      {!isCreating && <AlertVendorDelete title={vendor.fatherName} open={openAlert} handleClose={handleAlertClose} id={vendor.Id} />}
    </>
  );
};

export default AddVendor;
