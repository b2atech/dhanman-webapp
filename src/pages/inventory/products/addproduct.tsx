// material-ui
import { Grid, InputLabel, Stack, TextField, Button, DialogActions, Typography, TextareaAutosize, Autocomplete } from '@mui/material';
import React from 'react';
import { useFormik, FormikProvider, Form, FormikValues } from 'formik';
import * as Yup from 'yup';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MainCard from 'components/MainCard';
// ==============================|| ADD PRODUCTS  ||============================== //

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
    .matches(/^\d{8}$/, 'HSN/SAC No. must be an 8-digit number')
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
    .matches(/^\d+(\.\d{0,2})?$/, 'Invalid Initial stock format. Use only two decimal places')
    .required('Please Enter Minimum Stock'),
  minimumstock: Yup.string()
    .matches(/^\d+(\.\d{0,2})?$/, 'Invalid Minimum stock format. Use only two decimal places')
    .required('Please Enter Minimum Stock'),
  unit: Yup.string().max(255).required('Please Enter Unit')
});

const category = ['Electronics', 'Clothing and Apparel', 'Home and Kitchen', 'Health and Beauty', 'Books and Stationery', 'Toys and Games'];
const unitname = ['kilo', 'gram', 'liter', 'ml'];
const sgsttaxrate = [0, 5, 12, 18, 28];
const cgsttaxrate = [0, 5, 12, 18, 28];
const igsttaxrate = [0, 5, 12, 18, 28];

