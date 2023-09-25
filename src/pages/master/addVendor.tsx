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

// ==============================|| ADD VENDOR FORMS VALIDATION - ADDRESS ||============================== //

function AddVendor() {
  const vendor = useFormik({
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
    navigation('/master/vendors');
  };

  return (
    <MainCard>
      <form onSubmit={vendor.handleSubmit}>
        <Grid container spacing={3.5}>
          <Grid item xs={12} sm={6}>
            <Stack spacing={1}>
              <InputLabel>First Name</InputLabel>
              <TextField
                id="firstName"
                name="firstName"
                placeholder="Enter First Name"
                value={vendor.values.firstName}
                onChange={vendor.handleChange}
                onBlur={vendor.handleBlur}
                error={vendor.touched.firstName && Boolean(vendor.errors.firstName)}
                helperText={vendor.touched.firstName && vendor.errors.firstName}
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
                value={vendor.values.lastName}
                onChange={vendor.handleChange}
                onBlur={vendor.handleBlur}
                error={vendor.touched.lastName && Boolean(vendor.errors.lastName)}
                helperText={vendor.touched.lastName && vendor.errors.lastName}
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
                value={vendor.values.phoneNumber}
                onChange={vendor.handleChange}
                onBlur={vendor.handleBlur}
                error={vendor.touched.phoneNumber && Boolean(vendor.errors.phoneNumber)}
                helperText={vendor.touched.phoneNumber && vendor.errors.phoneNumber}
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
                value={vendor.values.emailAddress}
                onChange={vendor.handleChange}
                onBlur={vendor.handleBlur}
                error={vendor.touched.emailAddress && Boolean(vendor.errors.emailAddress)}
                helperText={vendor.touched.emailAddress && vendor.errors.emailAddress}
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
                value={vendor.values.city}
                onChange={vendor.handleChange}
                onBlur={vendor.handleBlur}
                error={vendor.touched.city && Boolean(vendor.errors.city)}
                helperText={vendor.touched.city && vendor.errors.city}
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
              <Button variant="contained" type="reset" color="secondary" onClick={() => vendor.resetForm()}>
                Reset Form
              </Button>
              <Button variant="contained" type="submit" color="success" disabled={vendor.isSubmitting}>
                Save
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </MainCard>
  );
}

export default AddVendor;
