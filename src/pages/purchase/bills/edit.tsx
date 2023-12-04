import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third-party
import { format } from 'date-fns';
import { FieldArray, Form, Formik } from 'formik';
// import * as yup from 'yup';
import { v4 as UIDV4 } from 'uuid';

// project import
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import { reviewInvoicePopup, customerPopup, selectCountry } from 'store/reducers/invoice';
import { useDispatch, useSelector } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

// types
import { CountryType } from 'types/invoice';

//asset
import { PlusOutlined } from '@ant-design/icons';
import { IBillType } from 'types/bill';
import { getBillById, updateBillRequest } from 'api/services/BillService';
import { BillEdit, BillLine } from 'types/billiingDetails';
import AddressBillModal from 'sections/apps/bill/BillAddressModal';
import BillItem from 'sections/apps/bill/billItem';

// const validationSchema = yup.object({
//   date: yup.date().required('bill date is required'),
//   due_date: yup
//     .date()
//     .when('date', (date, schema) => date && schema.min(date, "Due date can't be before bill date"))
//     .nullable()
//     .required('Due date is required'),
//   vendorInfo: yup
//     .object({
//       name: yup.string().required('bill receiver information is required')
//     })
//     .required('bill receiver information is required'),
//   status: yup.string().required('Status selection is required'),
//   bill_detail: yup
//     .array()
//     .required('bill details is required')
//     .of(
//       yup.object().shape({
//         name: yup.string().required('Product name is required')
//       })
//     )
//     .min(1, 'bill must have at least 1 items')
// });

// ==============================|| Bill - EDIT ||============================== //

