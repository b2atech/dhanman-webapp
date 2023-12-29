// material-ui
import {
  Grid,
  InputLabel,
  Stack,
  TextField,
  Button,
  DialogActions,
  Typography,
  TextareaAutosize,
  Autocomplete,
  FormControl,
  Box,
  CircularProgress
} from '@mui/material';
import { useFormik, FormikProvider, Form, FormikValues } from 'formik';
import * as Yup from 'yup';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MainCard from 'components/MainCard';
import { openSnackbar } from 'store/reducers/snackbar';
import { dispatch } from 'store';
import { createProductRequest } from 'api/services/InventoryService';
import { useNavigate } from 'react-router';
import config from 'config';
import { useCategories, useTaxCategories, useUnits, useVendors } from './ProductAPI';
import React from 'react';
// ==============================|| ADD PRODUCTS  ||============================== //

const getInitialValues = (inventroydata?: FormikValues | null) => {
  if (inventroydata) {
    const newProduct = {
      companyId: inventroydata.clientId,
      productName: inventroydata.productName,
      unitId: inventroydata.unitId,
      unit: inventroydata.unit,
      categoryId: inventroydata.categoryId,
      categoryName: inventroydata.categoryName,
      description: inventroydata.description,
      hsnCode: inventroydata.hsnCode,
      sac: '',
      purchasePrice: inventroydata.purchasePrice,
      sellingPrice: inventroydata.sellingPrice,
      cgst: inventroydata.cgst,
      sgst: inventroydata.sgst,
      igst: inventroydata.igst,
      openingStock: inventroydata.openingStock,
      minimumStock: inventroydata.minimumStock,
      vendorId: inventroydata.vendorId,
      vendorName: inventroydata.vendorName,
      taxCategoryId: inventroydata.taxCategoryId,
      maximumStock: inventroydata.maximumStock
    };
    return newProduct;
  } else {
    const newProduct = {
      companyId: '',
      productName: '',
      unitId: '',
      unit: '',
      categoryId: '',
      categoryName: '',
      description: '',
      hsnCode: '',
      sac: '',
      purchasePrice: '',
      sellingPrice: '',
      cgst: '',
      sgst: '',
      igst: '',
      openingStock: '',
      minimumStock: '',
      vendorId: '',
      vendorName: '',
      taxCategoryId: '',
      maximumStock: ''
    };
    return newProduct;
  }
};

const AddProductSchema = Yup.object().shape({
  productName: Yup.string().max(255).required('Please Enter Product Name'),
  taxCategoryId: Yup.number().required('Please Select Tax Category'),
  vendorName: Yup.string().max(255).required('Please Enter Supplier Name'),
  categoryName: Yup.string().max(255).required('Please Category Name'),
  hsnCode: Yup.string()
    .matches(/^\d{1,8}$/, 'HSN/SAC No. must be up to 8-digit number')
    .required('Please Enter HSN/SAC No.'),
  purchasePrice: Yup.string()
    .matches(/^\d+(\.\d{0,2})?$/, 'Invalid price format. Use only two decimal places')
    .required('Please Enter Buying Price'),
  sellingPrice: Yup.string()
    .matches(/^\d+(\.\d{0,2})?$/, 'Invalid price format. Use only two decimal places')
    .required('Please Enter Selling Price'),
  sgst: Yup.string()
    .matches(/^\d+(\.\d{0,2})?$/, 'Invalid tax format. Use only two decimal places')
    .required('Please Enter S GST Rate Tax'),
  cgst: Yup.string()
    .matches(/^\d+(\.\d{0,2})?$/, 'Invalid tax format. Use only two decimal places')
    .required('Please Enter C GST Rate Tax'),
  igst: Yup.string()
    .matches(/^\d+(\.\d{0,2})?$/, 'Invalid tax format. Use only two decimal places')
    .required('Please Enter I GST Rate Tax'),
  openingStock: Yup.string()
    .matches(/^\d+(\.\d{0,2})?$/, 'Invalid Initial stock format. Use only two decimal places')
    .required('Please Enter Initial Stock'),
  minimumStock: Yup.string()
    .matches(/^\d+(\.\d{0,2})?$/, 'Invalid Minimum stock format. Use only two decimal places')
    .required('Please Enter Minimum Stock'),
  maximumStock: Yup.string()
    .matches(/^\d+(\.\d{0,2})?$/, 'Invalid Maximum stock format. Use only two decimal places')
    .required('Please Enter Maximum Stock'),
  unit: Yup.string().max(255).required('Please Enter Unit')
});

