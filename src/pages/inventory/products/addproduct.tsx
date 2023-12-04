// material-ui
import { Grid, InputLabel, Stack, TextField, Button, DialogActions, Typography, TextareaAutosize, Autocomplete } from '@mui/material';
import React from 'react';
import { useFormik, FormikProvider, Form, FormikValues } from 'formik';
import * as Yup from 'yup';
// import { openSnackbar } from 'store/reducers/snackbar';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MainCard from 'components/MainCard';

// ==============================|| ADD PRODUCTS  ||============================== //

const category = ['Electronics', 'Clothing and Apparel', 'Home and Kitchen', 'Health and Beauty', 'Books and Stationery', 'Toys and Games'];
const unitname = ['kilo', 'gram', 'liter', 'ml'];

const getInitialValues = (customer?: FormikValues | null) => {
  if (customer) {
    const newCustomer = {
      productName: customer.productName,
      productCategory: customer.productCategory,
      hsnsaccdoeno: customer.hsnsaccdoeno,
      bypingprice: customer.bypingprice,
      sellingprice: customer.sellingprice,
      sgsttax: customer.sgsttax,
      cgsttax: customer.cgsttax,
      igsttax: customer.igsttax,
      initialstock: customer.initialstock,
      minimumstock: customer.minimumstock,
      unit: customer.unit
    };
    return newCustomer;
  } else {
    const newCustomer = {
      productName: '',
      productCategory: '',
      hsnsaccdoeno: '',
      bypingprice: '',
      sellingprice: '',
      sgsttax: '',
      cgsttax: '',
      igsttax: '',
      initialstock: '',
      minimumstock: '',
      unit: ''
    };
    return newCustomer;
  }
};

const CustomerSchema = Yup.object().shape({
  productName: Yup.string().max(255).required('Please Enter Product Name'),
  productCategory: Yup.string().max(255).required('Please Category Name'),
  description: Yup.string().max(255).required('Please Enter Description'),
  hsnsaccdoeno: Yup.string()
    .matches(/^[0-9]+$/, 'Only numbers are allowed')
    .max(255)
    .required('Please Enter HSN/SAC No.'),
  bypingprice: Yup.string()
    .matches(/^\d+(\.\d{0,2})?$/, 'Invalid price format. Use only two decimal places')
    .required('Please Enter Buying Price'),
  sellingprice: Yup.string()
    .matches(/^\d+(\.\d{0,2})?$/, 'Invalid price format. Use only two decimal places')
    .required('Please Enter Selling Price'),
  sgsttax: Yup.string()
    .matches(/^\d+(\.\d{0,2})?$/, 'Invalid tax format. Use only two decimal places')
    .required('Please Enter S GST Rate Tax'),
  cgsttax: Yup.string()
    .matches(/^\d+(\.\d{0,2})?$/, 'Invalid tax format. Use only two decimal places')
    .required('Please Enter C GST Rate Tax'),
  igsttax: Yup.string()
    .matches(/^\d+(\.\d{0,2})?$/, 'Invalid tax format. Use only two decimal places')
    .required('Please Enter I GST Rate Tax'),
  initialstock: Yup.string()
    .matches(/^[0-9]+$/, 'Only numbers are allowed')
    .max(255)
    .required('Please Enter Initial Stock'),
  minimumstock: Yup.string()
    .matches(/^[0-9]+$/, 'Only numbers are allowed')
    .max(255)
    .required('Please Enter Initial Stock'),
  unit: Yup.string().max(255).required('Please Enter Unit')
});

