// material-ui
import { Button, Divider, Grid, InputLabel, Stack, TextField } from '@mui/material';

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router';

// project imports

// assets
import MainCard from 'components/MainCard';

// validation schema
const validationSchema = yup.object({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  phoneNumber: yup.string().required('Phone Number is required'),
  emailAddress: yup.string().required('E-Mail is required'),
  city: yup.string().required('City Name is required')
});

// ==============================|| ADD CUSTOMER FORMS VALIDATION - ADDRESS ||============================== //

function AddCustomerForm() {
  const customer = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      emailAddress: '',
      city: ''
    },
    validationSchema,
    onSubmit: async (values, { setErrors, setStatus, setSubmitting }) => {}
  });
  const navigation = useNavigate();
  let navigateToBack = () => {
    navigation('/master/customers');
  };

  return (
    <MainCard>
      <form onSubmit={customer.handleSubmit}>
        <Grid container spacing={3.5}>
          <Grid item xs={12} sm={6}>
            <Stack spacing={1}>
              <InputLabel>First Name</InputLabel>
              <TextField
                id="firstName"
                name="firstName"
                placeholder="Enter First Name"
                value={customer.values.firstName}
                onChange={customer.handleChange}
                onBlur={customer.handleBlur}
                error={customer.touched.firstName && Boolean(customer.errors.firstName)}
                helperText={customer.touched.firstName && customer.errors.firstName}
                fullWidth
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack spacing={1}>
              <InputLabel>Last Name</InputLabel>
              <TextField
                id="lastName"
                name="lastName"
                placeholder="Enter Last Name"
                value={customer.values.lastName}
                onChange={customer.handleChange}
                onBlur={customer.handleBlur}
                error={customer.touched.lastName && Boolean(customer.errors.lastName)}
                helperText={customer.touched.lastName && customer.errors.lastName}
                fullWidth
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack spacing={1}>
              <InputLabel>Phone Number</InputLabel>
              <TextField
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Enter Phone Number"
                value={customer.values.phoneNumber}
                onChange={customer.handleChange}
                onBlur={customer.handleBlur}
                error={customer.touched.phoneNumber && Boolean(customer.errors.phoneNumber)}
                helperText={customer.touched.phoneNumber && customer.errors.phoneNumber}
                fullWidth
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack spacing={1}>
              <InputLabel>E-Mail</InputLabel>
              <TextField
                id="emailAddress"
                name="emailAddress"
                placeholder="Enter E-Mail"
                value={customer.values.emailAddress}
                onChange={customer.handleChange}
                onBlur={customer.handleBlur}
                error={customer.touched.emailAddress && Boolean(customer.errors.emailAddress)}
                helperText={customer.touched.emailAddress && customer.errors.emailAddress}
                fullWidth
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack spacing={1}>
              <InputLabel>Enter City</InputLabel>
              <TextField
                id="city"
                name="city"
                placeholder="Enter City Name"
                value={customer.values.city}
                onChange={customer.handleChange}
                onBlur={customer.handleBlur}
                error={customer.touched.city && Boolean(customer.errors.city)}
                helperText={customer.touched.city && customer.errors.city}
                fullWidth
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={2}>
              <Button variant="contained" color="error" onClick={navigateToBack}>
                Cancel
              </Button>
              <Button variant="contained" type="reset" color="secondary" onClick={() => customer.resetForm()}>
                Reset Form
              </Button>
              <Button variant="contained" type="submit" color="success" disabled={customer.isSubmitting}>
                Save
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </MainCard>
  );
}

export default AddCustomerForm;