const EditBill = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const [list1, setList] = useState<IBillType>();

  const [loading, setLoading] = useState<boolean>(true);
  const { isCustomerOpen, countries, country, list } = useSelector((state) => state.invoice);

  useEffect(() => {
    if (id) {
      getBillById(id).then((bill) => {
        setList(bill);
        setLoading(false);
      });
    }
  }, [id]);

  const notesLimit: number = 500;

  const handlerEdit = (values: any) => {
    const updateBill: BillEdit = {
      billHeaderId: values.id,
      discount: Number(values.discount),
      tax: Number(values.tax),
      billDate: format(values.date, 'yyyy-MM-dd'),
      dueDate: format(values.due_date, 'yyyy-MM-dd'),
      totalAmount: Number(values.totalAmount),
      currency: 'INR',
      vendorId: values.vendorInfo.id,
      note: values.notes
    };

    updateBill.lines = values.bill_detail.map((billItem: any) => {
      let billLine = {} as BillLine;
      billLine.amount = parseInt(billItem.price) * billItem.quantity;
      billLine.name = billItem.name;
      billLine.description = billItem.description;
      billLine.quantity = billItem.quantity;
      billLine.price = billItem.price;
      billLine.id = billItem.id;
      return billLine;
    });
    console.log(updateBill);
    updateBillRequest(updateBill).then(() => {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Bill Updated successfully',
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      );
      navigation('/purchase/bills/list');
    });
  };

  if (loading) return <Loader />;

  return (
    <MainCard>
      <Formik
        enableReinitialize={true}
        initialValues={{
          id: list1?.id || '',
          billNumber: list1?.billNumber,
          bill_id: list1?.billNumber || '',
          status: list1?.billStatus || '',
          date: new Date(list1?.billDate!) || null,
          due_date: new Date(list1?.dueDate!) || null,
          cashierInfo: list?.cashierInfo || null,
          vendorInfo: {
            id: list1?.vendor.id,
            phoneNumber: list1?.vendor.phoneNumber,
            email: list1?.vendor.email,
            firstName: list1?.vendor.firstName,
            lastName: list1?.vendor.lastName,
            city: list1?.vendor.city
          },
          bill_detail: list1?.lines || [],
          discount: list1?.discount || 0,
          tax: list1?.tax || 0,
          notes: list1?.note || '',
          totalAmount: list1?.totalAmount
        }}
        // validationSchema={validationSchema}
        onSubmit={(values) => {
          handlerEdit(values);
        }}
      >
        {({ handleBlur, errors, handleChange, handleSubmit, values, isValid, setFieldValue, touched }) => {
          const subtotal =
            values?.bill_detail?.reduce((prev, curr: any) => {
              if (curr.name.trim().length > 0) return prev + Number(curr.price * Math.floor(curr.quantity));
              else return prev;
            }, 0) || 0;
          const taxRate = (values?.tax * subtotal) / 100;
          const discountRate = (values.discount * subtotal) / 100;
          const total = subtotal - discountRate + taxRate;
          values.totalAmount = total;
          return (
            <Form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Stack spacing={1}>
                    <InputLabel>Bill No.</InputLabel>
                    <FormControl sx={{ width: '100%' }}>
                      <TextField
                        disabled
                        name="billNumber"
                        id="billNumber"
                        value={values.billNumber}
                        onChange={handleChange}
                        inputProps={{
                          maxLength: 16
                        }}
                      />
                    </FormControl>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Stack spacing={1}>
                    <InputLabel>Status</InputLabel>
                    <FormControl sx={{ width: '100%' }}>
                      <Select
                        value={values.status}
                        displayEmpty
                        name="status"
                        renderValue={(selected) => {
                          if (selected.length === 0) {
                            return <Box sx={{ color: 'secondary.400' }}>Select status</Box>;
                          }
                          return selected;
                        }}
                        onChange={handleChange}
                        error={Boolean(errors.status && touched.status)}
                      >
                        <MenuItem disabled value="">
                          Select status
                        </MenuItem>
                        <MenuItem value="Paid">Paid</MenuItem>
                        <MenuItem value="Unpaid">Unpaid</MenuItem>
                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                  {touched.status && errors.status && <FormHelperText error={true}>{errors.status}</FormHelperText>}
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Stack spacing={1}>
                    <InputLabel>Date</InputLabel>
                    <FormControl sx={{ width: '100%' }} error={Boolean(touched.date && errors.date)}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker format="dd/MM/yyyy" value={values.date} onChange={(newValue) => setFieldValue('date', newValue)} />
                      </LocalizationProvider>
                    </FormControl>
                  </Stack>
                  {touched.date && errors.date && <FormHelperText error={true}>{errors.date as string}</FormHelperText>}
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Stack spacing={1}>
                    <InputLabel>Due Date</InputLabel>
                    <FormControl sx={{ width: '100%' }} error={Boolean(touched.due_date && errors.due_date)}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          format="dd/MM/yyyy"
                          value={values.due_date}
                          onChange={(newValue) => setFieldValue('due_date', newValue)}
                        />
                      </LocalizationProvider>
                    </FormControl>
                  </Stack>
                  {touched.due_date && errors.due_date && <FormHelperText error={true}>{errors.due_date as string}</FormHelperText>}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <MainCard sx={{ minHeight: 168 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={8}>
                        <Stack spacing={2}>
                          <Typography variant="h5">From:</Typography>
                          <FormControl sx={{ width: '100%' }}>
                            <Typography color="secondary">Belle J. Richter</Typography>
                            <Typography color="secondary">1300 Cooks Mine, NM 87829</Typography>
                            <Typography color="secondary">305-829-7809</Typography>
                            <Typography color="secondary">belljrc23@gmail.com</Typography>
                          </FormControl>
                        </Stack>
                      </Grid>
                    </Grid>
                  </MainCard>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MainCard sx={{ minHeight: 168 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={8}>
                        <Stack spacing={2}>
                          <Typography variant="h5">To:</Typography>
                          <Stack sx={{ width: '100%' }}>
                            <Typography variant="subtitle1">{`${values?.vendorInfo?.firstName} ${values?.vendorInfo?.lastName}`}</Typography>
                            <Typography color="secondary">{values?.vendorInfo?.city}</Typography>
                            <Typography color="secondary">{values?.vendorInfo?.phoneNumber}</Typography>
                            <Typography color="secondary">{values?.vendorInfo?.email}</Typography>
                          </Stack>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box textAlign="right" color="grey.200">
                          <Button
                            size="small"
                            startIcon={<PlusOutlined />}
                            color="secondary"
                            variant="outlined"
                            onClick={() =>
                              dispatch(
                                customerPopup({
                                  isCustomerOpen: true
                                })
                              )
                            }
                          >
                            Add
                          </Button>
                          <AddressBillModal
                            open={isCustomerOpen}
                            setOpen={(value) =>
                              dispatch(
                                customerPopup({
                                  isCustomerOpen: value
                                })
                              )
                            }
                            handlerAddress={(value) => setFieldValue('vendorInfo', value)}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </MainCard>
                  {touched.vendorInfo && errors.vendorInfo && (
                    <FormHelperText error={true}>{errors?.vendorInfo?.firstName as string}</FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h5">Detail</Typography>
                </Grid>
                <Grid item xs={12}>
                  <FieldArray
                    name="bill_detail"
                    render={({ remove, push }) => {
                      return (
                        <>
                          <TableContainer>
                            <Table sx={{ minWidth: 650 }}>
                              <TableHead>
                                <TableRow>
                                  <TableCell>#</TableCell>
                                  <TableCell>Name</TableCell>
                                  <TableCell>Description</TableCell>
                                  <TableCell>Qty</TableCell>
                                  <TableCell>Price</TableCell>
                                  <TableCell align="right">Amount</TableCell>
                                  <TableCell align="right">Action</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {values?.bill_detail?.map((item: any, index: number) => (
                                  <TableRow key={item.id}>
                                    <TableCell>{values?.bill_detail.indexOf(item) + 1}</TableCell>
                                    <BillItem
                                      key={item.id}
                                      id={item.id}
                                      index={index}
                                      name={item.name}
                                      description={item.description}
                                      qty={item.quantity}
                                      price={item.price}
                                      onDeleteItem={(index: number) => remove(index)}
                                      onEditItem={handleChange}
                                      Blur={handleBlur}
                                      errors={errors}
                                      touched={touched}
                                    />
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          <Divider />
                          {touched.bill_detail && errors.bill_detail && !Array.isArray(errors?.bill_detail) && (
                            <Stack direction="row" justifyContent="center" sx={{ p: 1.5 }}>
                              <FormHelperText error={true}>{errors.bill_detail as string}</FormHelperText>
                            </Stack>
                          )}
                          <Grid container justifyContent="space-between">
                            <Grid item xs={12} md={8}>
                              <Box sx={{ pt: 2.5, pr: 2.5, pb: 2.5, pl: 0 }}>
                                <Button
                                  color="primary"
                                  startIcon={<PlusOutlined />}
                                  onClick={() =>
                                    push({
                                      id: UIDV4(),
                                      name: '',
                                      description: '',
                                      quantity: 1,
                                      price: '1.00'
                                    })
                                  }
                                  variant="dashed"
                                  sx={{ bgcolor: 'transparent !important' }}
                                >
                                  Add Item
                                </Button>
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <Grid container justifyContent="space-between" spacing={2} sx={{ pt: 2.5, pb: 2.5 }}>
                                <Grid item xs={6}>
                                  <Stack spacing={1}>
                                    <InputLabel>Discount(%)</InputLabel>
                                    <TextField
                                      type="number"
                                      fullWidth
                                      name="discount"
                                      id="discount"
                                      placeholder="0.0"
                                      value={values.discount}
                                      onChange={handleChange}
                                      inputProps={{
                                        min: 0
                                      }}
                                    />
                                  </Stack>
                                </Grid>
                                <Grid item xs={6}>
                                  <Stack spacing={1}>
                                    <InputLabel>Tax(%)</InputLabel>
                                    <TextField
                                      type="number"
                                      fullWidth
                                      name="tax"
                                      id="tax"
                                      placeholder="0.0"
                                      value={values.tax}
                                      onChange={handleChange}
                                      inputProps={{
                                        min: 0
                                      }}
                                    />
                                  </Stack>
                                </Grid>
                              </Grid>
                              <Grid item xs={12}>
                                <Stack spacing={2}>
                                  <Stack direction="row" justifyContent="space-between">
                                    <Typography color={theme.palette.grey[500]}>Sub Total:</Typography>
                                    <Typography>{country?.prefix + '' + subtotal.toFixed(2)}</Typography>
                                  </Stack>
                                  <Stack direction="row" justifyContent="space-between">
                                    <Typography color={theme.palette.grey[500]}>Discount:</Typography>
                                    <Typography variant="h6" color={theme.palette.success.main}>
                                      {country?.prefix + '' + discountRate.toFixed(2)}
                                    </Typography>
                                  </Stack>
                                  <Stack direction="row" justifyContent="space-between">
                                    <Typography color={theme.palette.grey[500]}>Tax:</Typography>
                                    <Typography>{country?.prefix + '' + taxRate.toFixed(2)}</Typography>
                                  </Stack>
                                  <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="subtitle1">Grand Total:</Typography>
                                    <Typography variant="subtitle1">
                                      {total % 1 === 0 ? country?.prefix + '' + total : country?.prefix + '' + total.toFixed(2)}
                                    </Typography>
                                  </Stack>
                                </Stack>
                              </Grid>
                            </Grid>
                          </Grid>
                        </>
                      );
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel>Notes</InputLabel>
                    <TextField
                      placeholder="Address"
                      rows={3}
                      value={values.notes}
                      multiline
                      name="notes"
                      onChange={handleChange}
                      inputProps={{
                        maxLength: notesLimit
                      }}
                      helperText={`${values.notes.length} / ${notesLimit}`}
                      sx={{
                        width: '100%',
                        '& .MuiFormHelperText-root': {
                          mr: 0,
                          display: 'flex',
                          justifyContent: 'flex-end'
                        }
                      }}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel>Set Currency*</InputLabel>
                    <FormControl sx={{ width: { xs: '100%', sm: 250 } }}>
                      <Autocomplete
                        id="country-select-demo"
                        fullWidth
                        options={countries}
                        defaultValue={countries[2]}
                        value={countries.find((option: CountryType) => option.code === country?.code)}
                        onChange={(event, value) => {
                          dispatch(
                            selectCountry({
                              country: value
                            })
                          );
                        }}
                        autoHighlight
                        getOptionLabel={(option) => option.label}
                        renderOption={(props, option) => (
                          <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                            {option.code && (
                              <img
                                loading="lazy"
                                width="20"
                                src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                                srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                                alt=""
                              />
                            )}
                            {option.label}
                          </Box>
                        )}
                        renderInput={(params) => {
                          const selected = countries.find((option: CountryType) => option.code === country?.code);
                          return (
                            <TextField
                              {...params}
                              name="phoneCode"
                              placeholder="Select"
                              InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                  <>
                                    {selected && selected.code !== '' && (
                                      <img
                                        style={{ marginRight: 6 }}
                                        loading="lazy"
                                        width="20"
                                        src={`https://flagcdn.com/w20/${selected.code.toLowerCase()}.png`}
                                        srcSet={`https://flagcdn.com/w40/${selected.code.toLowerCase()}.png 2x`}
                                        alt=""
                                      />
                                    )}
                                  </>
                                )
                              }}
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password'
                              }}
                            />
                          );
                        }}
                      />
                    </FormControl>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" justifyContent="flex-end" alignItems="flex-end" spacing={2} sx={{ height: '100%' }}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      disabled={!isValid}
                      sx={{ color: 'secondary.dark' }}
                      onClick={() =>
                        dispatch(
                          reviewInvoicePopup({
                            isOpen: true
                          })
                        )
                      }
                    >
                      Preview
                    </Button>
                    <Button color="primary" variant="contained" type="submit">
                      Update & Send
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </MainCard>
  );
};

export default EditBill;
