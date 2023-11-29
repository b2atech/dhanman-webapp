// material-ui
import { Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, InputLabel, Stack, TextField } from '@mui/material';
import { CloseOutlined } from '@ant-design/icons';
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
import { createProductRequest, updateProductRequest } from 'api/services/InventoryService';
//import { Inventory } from '@mui/icons-material';

// constant
const getInitialValues = (product: FormikValues | null) => {
  if (product) {
    const newProduct = {
      id: product.id,
      clientId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      productName: product.productName,
      description: product.description,
      unit: product.unit,
      categoryName: product.categoryName,
      hsnCode: product.hsnCode,
      sac: product.sac,
      purchasePrice: product.purchasePrice,
      sellingPrice: product.sellingPrice,
      cgst: product.cgst,
      sgst: product.sgst,
      igst: product.igst,
      openingStock: product.openingStock,
      minimumStock: product.minimumStock,
      vendorName: product.vendorName
    };
    return newProduct;
  } else {
    const newProduct = {
      id: '',
      clientId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      productName: '',
      description: '',
      unit: '',
      categoryName: '',
      hsnCode: '',
      sac: '',
      purchasePrice: '',
      sellingPrice: '',
      cgst: '',
      sgst: '',
      igst: '',
      openingStock: '',
      minimumStock: '',
      vendorName: ''
    };
    return newProduct;
  }
};

// ==============================|| PRODUCT ADD / EDIT ||============================== //

export interface Props {
  product?: any;
  onCancel: () => void;
}

const AddProduct = ({ product, onCancel }: Props) => {
  const ProductSchema = Yup.object().shape({
    productName: Yup.string().max(255).required('Please Enter Product Name'),
    description: Yup.string().max(255).required('Please Enter Description')
  });

  const formik = useFormik({
    initialValues: getInitialValues(product!),
    enableReinitialize: true,
    validationSchema: ProductSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const InventoryData = {
          productId: values.id,
          clientId: values.clientId,
          productName: values.productName,
          description: values.description,
          vendorId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          unitId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          categoryId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          unit: values.unit,
          categoryName: values.categoryName,
          hsnCode: values.hsnCode,
          sac: values.sac,
          purchasePrice: values.purchasePrice,
          sellingPrice: values.sellingPrice,
          cgst: values.cgst,
          sgst: values.sgst,
          igst: values.igst,
          openingStock: values.openingStock,
          minimumStock: values.minimumStock,
          vendorName: values.vendorName
        };

        if (product) {
          const response = await updateProductRequest(InventoryData);
          if (response === 204) {
            dispatch(
              openSnackbar({
                open: true,
                message: 'Product updated successfully.',
                anchorOrigin: { vertical: 'top', horizontal: 'right' },
                variant: 'alert',
                alert: {
                  color: 'success'
                },
                close: false
              })
            );
            window.location.reload();
          }
        } else {
          const response = await createProductRequest(InventoryData);
          if (response === 200) {
            dispatch(
              openSnackbar({
                open: true,
                message: 'Product added successfully.',
                anchorOrigin: { vertical: 'top', horizontal: 'right' },
                variant: 'alert',
                alert: {
                  color: 'success'
                },
                close: false
              })
            );
            window.location.reload();
          }
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
              <DialogTitle>{product ? 'Edit Product' : 'New Product'}</DialogTitle>
              <IconButton shape="rounded" type="reset" color="error" onClick={onCancel} style={{ marginRight: '5px' }}>
                <CloseOutlined />
              </IconButton>
            </Stack>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid item xs={12} md={8}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="product-name">Product Name</InputLabel>
                      <TextField
                        autoFocus
                        fullWidth
                        id="productName"
                        type="text"
                        placeholder="Enter Product Name"
                        {...getFieldProps('productName')}
                        error={Boolean(touched.productName && errors.productName)}
                        helperText={touched.productName && errors.productName ? 'Please Enter Product Name' : ''}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="description">Description</InputLabel>
                      <TextField
                        fullWidth
                        id="description"
                        type="text"
                        placeholder="Enter description"
                        {...getFieldProps('description')}
                        error={Boolean(touched.description && errors.description)}
                        helperText={touched.description && errors.description ? 'Please enter description' : ''}
                      />
                    </Stack>
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
                      {product ? 'Edit' : 'Add'}
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
    </>
  );
};

export default AddProduct;
