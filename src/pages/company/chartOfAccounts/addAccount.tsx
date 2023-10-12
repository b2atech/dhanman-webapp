// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, InputLabel, Stack, TextField } from '@mui/material';
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

// constant
const getInitialValues = (customer: FormikValues | null) => {
  const newCustomer = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    cityName: ''
  };

  return newCustomer;
};

// ==============================|| CUSTOMER ADD / EDIT ||============================== //

export interface Props {
  customer?: any;
  onCancel: () => void;
}

const AddNewAccount = ({ customer, onCancel }: Props) => {
  const theme = useTheme();

  const CustomerSchema = Yup.object().shape({
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

  const formik = useFormik({
    initialValues: getInitialValues(customer!),
    validationSchema: CustomerSchema,
    onSubmit: (values, { setSubmitting }) => {
      try {
        if (customer) {
          dispatch(
            openSnackbar({
              open: true,
              message: 'Account added successfully.',
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
              message: 'Account added successfully.',
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

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <DialogTitle>{customer ? 'Add Account' : 'Create Account'}</DialogTitle>
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
                        <InputLabel htmlFor="Type">Account Type</InputLabel>
                        <TextField
                          autoFocus
                          fullWidth
                          id="Type"
                          type="text"
                          placeholder="Enter Account Type"
                          {...getFieldProps('Type')}
                          error={Boolean(touched.firstName && errors.firstName)}
                          helperText={touched.firstName && errors.firstName}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="accountName">Account Name</InputLabel>
                        <TextField
                          fullWidth
                          id="accountName"
                          type="text"
                          placeholder="Enter Account Name"
                          {...getFieldProps('accountName')}
                          error={Boolean(touched.lastName && errors.lastName)}
                          helperText={touched.lastName && errors.lastName}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="accountCode">Account Code</InputLabel>
                        <TextField
                          fullWidth
                          id="accountCode"
                          type="text"
                          placeholder="Enter Account Code"
                          {...getFieldProps('accountCode')}
                          error={Boolean(touched.lastName && errors.lastName)}
                          helperText={touched.lastName && errors.lastName}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="description">Description</InputLabel>
                        <TextField
                          fullWidth
                          id="description"
                          type="email"
                          placeholder="Enter Account Description"
                          {...getFieldProps('description')}
                          error={Boolean(touched.email && errors.email)}
                          helperText={touched.email && errors.email}
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
    </>
  );
};

export default AddNewAccount;