export default function AddProductForm() {
  const navigation = useNavigate();
  const [sgstTaxRender, setSgstTaxRender] = React.useState<number | null>();

  const [cgstTaxRender, setCgstTaxRender] = React.useState<number | null>();

  const [igstTaxRender, setIgstTaxRender] = React.useState<number | null>();
  const companyId: string = String(config.companyId);
  const formik = useFormik({
    initialValues: getInitialValues(),
    enableReinitialize: true,
    validationSchema: AddProductSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const productdata = {
          companyId: companyId,
          productName: values.productName,
          unitId: values.unitId,
          unit: values.unit,
          categoryId: values.categoryId,
          categoryName: values.categoryName,
          description: values.description,
          hsnCode: String(values.hsnCode),
          sac: String(values.hsnCode),
          purchasePrice: values.purchasePrice,
          sellingPrice: values.sellingPrice,
          cgst: values.cgst,
          sgst: values.sgst,
          igst: values.igst,
          openingStock: values.openingStock,
          minimumStock: values.minimumStock,
          vendorId: values.vendorId,
          vendorName: values.vendorName,
          taxCategoryId: values.taxCategoryId,
          maximumStock: values.maximumStock
        };

        const response = await createProductRequest(productdata);
        if ((response.status = 200)) {
          dispatch(
            openSnackbar({
              open: true,
              message: 'Product save successfully.',
              anchorOrigin: { vertical: 'top', horizontal: 'right' },
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
          );
          navigation('/inventory/products/list');
        }
        // else{
        //   const errors = response.data.errors;

        //   errors.forEach((errorItem: { propertyName: string; errorMessage: string }) => {
        //     const propertyName = errorItem.propertyName;
        //     const errorMessage = errorItem.errorMessage;

        //     formik.setFieldError(propertyName, errorMessage);
        //   });
        // }
        setSubmitting(false);
      } catch (error) {}
    }
  });

  const { vendorNames } = useVendors(companyId);
  const { unitNames } = useUnits(companyId);
  const { categories } = useCategories(companyId);
  const { taxCategories } = useTaxCategories();

  const { errors, touched, handleSubmit, handleChange } = formik;
  return (
    <>
      <MainCard>
        <FormikProvider value={formik}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Grid item container spacing={2.5}>
                <Grid item xs={12} sm={4}>
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
                      id="productName"
                      name="productName"
                      placeholder="Enter product name"
                      fullWidth
                      error={Boolean(touched.productName && errors.productName)}
                      helperText={touched.productName && typeof errors.productName === 'string' ? errors.productName : ''}
                      onBlur={formik.handleBlur}
                      onChange={(e) => {
                        formik.handleChange(e);
                        formik.setFieldTouched('productName', false);
                        formik.setFieldError('productName', '');
                      }}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Stack spacing={0.5} alignItems="left" justifyContent="start" sx={{ display: 'flex', flexDirection: 'column' }}>
                    <InputLabel>
                      <Stack direction={'row'}>
                        <Typography variant="inherit" color="textPrimary">
                          Unit
                        </Typography>
                        <Typography variant="inherit" color="error">
                          *
                        </Typography>
                      </Stack>
                    </InputLabel>
                    <FormControl sx={{ width: '100%' }} error={Boolean(touched.unit && errors.unit)}>
                      {unitNames && unitNames.length > 0 ? (
                        <Autocomplete
                          onChange={(event: any, newValue: { id: string; name: string } | null) => {
                            formik.setFieldTouched('unit', false);
                            if (newValue !== null) {
                              handleChange({ target: { name: 'unit', value: newValue.name } });
                              formik.setFieldValue('unitId', newValue.id);
                            } else {
                              handleChange({ target: { name: 'unit', value: '' } });
                              formik.setFieldValue('unitId', '');
                            }
                          }}
                          id="unitnameslist"
                          options={unitNames}
                          getOptionLabel={(option) => option.name}
                          renderInput={(params) => (
                            <TextField
                              placeholder="Enter Unit"
                              {...params}
                              error={Boolean(touched.unit && errors.unit && formik.submitCount > 0)}
                              helperText={touched.unit && formik.submitCount > 0 && typeof errors.unit === 'string' ? errors.unit : ''}
                            />
                          )}
                        />
                      ) : (
                        <Box display="flex" flexDirection="row" alignItems="left" justifyContent="left" height="100px" padding={'10'}>
                          <CircularProgress size={20} thickness={4} style={{ marginRight: '10px' }} />
                          <Grid flexDirection={'column'}>
                            <Typography variant="body1" style={{ marginTop: '32x', fontSize: '12px' }}>
                              Loading Unit List...
                            </Typography>
                          </Grid>
                        </Box>
                      )}
                    </FormControl>
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Stack spacing={0.5} alignItems="left" justifyContent="start">
                    <InputLabel>
                      <Stack direction={'row'}>
                        <Typography variant="inherit" color="textPrimary">
                          Tax Category
                        </Typography>
                        <Typography variant="inherit" color="error">
                          *
                        </Typography>
                      </Stack>
                    </InputLabel>
                    <FormControl sx={{ width: '100%' }} error={Boolean(touched.taxCategoryId && errors.taxCategoryId)}>
                      {taxCategories && taxCategories.length > 0 ? (
                        <Autocomplete
                          onChange={(
                            event: any,
                            newValue: { id: number; name: string; cGstRate: number; sGstRate: number; iGstRate: number } | null
                          ) => {
                            formik.setFieldTouched('taxCategoryId', false);
                            if (newValue !== null) {
                              handleChange({ target: { name: 'taxCategoryId', value: newValue.id } });
                              formik.setFieldValue('taxCategoryId', newValue.id);
                              formik.setFieldValue('cgst', newValue.cGstRate);
                              formik.setFieldValue('sgst', newValue.sGstRate);
                              formik.setFieldValue('igst', newValue.iGstRate);
                              setSgstTaxRender(newValue.sGstRate);
                              setCgstTaxRender(newValue.cGstRate);
                              setIgstTaxRender(newValue.iGstRate);
                            } else {
                              formik.setFieldValue('taxCategoryId', '');
                            }
                          }}
                          id="taxcategorynamelist"
                          options={taxCategories}
                          getOptionLabel={(option) => option.name}
                          sx={{ width: '100%' }}
                          renderInput={(params) => (
                            <TextField
                              placeholder="Enter Tax Category"
                              {...params}
                              error={Boolean(touched.taxCategoryId && errors.taxCategoryId)}
                              helperText={touched.taxCategoryId && errors.taxCategoryId ? 'Please Enter Tax Category' : ''}
                            />
                          )}
                        />
                      ) : (
                        <Box display="flex" flexDirection="row" alignItems="left" justifyContent="left" height="100px" padding={'10'}>
                          <CircularProgress size={20} thickness={4} style={{ marginRight: '10px' }} />
                          <Grid flexDirection={'column'}>
                            <Typography variant="body1" style={{ marginTop: '32x', fontSize: '12px' }}>
                              Loading Tax Category List...
                            </Typography>
                          </Grid>
                        </Box>
                      )}
                    </FormControl>
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={8}>
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
                      name="description"
                      minRows={2}
                      maxRows={10}
                      placeholder="Enter description"
                      style={{
                        width: '100%',
                        resize: 'vertical',
                        border: '1px solid #ced4da',
                        borderRadius: '4px',
                        padding: '8px',
                        fontFamily: 'inherit'
                      }}
                      onChange={(e) => {
                        handleChange(e);
                        formik.setFieldValue('description', e.target.value);
                      }}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={4} container justifyContent="flex-start" direction="row" spacing={0.5}>
                  <Grid item xs={4} sm={4}>
                    <Stack spacing={0.5}>
                      <InputLabel>S GST Rate %</InputLabel>
                      <TextField
                        value={sgstTaxRender}
                        inputProps={{ style: { textAlign: 'right' } }}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          formik.setFieldTouched('sgst', false);
                          setSgstTaxRender(Number(event.target.value));
                          formik.setFieldValue('sgst', Number(event.target.value));
                        }}
                        id="sgstnameslist"
                        type="number"
                        sx={{ width: '100%' }}
                        error={Boolean(touched.sgst && errors.sgst)}
                        helperText={touched.sgst && errors.sgst ? 'Please Enter S GST Tax Rate' : ''}
                        InputProps={{
                          readOnly: true
                        }}
                      />
                    </Stack>
                  </Grid>

                  <Grid item xs={4} sm={4}>
                    <Stack spacing={0.5}>
                      <InputLabel>C GST Rate %</InputLabel>
                      <TextField
                        value={cgstTaxRender}
                        inputProps={{ style: { textAlign: 'right' } }}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          formik.setFieldTouched('cgst', false);
                          setCgstTaxRender(Number(event.target.value));
                          formik.setFieldValue('cgst', Number(event.target.value));
                        }}
                        id="cgstnameslist"
                        type="number"
                        sx={{ width: '100%' }}
                        error={Boolean(touched.cgst && errors.cgst)}
                        helperText={touched.cgst && errors.cgst ? 'Please Enter C GST Tax Rate' : ''}
                        InputProps={{
                          readOnly: true
                        }}
                      />
                    </Stack>
                  </Grid>

                  <Grid item xs={4} sm={4}>
                    <Stack spacing={0.5}>
                      <InputLabel>I GST Rate %</InputLabel>
                      <TextField
                        value={igstTaxRender}
                        inputProps={{ style: { textAlign: 'right' } }}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          formik.setFieldTouched('igst', false);
                          setIgstTaxRender(Number(event.target.value));
                          formik.setFieldValue('igst', Number(event.target.value));
                        }}
                        id="igstnameslist"
                        type="number"
                        sx={{ width: '100%' }}
                        error={Boolean(touched.igst && errors.igst)}
                        helperText={touched.igst && errors.igst ? 'Please Enter I GST Tax Rate' : ''}
                        InputProps={{
                          readOnly: true
                        }}
                      />
                    </Stack>
                  </Grid>
                </Grid>

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
                      type="number"
                      id="hsncodenumbers"
                      name="hsnCode"
                      placeholder="Enter HSN/SAC No."
                      inputProps={{
                        style: { textAlign: 'right' },
                        minLength: 4,
                        maxLength: 8,
                        onInput: (e: React.ChangeEvent<HTMLInputElement>) => {
                          const inputValue = e.target.value;
                          if (inputValue.length > 8) {
                            e.target.value = inputValue.slice(0, 8);
                          }
                        }
                      }}
                      error={Boolean(touched.hsnCode && errors.hsnCode)}
                      helperText={touched.hsnCode && typeof errors.hsnCode === 'string' ? errors.hsnCode : ''}
                      onBlur={(e) => {
                        formik.handleBlur(e);
                        formik.setFieldTouched('hsnCode', true, false);
                      }}
                      onChange={(e) => {
                        formik.handleChange(e);
                        formik.setFieldTouched('hsnCode', true, false);
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
                      type="number"
                      id="purchasepricerate"
                      name="purchasePrice"
                      placeholder="Enter Buying Price"
                      fullWidth
                      inputProps={{ style: { textAlign: 'right' } }}
                      error={Boolean(touched.purchasePrice && errors.purchasePrice)}
                      helperText={touched.purchasePrice && typeof errors.purchasePrice === 'string' ? errors.purchasePrice : ''}
                      onBlur={formik.handleBlur}
                      onChange={(e) => {
                        formik.handleChange(e);
                        formik.setFieldTouched('purchasePrice', true, false);
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
                      type="number"
                      id="sellingPrice"
                      required
                      placeholder="Enter Selling Price"
                      inputProps={{ style: { textAlign: 'right' } }}
                      error={Boolean(touched.sellingPrice && errors.sellingPrice)}
                      helperText={touched.sellingPrice && typeof errors.sellingPrice === 'string' ? errors.sellingPrice : ''}
                      onBlur={formik.handleBlur}
                      onChange={(e) => {
                        formik.handleChange(e);
                        formik.setFieldTouched('sellingPrice', true, false);
                      }}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Stack spacing={0.5} alignItems="left" justifyContent="start">
                    <InputLabel>
                      <Stack direction={'row'}>
                        <Typography variant="inherit" color="textPrimary">
                          Category
                        </Typography>
                        <Typography variant="inherit" color="error">
                          *
                        </Typography>
                      </Stack>
                    </InputLabel>
                    <FormControl sx={{ width: '100%' }} error={Boolean(touched.categoryName && errors.categoryName)}>
                      {categories && categories.length > 0 ? (
                        <Autocomplete
                          onChange={(event: any, newValue: { id: string; name: string } | null) => {
                            formik.setFieldTouched('categoryName', false);
                            if (newValue !== null) {
                              handleChange({ target: { name: 'categoryName', value: newValue.name } });
                              formik.setFieldValue('categoryId', newValue.id);
                            } else {
                              handleChange({ target: { name: 'categoryName', value: '' } });
                              formik.setFieldValue('categoryId', '');
                            }
                          }}
                          id="categorynameslist"
                          options={categories}
                          getOptionLabel={(option) => option.name}
                          sx={{ width: '100%' }}
                          renderInput={(params) => (
                            <TextField
                              placeholder="Enter Category"
                              {...params}
                              error={Boolean(touched.categoryName && errors.categoryName)}
                              helperText={touched.categoryName && errors.categoryName ? 'Please Enter Product Category' : ''}
                            />
                          )}
                        />
                      ) : (
                        <Box display="flex" flexDirection="row" alignItems="left" justifyContent="left" height="100px" padding={'10'}>
                          <CircularProgress size={20} thickness={4} style={{ marginRight: '10px' }} />
                          <Grid flexDirection={'column'}>
                            <Typography variant="body1" style={{ marginTop: '32x', fontSize: '12px' }}>
                              Loading Category List...
                            </Typography>
                          </Grid>
                        </Box>
                      )}
                    </FormControl>
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Stack spacing={0.5} alignItems="left" justifyContent="start">
                    <InputLabel>
                      <Stack direction={'row'}>
                        <Typography variant="inherit" color="textPrimary">
                          Sub-Category
                        </Typography>
                      </Stack>
                    </InputLabel>
                    <FormControl>
                      <TextField placeholder="Enter Sub-Category" />
                    </FormControl>
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Stack spacing={0.5} alignItems="left" justifyContent="start">
                    <InputLabel>
                      <Stack direction={'row'}>
                        <Typography variant="inherit" color="textPrimary">
                          Preferred Supplier
                        </Typography>
                        <Typography variant="inherit" color="error">
                          *
                        </Typography>
                      </Stack>
                    </InputLabel>
                    <FormControl sx={{ width: '100%' }} error={Boolean(touched.vendorName && errors.vendorName)}>
                      {vendorNames && vendorNames.length > 0 ? (
                        <Autocomplete
                          onChange={(event: any, newValue: { id: string; name: string } | null) => {
                            formik.setFieldTouched('vendorName', false);
                            if (newValue !== null) {
                              handleChange({ target: { name: 'vendorName', value: newValue.name } });
                              formik.setFieldValue('vendorId', newValue.id);
                            } else {
                              handleChange({ target: { name: 'vendorName', value: '' } });
                              formik.setFieldValue('vendorId', '');
                            }
                          }}
                          id="preferredsuppliernameslist"
                          options={vendorNames}
                          getOptionLabel={(option) => option.name}
                          renderInput={(params) => (
                            <TextField
                              placeholder="Enter Preferred Supplier"
                              {...params}
                              error={Boolean(touched.vendorName && errors.vendorName && formik.submitCount > 0)}
                              helperText={
                                touched.vendorName && formik.submitCount > 0 && typeof errors.vendorName === 'string'
                                  ? errors.vendorName
                                  : ''
                              }
                            />
                          )}
                        />
                      ) : (
                        <Box display="flex" flexDirection="row" alignItems="left" justifyContent="left" height="100px" padding={'10'}>
                          <CircularProgress size={20} thickness={4} style={{ marginRight: '10px' }} />
                          <Grid flexDirection={'column'}>
                            <Typography variant="body1" style={{ marginTop: '32x', fontSize: '12px' }}>
                              Loading Suppler List...
                            </Typography>
                          </Grid>
                        </Box>
                      )}
                    </FormControl>
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Stack spacing={0.5} alignItems="left" justifyContent="start" sx={{ display: 'flex', flexDirection: 'column' }}>
                    <InputLabel>
                      <Stack direction={'row'}>
                        <Typography variant="inherit" color="textPrimary">
                          Initial Stock
                        </Typography>
                        <Typography variant="inherit" color="error">
                          *
                        </Typography>
                      </Stack>
                    </InputLabel>
                    <TextField
                      fullWidth
                      id="openingStock"
                      required
                      type="number"
                      placeholder="Enter Initial Stock"
                      inputProps={{ style: { textAlign: 'right' } }}
                      error={Boolean(touched.openingStock && errors.openingStock)}
                      helperText={touched.openingStock && typeof errors.openingStock === 'string' ? errors.openingStock : ''}
                      onBlur={formik.handleBlur}
                      onChange={(e) => {
                        formik.handleChange(e);
                        formik.setFieldTouched('openingStock', true, false);
                      }}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Stack spacing={0.5} alignItems="left" justifyContent="start" sx={{ display: 'flex', flexDirection: 'column' }}>
                    <InputLabel>
                      <Stack direction={'row'}>
                        <Typography variant="inherit" color="textPrimary">
                          Minimum Stock
                        </Typography>
                        <Typography variant="inherit" color="error">
                          *
                        </Typography>
                      </Stack>
                    </InputLabel>
                    <TextField
                      fullWidth
                      id="minimumStock"
                      required
                      type="number"
                      placeholder="Enter Minimum Stock"
                      inputProps={{ style: { textAlign: 'right' } }}
                      error={Boolean(touched.minimumStock && errors.minimumStock)}
                      helperText={touched.minimumStock && typeof errors.minimumStock === 'string' ? errors.minimumStock : ''}
                      onBlur={formik.handleBlur}
                      onChange={(e) => {
                        formik.handleChange(e);
                        formik.setFieldTouched('minimumStock', true, false);
                      }}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Stack spacing={0.5} alignItems="left" justifyContent="start" sx={{ display: 'flex', flexDirection: 'column' }}>
                    <InputLabel>
                      <Stack direction={'row'}>
                        <Typography variant="inherit" color="textPrimary">
                          Maximum Stock
                        </Typography>
                        <Typography variant="inherit" color="error">
                          *
                        </Typography>
                      </Stack>
                    </InputLabel>
                    <TextField
                      fullWidth
                      id="maximumStock"
                      required
                      type="number"
                      placeholder="Enter Maximum Stock"
                      inputProps={{ style: { textAlign: 'right' } }}
                      error={Boolean(touched.maximumStock && errors.maximumStock)}
                      helperText={touched.maximumStock && typeof errors.maximumStock === 'string' ? errors.maximumStock : ''}
                      onBlur={formik.handleBlur}
                      onChange={(e) => {
                        formik.handleChange(e);
                        formik.setFieldTouched('maximumStock', true, false);
                      }}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={12} sx={{ marginLeft: 4.5, marginBottom: 2.5 }}>
                  <DialogActions sx={{ p: 2.5 }}>
                    <Grid item container justifyContent="flex-end" alignItems={'end'}>
                      <Grid item>
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                          <Button type="submit" color="primary" variant="contained">
                            Save
                          </Button>
                          <Button variant="contained" color="error">
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
