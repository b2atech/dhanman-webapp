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
import React, { useEffect, useState } from 'react';
import { useFormik, FormikProvider, Form, FormikValues } from 'formik';
import * as Yup from 'yup';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MainCard from 'components/MainCard';
import { getAllVendors } from 'api/services/BillService';
import { openSnackbar } from 'store/reducers/snackbar';
import { dispatch } from 'store';
import { createProductRequest, getAllCategories, getAllTaxCategory, getAllUnits } from 'api/services/InventoryService';
import { useNavigate } from 'react-router';
// ==============================|| ADD PRODUCTS  ||============================== //

const getInitialValues = (inventroydata?: FormikValues | null) => {
  if (inventroydata) {
    const newProduct = {
      clientId: inventroydata.clientId,
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
      clientId: '',
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

const sgsttaxrate = [0, 2, 4, 5, 9, 12, 18, 28];
const cgsttaxrate = [0, 2, 4, 5, 9, 12, 18, 28];
const igsttaxrate = [0, 2, 4, 5, 9, 12, 18, 28];

export default function AddProductForm() {
  const navigation = useNavigate();
  const [sgstTaxRender, setSgstTaxRender] = React.useState<number | null>(sgsttaxrate[0]);

  const [cgstTaxRender, setCgstTaxRender] = React.useState<number | null>(cgsttaxrate[0]);

  const [igstTaxRender, setIgstTaxRender] = React.useState<number | null>(igsttaxrate[0]);

  const formik = useFormik({
    initialValues: getInitialValues(),
    enableReinitialize: true,
    validationSchema: AddProductSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const productdata = {
          clientId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
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
        if (response === 200) {
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
        setSubmitting(false);
      } catch (error) {
        console.error(error);
      }
    }
  });

  const [vendorName, setVendorNames] = useState<any>();
  const [unitName, setUnitNames] = useState<any>();
  const [categories, setCategories] = useState<any>();
  const [taxCategories, setTaxCategories] = useState<any>();

  useEffect(() => {
    getAllVendors('59ac0567-d0ac-4a75-91d5-b5246cfa8ff3')
      .then((vendorList) => {
        if (Array.isArray(vendorList)) {
          const names = vendorList.map((vendor) => ({
            id: vendor.id,
            name: `${vendor.firstName} ${vendor.lastName}`
          }));
          setVendorNames(names);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    getAllUnits('3fa85f64-5717-4562-b3fc-2c963f66afa6')
      .then((unitList) => {
        if (Array.isArray(unitList)) {
          const names = unitList.map((unit) => ({
            id: unit.id,
            name: `${unit.unitName}`
          }));
          setUnitNames(names);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    getAllCategories('3fa85f64-5717-4562-b3fc-2c963f66afa6')
      .then((categoryList) => {
        if (Array.isArray(categoryList)) {
          const names = categoryList.map((category) => ({
            id: category.id,
            name: `${category.categoryName}`
          }));
          setCategories(names);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    getAllTaxCategory()
      .then((taxCategoryList) => {
        if (Array.isArray(taxCategoryList)) {
          console.log(taxCategoryList);
          const names = taxCategoryList.map((taxcategory) => ({
            id: taxcategory.id,
            name: taxcategory.name,
            cGstRate: taxcategory.cGstRate,
            sGstRate: taxcategory.sGstRate,
            iGstRate: taxcategory.iGstRate
          }));
          console.log('Mapped Names:', names);
          setTaxCategories(names);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

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
                      {unitName && unitName.length > 0 ? (
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
                          options={unitName}
                          getOptionLabel={(option) => option.name}
                          renderInput={(params) => (
                            <TextField
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
                      <Autocomplete
                        value={sgstTaxRender}
                        onChange={(event: any, newValue: number | null) => {
                          formik.setFieldTouched('sgst', false);
                          setSgstTaxRender(newValue);
                          formik.setFieldValue('sgst', newValue);
                        }}
                        id="sgstnameslist"
                        options={sgsttaxrate}
                        sx={{ width: '100%' }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            type="number"
                            error={Boolean(touched.sgst && errors.sgst)}
                            helperText={touched.sgst && errors.sgst ? 'Please Enter S GST Tax Rate' : ''}
                          />
                        )}
                      />
                    </Stack>
                  </Grid>

                  <Grid item xs={4} sm={4}>
                    <Stack spacing={0.5}>
                      <InputLabel>C GST Rate %</InputLabel>
                      <Autocomplete
                        value={cgstTaxRender}
                        onChange={(event: any, newValue: number | null) => {
                          formik.setFieldTouched('cgst', false);
                          setCgstTaxRender(newValue);
                          formik.setFieldValue('cgst', newValue);
                        }}
                        id="cgstnameslist"
                        options={cgsttaxrate}
                        sx={{ width: '100%' }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            type="number"
                            error={Boolean(touched.cgst && errors.cgst)}
                            helperText={touched.cgst && errors.cgst ? 'Please Enter C GST Tax Rate' : ''}
                          />
                        )}
                      />
                    </Stack>
                  </Grid>

                  <Grid item xs={4} sm={4}>
                    <Stack spacing={0.5}>
                      <InputLabel>I GST Rate %</InputLabel>
                      <Autocomplete
                        value={igstTaxRender}
                        onChange={(event: any, newValue: number | null) => {
                          formik.setFieldTouched('igst', false);
                          setIgstTaxRender(newValue);
                          formik.setFieldValue('igst', newValue);
                        }}
                        id="igstnameslist"
                        options={igsttaxrate}
                        sx={{ width: '100%' }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            type="number"
                            error={Boolean(touched.igst && errors.igst)}
                            helperText={touched.igst && errors.igst ? 'Please Enter I GST Tax Rate' : ''}
                          />
                        )}
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
                      <TextField />
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
                      {vendorName && vendorName.length > 0 ? (
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
                          options={vendorName}
                          getOptionLabel={(option) => option.name}
                          renderInput={(params) => (
                            <TextField
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