export default function AddProductForm() {
  const [value, setValue] = React.useState<string | null>(category[0]);
  const [inputValue, setInputValue] = React.useState('');

  const [valuex, setUnitValue] = React.useState<string | null>(unitname[0]);
  const [inputUnitValue, setinputUnitValue] = React.useState('');

  const formik = useFormik({
    initialValues: getInitialValues(),
    enableReinitialize: true,
    validationSchema: CustomerSchema,
    onSubmit: async (values, { setSubmitting }) => {
      // try {
      //   const customerData = {
      //     userId: values.id,
      //     clientId: values.clientId,
      //     firstName: values.firstName,
      //     lastName: values.lastName,
      //     email: values.email,
      //     cityId: values.cityId,
      //     phoneNumber: values.phoneNumber,
      //     city: values.cityName,
      //     addressLine: values.addressLine
      //   };
      //   if (customer) {
      //     const response = await updateCustomerRequest(customerData);
      //     if (response === 204) {
      //       dispatch(
      //         openSnackbar({
      //           open: true,
      //           message: 'Customer updated successfully.',
      //           anchorOrigin: { vertical: 'top', horizontal: 'right' },
      //           variant: 'alert',
      //           alert: {
      //             color: 'success'
      //           },
      //           close: false
      //         })
      //       );
      //       window.location.reload();
      //     }
      //   } else {
      //     const response = await createCustomerRequest(customerData);
      //     if (response === 200) {
      //       dispatch(
      //         openSnackbar({
      //           open: true,
      //           message: 'Customer added successfully.',
      //           anchorOrigin: { vertical: 'top', horizontal: 'right' },
      //           variant: 'alert',
      //           alert: {
      //             color: 'success'
      //           },
      //           close: false
      //         })
      //       );
      //       window.location.reload();
      //     }
      //   }
      //   setSubmitting(false);
      //   // onCancel();
      // } catch (error) {
      //   console.error(error);
      // }
    }
  });

  const { errors, touched, handleSubmit } = formik;
  return (
    <>
      <MainCard>
        <FormikProvider value={formik}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Grid container spacing={2.5}>
                <Grid xs={12} sm={6} sx={{ marginLeft: 2.5, marginBottom: 2.5, marginTop: 2.5 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={8}>
                      <Stack spacing={0.5} alignItems="left" justifyContent="start">
                        <InputLabel>
                          <Stack direction={'row'}>
                            <Typography variant="inherit" color="textPrimary">
                              Name
                            </Typography>
                            <Typography variant="inherit" color="error">
                              *
                            </Typography>
                          </Stack>
                        </InputLabel>
                        <TextField
                          autoFocus
                          required
                          type="text"
                          id="productName"
                          name="productName"
                          placeholder="Enter Product/Service Name"
                          fullWidth
                          error={Boolean(touched.productName && errors.productName)}
                          helperText={touched.productName && errors.productName ? (errors.productName as string) : ''}
                          onBlur={formik.handleBlur}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Stack spacing={0.5} alignItems="left" justifyContent="start" sx={{ display: 'flex', flexDirection: 'column' }}>
                        <InputLabel>Unit</InputLabel>
                        <Autocomplete
                          value={valuex}
                          onChange={(event: any, newValue: string | null) => {
                            setUnitValue(newValue);
                          }}
                          inputValue={inputUnitValue}
                          onInputChange={(event, newInputValuex) => {
                            setinputUnitValue(newInputValuex);
                          }}
                          id="controllable-states-demo"
                          options={unitname}
                          sx={{ width: '100%' }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              error={Boolean(touched.unit && errors.unit)}
                              helperText={touched.unit && errors.unit ? 'Please Enter Unit' : ''}
                            />
                          )}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid xs={12} sm={6} sx={{ marginLeft: 2.5, marginBottom: 2.5 }}>
                  <Stack spacing={0.5} alignItems="left" justifyContent="start">
                    <InputLabel>
                      <Stack direction={'row'}>
                        <Typography variant="inherit" color="textPrimary">
                          Category Name
                        </Typography>
                      </Stack>
                    </InputLabel>
                    <Autocomplete
                      value={value}
                      onChange={(event: any, newValue: string | null) => {
                        setValue(newValue);
                        formik.setFieldTouched('productCategory', true, false);
                        formik.setFieldError('productCategory', '');
                      }}
                      inputValue={inputValue}
                      onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue);
                      }}
                      id="controllable-states-demo"
                      options={category}
                      sx={{ width: '100%' }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={Boolean(touched.productCategory && errors.productCategory)}
                          helperText={touched.productCategory && errors.productCategory ? 'Please Enter Product Category' : ''}
                        />
                      )}
                    />
                  </Stack>
                </Grid>

                <Grid xs={12} sm={6} sx={{ marginLeft: 2.5, marginBottom: 2.5 }}>
                  <Stack spacing={0.5} alignItems="left" justifyContent="start">
                    <InputLabel>
                      <Stack direction={'row'}>
                        <Typography variant="inherit" color="textPrimary">
                          Description
                        </Typography>
                      </Stack>
                    </InputLabel>
                    <TextareaAutosize
                      id="description"
                      minRows={4}
                      maxRows={10}
                      placeholder="Enter Description"
                      style={{
                        width: '100%',
                        resize: 'vertical',
                        border: '1px solid #ced4da',
                        borderRadius: '4px',
                        padding: '8px',
                        fontFamily: 'inherit'
                      }}
                    />
                  </Stack>
                </Grid>
                <Grid xs={12} sm={6} sx={{ marginLeft: 2.5, marginBottom: 2.5 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Stack spacing={0.5} alignItems="left" justifyContent="start" sx={{ display: 'flex', flexDirection: 'column' }}>
                        <InputLabel>
                          <Stack direction={'row'}>
                            <Typography variant="inherit" color="textPrimary">
                              HSN/SAC No.
                            </Typography>
                            <Typography variant="inherit" color="error">
                              *
                            </Typography>
                          </Stack>
                        </InputLabel>
                        <TextField
                          required
                          id="hsnsaccdoeno"
                          name="hsnsaccdoeno"
                          placeholder="Enter HSN/SAC No."
                          error={Boolean(touched.hsnsaccdoeno && errors.hsnsaccdoeno)}
                          helperText={touched.hsnsaccdoeno && typeof errors.hsnsaccdoeno === 'string' ? errors.hsnsaccdoeno : ''}
                          onBlur={(e) => {
                            formik.handleBlur(e);
                            formik.setFieldTouched('hsnsaccdoeno', true, false);
                          }}
                          onChange={(e) => {
                            formik.handleChange(e);
                            formik.setFieldTouched('hsnsaccdoeno', true, false);
                          }}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Stack spacing={0.5} alignItems="left" justifyContent="start" sx={{ display: 'flex', flexDirection: 'column' }}>
                        <InputLabel>
                          <Stack direction={'row'}>
                            <Typography variant="inherit" color="textPrimary">
                              Buying Price
                            </Typography>
                            <Typography variant="inherit" color="error">
                              *
                            </Typography>
                          </Stack>
                        </InputLabel>
                        <TextField
                          required
                          id="bypingprice"
                          name="bypingprice"
                          placeholder="Enter Buying Price"
                          fullWidth
                          error={Boolean(touched.bypingprice && errors.bypingprice)}
                          helperText={touched.bypingprice && typeof errors.bypingprice === 'string' ? errors.bypingprice : ''}
                          onBlur={formik.handleBlur}
                          onChange={(e) => {
                            formik.handleChange(e);
                            formik.setFieldTouched('bypingprice', true, false);
                          }}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Stack spacing={0.5} alignItems="left" justifyContent="start" sx={{ display: 'flex', flexDirection: 'column' }}>
                        <InputLabel>
                          <Stack direction={'row'}>
                            <Typography variant="inherit" color="textPrimary">
                              Selling Price
                            </Typography>
                            <Typography variant="inherit" color="error">
                              *
                            </Typography>
                          </Stack>
                        </InputLabel>
                        <TextField
                          fullWidth
                          id="sellingprice"
                          required
                          type="text"
                          placeholder="Enter Selling Price"
                          error={Boolean(touched.sellingprice && errors.sellingprice)}
                          helperText={touched.sellingprice && typeof errors.sellingprice === 'string' ? errors.sellingprice : ''}
                          onBlur={formik.handleBlur}
                          onChange={(e) => {
                            formik.handleChange(e);
                            formik.setFieldTouched('sellingprice', true, false);
                          }}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid xs={12} sm={6} sx={{ marginLeft: 2.5, marginBottom: 2.5 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Stack spacing={0.5} alignItems="left" justifyContent="start" sx={{ display: 'flex', flexDirection: 'column' }}>
                        <InputLabel>S GST Rate %</InputLabel>
                        <TextField
                          required
                          id="sgsttax"
                          name="sgsttax"
                          placeholder="Enter SGST"
                          fullWidth
                          error={Boolean(touched.sgsttax && errors.sgsttax)}
                          helperText={touched.sgsttax && typeof errors.sgsttax === 'string' ? errors.sgsttax : ''}
                          onBlur={formik.handleBlur}
                          onChange={(e) => {
                            formik.handleChange(e);
                            formik.setFieldTouched('sgsttax', true);
                            formik.setFieldError('sgsttax', '');
                          }}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Stack spacing={0.5} alignItems="left" justifyContent="start" sx={{ display: 'flex', flexDirection: 'column' }}>
                        <InputLabel>C GST Rate %</InputLabel>
                        <TextField
                          required
                          id="cgsttax"
                          name="cgsttax"
                          placeholder="Enter CGST"
                          fullWidth
                          error={Boolean(touched.cgsttax && errors.cgsttax)}
                          helperText={touched.cgsttax && typeof errors.cgsttax === 'string' ? errors.cgsttax : ''}
                          onBlur={formik.handleBlur}
                          onChange={(e) => {
                            formik.handleChange(e);
                            formik.setFieldTouched('cgsttax', true);
                            formik.setFieldError('cgsttax', '');
                          }}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Stack spacing={0.5} alignItems="left" justifyContent="start" sx={{ display: 'flex', flexDirection: 'column' }}>
                        <InputLabel>I GST Rate %</InputLabel>
                        <TextField
                          required
                          id="igsttax"
                          name="igsttax"
                          placeholder="Enter CGST"
                          fullWidth
                          error={Boolean(touched.igsttax && errors.igsttax)}
                          helperText={touched.igsttax && typeof errors.igsttax === 'string' ? errors.igsttax : ''}
                          onBlur={formik.handleBlur}
                          onChange={(e) => {
                            formik.handleChange(e);
                            formik.setFieldTouched('igsttax', true);
                            formik.setFieldError('igsttax', '');
                          }}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid xs={12} sm={6} sx={{ marginLeft: 2.5, marginBottom: 2.5 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Stack spacing={0.5} alignItems="left" justifyContent="start" sx={{ display: 'flex', flexDirection: 'column' }}>
                        <InputLabel>Initial Stock</InputLabel>
                        <TextField
                          required
                          id="initialstock"
                          name="initialstock"
                          placeholder="Enter Initial Stock"
                          fullWidth
                          error={Boolean(touched.initialstock && errors.initialstock)}
                          helperText={touched.initialstock && typeof errors.initialstock === 'string' ? errors.initialstock : ''}
                          onBlur={formik.handleBlur}
                          onChange={(e) => {
                            formik.handleChange(e);
                            formik.setFieldTouched('initialstock', true);
                            formik.setFieldError('initialstock', '');
                          }}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Stack spacing={0.5} alignItems="left" justifyContent="start" sx={{ display: 'flex', flexDirection: 'column' }}>
                        <InputLabel>Minimum Stock</InputLabel>
                        <TextField
                          required
                          id="minimumstock"
                          name="minimumstock"
                          placeholder="Enter Minimum Stock"
                          fullWidth
                          error={Boolean(touched.minimumstock && errors.minimumstock)}
                          helperText={touched.minimumstock && typeof errors.minimumstock === 'string' ? errors.minimumstock : ''}
                          onBlur={formik.handleBlur}
                          onChange={(e) => {
                            formik.handleChange(e);
                            formik.setFieldTouched('minimumstock', true);
                            formik.setFieldError('minimumstock', '');
                          }}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid xs={12} sm={6} sx={{ marginLeft: 4.5, marginBottom: 2.5 }}>
                  <DialogActions sx={{ p: 2.5 }}>
                    <Grid container justifyContent="flex-end" alignItems={'end'}>
                      <Grid item>
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                          <Button type="submit" color="primary" variant="contained">
                            Save
                          </Button>
                          <Button variant="contained" type="reset" color="error">
                            Cancel
                          </Button>
                        </Stack>
                      </Grid>
                    </Grid>
                  </DialogActions>
                </Grid>
              </Grid>
            </Form>
          </LocalizationProvider>
        </FormikProvider>
      </MainCard>
    </>
  );
}