export default function AddProductForm() {
  const [value, setValue] = React.useState<string | null>(category[0]);
  const [inputValue, setInputValue] = React.useState('');

  const [unitValue, setUnitValue] = React.useState<string | null>(unitname[0]);
  const [inputUnitValue, setinputUnitValue] = React.useState('');

  const [sgstTaxRender, setSgstTaxRender] = React.useState<number | null>(sgsttaxrate[0]);
  const [sgstTaxValue, setSgstTaxValue] = React.useState('');

  const [cgstTaxRender, setCgstTaxRender] = React.useState<number | null>(cgsttaxrate[0]);
  const [cgstTaxValue, setCgstTaxValue] = React.useState('');

  const [igstTaxRender, setIgstTaxRender] = React.useState<number | null>(igsttaxrate[0]);
  const [igstTaxValue, setIgstTaxValue] = React.useState('');

  const formik = useFormik({
    initialValues: getInitialValues(),
    enableReinitialize: true,
    validationSchema: CustomerSchema,
    onSubmit: async (values, { setSubmitting }) => {}
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
                          required
                          id="productName"
                          name="productName"
                          placeholder="Enter product name"
                          fullWidth
                          error={Boolean(touched.productName && errors.productName)}
                          helperText={touched.productName && typeof errors.productName === 'string' ? errors.productName : ''}
                          onBlur={formik.handleBlur}
                          onChange={(e) => {
                            formik.handleChange(e);
                            formik.setFieldTouched('productName', true);
                            formik.setFieldError('productName', '');
                          }}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Stack spacing={0.5} alignItems="left" justifyContent="start" sx={{ display: 'flex', flexDirection: 'column' }}>
                        <InputLabel>Unit</InputLabel>
                        <Autocomplete
                          value={unitValue}
                          onChange={(event: any, newValue: string | null) => {
                            setUnitValue(newValue);
                            formik.setFieldValue('unit', newValue);
                          }}
                          inputValue={inputUnitValue}
                          onInputChange={(event, newInputValue) => {
                            setinputUnitValue(newInputValue);
                            formik.setFieldValue('unit', newInputValue);
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
                        formik.setFieldValue('productCategory', newValue);
                      }}
                      inputValue={inputValue}
                      onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue);
                        formik.setFieldValue('productCategory', newInputValue);
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
                          inputProps={{
                            style: { textAlign: 'right' },
                            maxLength: 8
                          }}
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
                          inputProps={{ style: { textAlign: 'right' } }}
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
                          inputProps={{ style: { textAlign: 'right' } }}
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
                        <Autocomplete
                          value={sgstTaxRender}
                          onChange={(event: any, newValue: number | null) => {
                            setSgstTaxRender(newValue);
                            formik.setFieldValue('sgsttax', newValue);
                          }}
                          inputValue={sgstTaxValue}
                          onInputChange={(event, newInput_Sgst_Value) => {
                            setSgstTaxValue(newInput_Sgst_Value);
                            formik.setFieldValue('sgsttax', newInput_Sgst_Value);
                          }}
                          id="controllable-states-demo"
                          options={sgsttaxrate}
                          sx={{ width: '100%' }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              error={Boolean(touched.sgsttax && errors.sgsttax)}
                              helperText={touched.sgsttax && errors.sgsttax ? 'Please Enter S SGST Tax Rate' : ''}
                            />
                          )}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Stack spacing={0.5} alignItems="left" justifyContent="start" sx={{ display: 'flex', flexDirection: 'column' }}>
                        <InputLabel>C GST Rate %</InputLabel>
                        <Autocomplete
                          value={cgstTaxRender}
                          onChange={(event: any, newValue: number | null) => {
                            setCgstTaxRender(newValue);
                            formik.setFieldValue('cgsttax', newValue);
                          }}
                          inputValue={cgstTaxValue}
                          onInputChange={(event, newInput_Cgst_Value) => {
                            setCgstTaxValue(newInput_Cgst_Value);
                            formik.setFieldValue('cgsttax', newInput_Cgst_Value);
                          }}
                          id="controllable-states-demo"
                          options={cgsttaxrate}
                          sx={{ width: '100%' }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              error={Boolean(touched.cgsttax && errors.cgsttax)}
                              helperText={touched.cgsttax && errors.cgsttax ? 'Please Enter C SGST Tax Rate' : ''}
                            />
                          )}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Stack spacing={0.5} alignItems="left" justifyContent="start" sx={{ display: 'flex', flexDirection: 'column' }}>
                        <InputLabel>I GST Rate %</InputLabel>
                        <Autocomplete
                          value={igstTaxRender}
                          onChange={(event: any, newValue: number | null) => {
                            setIgstTaxRender(newValue);
                            formik.setFieldValue('igsttax', newValue);
                          }}
                          inputValue={igstTaxValue}
                          onInputChange={(event, newInput_Igst_Value) => {
                            setIgstTaxValue(newInput_Igst_Value);
                            formik.setFieldValue('igsttax', newInput_Igst_Value);
                          }}
                          id="controllable-states-demo"
                          options={igsttaxrate}
                          sx={{ width: '100%' }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              error={Boolean(touched.igsttax && errors.igsttax)}
                              helperText={touched.igsttax && errors.igsttax ? 'Please Enter I SGST Tax Rate' : ''}
                            />
                          )}
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
                          fullWidth
                          id="initialstock"
                          required
                          type="text"
                          placeholder="Enter Initial Stock"
                          inputProps={{ style: { textAlign: 'right' } }}
                          error={Boolean(touched.initialstock && errors.initialstock)}
                          helperText={touched.initialstock && typeof errors.initialstock === 'string' ? errors.initialstock : ''}
                          onBlur={formik.handleBlur}
                          onChange={(e) => {
                            formik.handleChange(e);
                            formik.setFieldTouched('initialstock', true, false);
                          }}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Stack spacing={0.5} alignItems="left" justifyContent="start" sx={{ display: 'flex', flexDirection: 'column' }}>
                        <InputLabel>Minimum Stock</InputLabel>
                        <TextField
                          fullWidth
                          id="minimumstock"
                          required
                          type="text"
                          placeholder="Enter Minimum Stock"
                          inputProps={{ style: { textAlign: 'right' } }}
                          error={Boolean(touched.minimumstock && errors.minimumstock)}
                          helperText={touched.minimumstock && typeof errors.minimumstock === 'string' ? errors.minimumstock : ''}
                          onBlur={formik.handleBlur}
                          onChange={(e) => {
                            formik.handleChange(e);
                            formik.setFieldTouched('minimumstock', true, false);
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
