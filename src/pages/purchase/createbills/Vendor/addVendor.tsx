import { Button, Divider, Grid, InputLabel, Stack, TextField, FormControl } from '@mui/material';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import MainCard from 'components/MainCard';
import { createVendorRequest } from 'api/services/BillService';

// Define validation schema using Yup
const validationSchema = yup.object({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required')
});

function AddVendor() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navigateToVendor = useNavigate();

  // Handler function to create a vendor
  const vendorHandlerCreate = async (values: { firstName: any; lastName: any; emailAddress: any }) => {
    try {
      const vendor = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.emailAddress
      };

      // Call the API to create a vendor
      const response = await createVendorRequest(vendor);

      if (response.status === 'success') {
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Vendor Added successfully',
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: false
          })
        );
        navigateToVendor('/master/vendors');
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
          emailAddress: ''
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          vendorHandlerCreate(values);
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
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={2}>
                  <Button variant="contained" color="error" onClick={() => navigate('/master/vendors')}>
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
export default AddVendor;