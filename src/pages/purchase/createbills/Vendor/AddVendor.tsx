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

import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

// types
import { ThemeMode } from 'types/config';
import AlertVendorDelete from './AlertVendorDelete';

// constant
const getInitialValues = (vendor: FormikValues | null) => {
  const newVendor = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    cityName: ''
  };

  return newVendor;
};

// ==============================|| CUSTOMER ADD / EDIT ||============================== //

export interface Props {
  vendor?: any;
  onCancel: () => void;
}

const AddVendor = ({ vendor, onCancel }: Props) => {
  const theme = useTheme();
  const isCreating = !vendor;

  const VendorSchema = Yup.object().shape({
    firstName: Yup.string().max(255).required('Please Enter First Name'),
    lastName: Yup.string().max(255).required('Pease Enter Last Name'),
    phoneNumber: Yup.string()
      .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
      .required('Please Enter Phone Number'),
    email: Yup.string()
      .max(255)
      .required('Please Enter E-mail Address')
      .matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 'E-Mail Address Is Not Valid'),
    cityName: Yup.string().max(255).required('Pease Enter City Name')
  });

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    onCancel();
  };

  const formik = useFormik({
    initialValues: getInitialValues(vendor!),
    validationSchema: VendorSchema,
    onSubmit: (values, { setSubmitting }) => {
      try {
        if (vendor) {
          dispatch(
            openSnackbar({
              open: true,
              message: 'Vendor added successfully.',
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
              message: 'Vendor added successfully.',
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

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Philadelphia'];

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <DialogTitle>{vendor ? 'Add Vendor' : 'New Vendor'}</DialogTitle>
              <IconButton shape="rounded" type="reset" color="error" onClick={onCancel} style={{ marginRight: '5px' }}>
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
                        <InputLabel htmlFor="vendor-name">First Name</InputLabel>
                        <TextField
                          autoFocus
                          fullWidth
                          id="firstName"
                          type="text"
                          placeholder="Enter First Name"
                          {...getFieldProps('firstName')}
                          error={Boolean(touched.firstName && errors.firstName)}
                          helperText={touched.firstName && errors.firstName}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="vendor-lastName">Last Name</InputLabel>
                        <TextField
                          fullWidth
                          id="vendor-lastName"
                          type="text"
                          placeholder="Enter Last Name"
                          {...getFieldProps('lastName')}
                          error={Boolean(touched.lastName && errors.lastName)}
                          helperText={touched.lastName && errors.lastName}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="vendor-phoneNumber">Phone Number</InputLabel>
                        <TextField
                          fullWidth
                          id="vendor-phoneNumber"
                          placeholder="Enter Phone Number"
                          {...getFieldProps('phoneNumber')}
                          error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                          helperText={touched.phoneNumber && errors.phoneNumber}
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
                        <InputLabel htmlFor="vendor-email">E-mail</InputLabel>
                        <TextField
                          fullWidth
                          id="vendor-email"
                          type="email"
                          placeholder="Enter Email"
                          {...getFieldProps('email')}
                          error={Boolean(touched.email && errors.email)}
                          helperText={touched.email && errors.email}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="vendor-city">City</InputLabel>
                        <Autocomplete
                          fullWidth
                          autoHighlight
                          id="vendor-city"
                          options={cities} // Provide your list of city names here
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Enter City Name"
                              error={Boolean(touched.cityName && errors.cityName)}
                              helperText={touched.cityName && errors.cityName}
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
                    <Button type="submit" color="primary" variant="contained" disabled={isSubmitting}>
                      Add
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
