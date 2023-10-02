import { Button, Divider, Grid, InputLabel, Stack, TextField, FormControl } from '@mui/material';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import MainCard from 'components/MainCard';
import { createCustomerRequest } from 'api/services/SalesService';

// Define validation schema using Yup
const validationSchema = yup.object({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  phoneNumber: yup.string().required('Phone Number is required'),
  emailAddress: yup.string().required('E-Mail is required'),
  city: yup.string().required('City Name is required')
});

function AddCustomerForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navigateToCustomer = useNavigate();

  // Handler function to create a customer
  const customerHandlerCreate = async (values: { firstName: any; lastName: any; phoneNumber: any; emailAddress: any; city: any }) => {
    try {
      const customer = {
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
        city: values.city,
        email: values.emailAddress,
        postCode: '',
        address: ''
      };

      // Call the API to create a customer
      const response = await createCustomerRequest(customer);

      if (response.status === 'success') {
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Customer Added successfully',
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: false
          })
        );
        navigateToCustomer('/master/customers');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <MainCard>
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          phoneNumber: '',
          emailAddress: '',
          city: ''
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          customerHandlerCreate(values);
          resetForm(); // Reset the form after successful submission
        }}
      >
        {({ handleChange, handleSubmit, values, errors, touched, resetForm }) => (
          <Form onSubmit={handleSubmit}>
            <Grid container spacing={3.5}>
              {/* Form fields */}
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel>First Name</InputLabel>
                  <FormControl>
                    <TextField
                      id="firstName"
                      type="text"
                      name="firstName"
                      placeholder="Enter First Name"
                      value={values.firstName}
                      onChange={handleChange}
                      fullWidth
                    />
                    {touched.firstName && errors.firstName && <div className="error">{errors.firstName}</div>}
                  </FormControl>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel>Last Name</InputLabel>
                  <FormControl>
                    <TextField
                      id="lastName"
                      name="lastName"
                      placeholder="Enter Last Name"
                      value={values.lastName}
                      onChange={handleChange}
                      fullWidth
                    />
                    {touched.lastName && errors.lastName && <div className="error">{errors.lastName}</div>}
                  </FormControl>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel>Phone Number</InputLabel>
                  <FormControl>
                    <TextField
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="Enter Phone Number"
                      value={values.phoneNumber}
                      onChange={handleChange}
                      fullWidth
                    />
                    {touched.phoneNumber && errors.phoneNumber && <div className="error">{errors.phoneNumber}</div>}
                  </FormControl>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel>E-Mail</InputLabel>
                  <FormControl>
                    <TextField
                      id="emailAddress"
                      name="emailAddress"
                      placeholder="Enter E-Mail"
                      value={values.emailAddress}
                      onChange={handleChange}
                      fullWidth
                    />
                    {touched.emailAddress && errors.emailAddress && <div className="error">{errors.emailAddress}</div>}
                  </FormControl>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel>Enter City</InputLabel>
                  <FormControl>
                    <TextField id="city" name="city" placeholder="Enter City Name" value={values.city} onChange={handleChange} fullWidth />
                    {touched.city && errors.city && <div className="error">{errors.city}</div>}
                  </FormControl>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={2}>
                  <Button variant="contained" color="error" onClick={() => navigate('/master/customers')}>
                    Cancel
                  </Button>
                  <Button variant="contained" type="reset" color="secondary" onClick={() => resetForm()}>
                    Reset Form
                  </Button>
                  <Button variant="contained" color="success" type="submit">
                    Save
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </MainCard>
  );
}

export default AddCustomerForm;
