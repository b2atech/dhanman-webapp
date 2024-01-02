import { Button, Grid, Stack, Tooltip } from '@mui/material';

import MainCard from 'components/MainCard';

import {
  Autocomplete,
  InputLabel,
  FormControl,
  TextField,
  Box,
  FormHelperText,
  Typography,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TableBody,
  Table,
  Divider,
  FormControlLabel,
  Switch
  // Checkbox,
  // Tooltip
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AddressModal from 'sections/apps/invoice/AddressModal';
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'store';
import { toggleCustomerPopup, selectCountry, reviewInvoicePopup } from 'store/reducers/invoice';
import { customerPopup } from 'store/reducers/invoice';
import InvoiceItem from 'sections/apps/invoice/InvoiceItem';
import { useTheme } from '@mui/material/styles';
import { v4 as UIDV4 } from 'uuid';
import { InvoiceHeader_main, InvoiceLine } from 'types/invoiceDetails';
import { createInvoiceRequest, getInvoiceDefaultStatus } from 'api/services/SalesService';
import { openSnackbar } from 'store/reducers/snackbar';
import { CountryType } from 'types/invoice';
import InvoiceModal from 'sections/apps/invoice/InvoiceModal';
// third party
import * as yup from 'yup';
import { format } from 'date-fns';
import { FieldArray, Form, Formik } from 'formik';
import { useNavigate } from 'react-router';
import VendorAddressModel from 'sections/apps/bill/VendorAddressModel';
import { useEffect, useState } from 'react';
import { getAllProducts } from 'api/services/InventoryService';
import { openDrawer } from 'store/reducers/menu';
import { getCompanyDetail } from 'api/services/CommonService';
import Loader from 'components/Loader';

// assets
import { DeleteOutlined } from '@ant-design/icons';
import AlertProductDelete from '../../../sections/apps/invoice/AlertProductDelete';
import { FormattedMessage } from 'react-intl';
import config from 'config';

const validationSchema = yup.object({
  id: yup.string().required('Invoice ID is required'),
  invoiceNumber: yup.string().required('Invoice number is required'),
  status: yup.string().required('Status selection is required'),
  invoiceDate: yup.date().required('Invoice date is required'),
  due_date: yup
    .date()
    .when('invoiceDate', (invoiceDate, schema) => {
      return invoiceDate && schema.min(invoiceDate, "Due date can't be before invoice date");
    })
    .required('Due date is required'),
  customerInfo: yup
    .object({
      firstName: yup.string().required('Invoice receiver information is required')
    })
    .required('Invoice receiver information is required'),
  invoice_detail: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required('Product name is required'),
        description: yup.string(),
        qty: yup.number().min(1, 'Quantity must be at least 1'),
        price: yup.number().min(0, 'Price must be at least 0')
      })
    )
    .required('Invoice details is required')
    .min(1, 'Invoice must have at least 1 item'),
  discount: yup.number().min(0, 'Discount must be at least 0'),
  tax: yup.number().min(0, 'Tax must be at least 0'),
  note: yup.string().max(500, 'Notes cannot exceed 500 characters')
});

// ==============================|| INVOICE - CREATE ||============================== //

const Createinvoice = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { open, isCustomerOpen, country, countries, isOpen } = useSelector((state) => state.invoice);
  const notesLimit: number = 500;
  const navigation = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [soNoSoDate, setSoNoSoDate] = useState(false);
  const [showGSTRates, setShowGSTRates] = useState(false);
  const [discount, setDiscount] = useState(false);
  const [feesVisible, setFees] = useState(false);
  //const [defaultGSTRates, setDefaultGSTRates] = useState();
  const [defaultStatus, setDefaultStatus] = useState();
  const [loading, setLoading] = useState<boolean>(true);
  const [company, setCompany] = useState<any>();
  const [funcToDelete, setfuncToDelete] = useState<any>();
  const [itemUnderDeletion, setItemUnderDeletion] = useState<number>();
  const [isCustomerSelected, setIsCustomerSelected] = useState(false);

  const companyId: string = String(config.companyId);
  const handelDeleteItem = (func: any, index: number) => {
    setfuncToDelete(() => func);
    setItemUnderDeletion(index);
    setOpenDelete(true);
  };
  const addCommas = (number: string | number) => {
    const parsedNumber = typeof number === 'string' ? parseFloat(number) : number;
    const formattedNumber = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(parsedNumber);
    return formattedNumber;
  };
  const handlerCreate = (values: any) => {
    const invoice: InvoiceHeader_main = {
      id: Math.floor(Math.random() * 90000) + 10000,
      invoiceNumber: values.invoiceNumber,
      customer_name: values.cashierInfo?.name,
      email: values.cashierInfo?.email,
      avatar: Number(Math.round(Math.random() * 10)),
      discount: Number(values.discount),
      tax: Number(values.tax),
      invoiceDate: format(values.invoiceDate, 'yyyy-MM-dd'),
      dueDate: format(values.due_date, 'yyyy-MM-dd'),

      quantity: Number(
        values.invoice_detail?.reduce((sum: any, i: any) => {
          return sum + i.qty;
        }, 0)
      ),
      status: values.status,
      invoiceStatusId: 'f247baba-2aa4-4adf-9bd1-fa2dd8dd0d4d',
      totalAmount: Number(values.totalAmount),
      cashierInfo: values.cashierInfo,
      customerInfo: values.customerInfo,
      note: values.note,
      clientId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      currency: 'INR',
      paymentTerm: 6,
      coaId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      billPaymentId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      customerId: values.customerInfo.id,
      invoiceDetails: undefined,
      invoiceVoucher: 'YP002'
    };

    invoice.lines = values.invoice_detail.map((invoiceItem: any) => {
      let invoiceLine = {} as InvoiceLine;
      invoiceLine.amount = parseInt(invoiceItem.price) * invoiceItem.quantity;
      invoiceLine.name = invoiceItem.name;
      invoiceLine.description = invoiceItem.description;
      invoiceLine.quantity = invoiceItem.quantity;
      invoiceLine.price = invoiceItem.price;
      return invoiceLine;
    });

    createInvoiceRequest(invoice).then(() => {
      dispatch(
        openSnackbar({
          open: true,
          message: <FormattedMessage id="invoiceItemCreated" />,
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      );
      navigation('/sales/invoices/list');
    });
  };

  const [openDelete, setOpenDelete] = useState(false);
  const handleModalClose = (status: boolean) => {
    setOpenDelete(false);
    if (status) {
      funcToDelete(itemUnderDeletion);
      dispatch(
        openSnackbar({
          open: true,
          message: <FormattedMessage id="invoiceItemDeleted" />,
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      );
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productList = await getAllProducts(companyId);
        if (Array.isArray(productList)) {
          setProducts(productList);
          setIsCustomerSelected(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchProducts();
  }, [companyId]);

  useEffect(() => {
    const fetchDefaultStatus = async () => {
      try {
        const status = await getInvoiceDefaultStatus(companyId);
        setDefaultStatus(status.initialStatusName);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchDefaultStatus();
  }, [companyId]);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const companyName = await getCompanyDetail(companyId);
        setCompany(companyName);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    };
    fetchCompanyDetails();
  }, [companyId]);

  const addNextInvoiceHandler = () => {
    dispatch(
      reviewInvoicePopup({
        isOpen: false
      })
    );
  };
  dispatch(openDrawer(false));

  const handleCustomerSelected = (firstName: string | undefined) => {
    if (firstName) {
      console.log(`Customer selected with first name: ${firstName}`);
      setIsCustomerSelected(true);
      return '';
    } else {
      console.log('No customer selected');
      setIsCustomerSelected(false);
      return <Typography color="red">* Please select customer </Typography>;
    }
  };

  return (
    <MainCard>
      <Formik
        initialValues={{
          id: 120,
          invoiceNumber: null,
          status: 'Unpaid',
          invoiceDate: new Date(),
          due_date: null,
          cashierInfo: {
            name: 'Belle J. Richter',
            address: '1300 Cooks Mine, NM 87829',
            phone: '305-829-7809',
            email: 'belljrc23@gmail.com'
          },
          customerInfo: {
            phoneNumber: '',
            email: '',
            firstName: '',
            lastName: '',
            city: '',
            gstIn: '',
            addressLine: ''
          },
          invoice_detail: [
            {
              soNo: 0,
              soDate: '',
              name: '',
              description: '',
              quantity: 0,
              price: 0,
              amount: 0,
              fees: 0,
              discount: 0,
              taxableAmount: 0,
              cRt: 0,
              cgstAmount: 0,
              sRt: 0,
              sgstAmount: 0,
              iRt: 0,
              igstAmount: 0,
              soNoVisibility: soNoSoDate,
              rateVisibility: showGSTRates,
              discountVisibility: discount,
              feesVisibility: feesVisible
            }
          ],
          discount: 0,
          tax: 0,
          note: '',
          roundOff: 0,
          totalAmount: 0
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          handlerCreate(values);
        }}
      >
        {({ handleBlur, errors, handleChange, handleSubmit, values, isValid, setFieldValue, touched }) => {
          const subtotal = values?.invoice_detail.reduce((prev, curr: any) => {
            if (curr.name.trim().length > 0) return prev + Number(curr.price * curr.quantity);
            else return prev;
          }, 0);
          const formattedSubtotal = addCommas(subtotal);

          const taxRate = (values.tax * subtotal) / 100;
          const cgstAmount = values?.invoice_detail.reduce((prev, curr: any) => {
            if (curr.name.trim().length > 0)
              return (
                prev +
                Number((curr.cgst / 100) * (curr.price * curr.quantity + curr.fees - (curr.discount / 100) * curr.price * curr.quantity))
              );
            else return prev;
          }, 0);
          const formattedCGSTAmount = addCommas(cgstAmount);

          const sgstAmount = values?.invoice_detail.reduce((prev, curr: any) => {
            if (curr.name.trim().length > 0)
              return (
                prev +
                Number((curr.sgst / 100) * (curr.price * curr.quantity + curr.fees - (curr.discount / 100) * curr.price * curr.quantity))
              );
            else return prev;
          }, 0);
          const formattedSGSTAmount = addCommas(sgstAmount);

          const igstAmount = values?.invoice_detail.reduce((prev, curr: any) => {
            if (curr.name.trim().length > 0)
              return (
                prev +
                Number((curr.igst / 100) * (curr.price * curr.quantity + curr.fees - (curr.discount / 100) * curr.price * curr.quantity))
              );
            else return prev;
          }, 0);
          const formattedIGSTAmount = addCommas(igstAmount);

          const fees = values?.invoice_detail.reduce((prev, curr: any) => {
            const feeValue = Number(curr.fees) || 0;
            if (curr.name.trim().length > 0) return prev + feeValue;
            else return prev;
          }, 0);
          const formattedFees = addCommas(fees);

          const discountRate = values?.invoice_detail.reduce((prev, curr: any) => {
            const hasValidDiscount = curr.discount !== undefined && curr.discount !== null && !isNaN(curr.discount);
            const hasValidPrice = curr.price !== undefined && curr.price !== null && !isNaN(curr.price);
            const hasValidQuantity = curr.quantity !== undefined && curr.quantity !== null && !isNaN(curr.quantity);

            if (curr.name.trim().length > 0 && hasValidDiscount && hasValidPrice && hasValidQuantity) {
              const discount = -(curr.discount / 100) * curr.price * curr.quantity;
              return prev + Number(discount);
            } else {
              return prev;
            }
          }, 0);
          const formattedDiscount = addCommas(discountRate);

          const roundingAmount = subtotal + cgstAmount + sgstAmount + discountRate + fees;

          const grandAmount = Math.ceil(roundingAmount);
          const formattedGrandAmount = addCommas(grandAmount);

          const taxableAmount = subtotal + discountRate + fees;
          const formattedTaxableAmount = addCommas(taxableAmount);

          const roundingOff = grandAmount - roundingAmount;
          const formattedRoundingOff = addCommas(roundingOff);
          const discountStyle = {
            color: '#3EB489'
          };
          const cgstRate = values?.invoice_detail?.reduce((prev, curr: any) => {
            if (curr.name.trim().length > 0) return prev + Number(curr.cgst);
            else return prev;
          }, 0);
          const sgstRate = values?.invoice_detail?.reduce((prev, curr: any) => {
            if (curr.name.trim().length > 0) return prev + Number(curr.sgst);
            else return prev;
          }, 0);
          const igstRate = values?.invoice_detail?.reduce((prev, curr: any) => {
            if (curr.name.trim().length > 0) return prev + Number(curr.igst);
            else return prev;
          }, 0);
          return (
            <Form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={5} md={2}>
                  <Stack spacing={1}>
                    <InputLabel>Invoice No.</InputLabel>
                    <FormControl sx={{ width: '100%' }}>
                      <TextField
                        name="invoiceNumber"
                        id="invoiceNumber"
                        value={values.invoiceNumber}
                        onChange={handleChange}
                        inputProps={{
                          maxLength: 16
                        }}
                      />
                    </FormControl>
                  </Stack>
                  {touched.invoiceNumber && errors.invoiceNumber && (
                    <FormHelperText error={true}>{errors.invoiceNumber as string}</FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} sm={5} md={2}>
                  <Stack spacing={1}>
                    <InputLabel>Invoice Date</InputLabel>
                    <FormControl sx={{ width: '100%' }} error={Boolean(touched.invoiceDate && errors.invoiceDate)}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          format="dd/MM/yyyy"
                          value={values.invoiceDate}
                          onChange={(newValue) => setFieldValue('invoiceDate', newValue)}
                        />
                      </LocalizationProvider>
                    </FormControl>
                  </Stack>
                  {touched.invoiceDate && errors.invoiceDate && (
                    <FormHelperText error={true}>{errors.invoiceDate as string}</FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} sm={5} md={2}>
                  <Stack spacing={1}>
                    <InputLabel>Due Date</InputLabel>
                    <FormControl sx={{ width: '100%' }} error={Boolean(touched.due_date && errors.due_date)}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          format="dd/MM/yyyy"
                          value={values.due_date}
                          minDate={new Date()}
                          onChange={(newValue) => setFieldValue('due_date', newValue)}
                        />
                      </LocalizationProvider>
                    </FormControl>
                  </Stack>
                  {touched.due_date && errors.due_date && <FormHelperText error={true}>{errors.due_date as string}</FormHelperText>}
                </Grid>
                <Grid item xs={12} sm={5} md={4}>
                  <Stack spacing={1}>
                    <InputLabel>Currency*</InputLabel>
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
                              <img loading="lazy" width="20" src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`} alt="flag" />
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
                                        alt="flag"
                                      />
                                    )}
                                  </>
                                )
                              }}
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password' // disable autocomplete and autofill
                              }}
                            />
                          );
                        }}
                      />
                    </FormControl>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={5} md={2}>
                  <Grid container justifyContent="flex-end">
                    <Stack spacing={1}>
                      <InputLabel sx={{ color: 'grey', fontSize: '0.95rem' }}>Status : {defaultStatus}</InputLabel>
                    </Stack>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MainCard sx={{ minHeight: 130 }}>
                    <Grid container>
                      <Grid item xs={12} sm={8} md={5}>
                        <Stack spacing={2}>
                          <Typography variant="h5">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <span style={{ paddingRight: '10px' }}>From:</span>
                              <span style={{ whiteSpace: 'nowrap' }}>{company?.name || ''}</span>
                            </Box>
                            <Stack sx={{ width: '100%' }}>
                              <Typography color="secondary">{company?.email || ''}</Typography>
                              <Typography color="secondary">{`${company?.addressLine || ''} ,\u00A0\u00A0 ${
                                company?.phoneNumber || ''
                              }`}</Typography>
                              <Typography color="secondary">GSTIN: {company?.gstIn || ''}</Typography>
                            </Stack>
                          </Typography>
                          {loading ? <Loader /> : ''}
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box textAlign={{ xs: 'left', sm: 'right' }} color="grey.200">
                          <VendorAddressModel
                            open={open}
                            setOpen={(value) =>
                              dispatch(
                                toggleCustomerPopup({
                                  open: value
                                })
                              )
                            }
                            handlerVendorAddress={(address) => setFieldValue('vendorInfo', address)}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </MainCard>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MainCard sx={{ minHeight: 130 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={8}>
                        <Stack spacing={2}>
                          <Typography variant="h5">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <span style={{ paddingRight: '10px' }}>To:</span>
                              <span>{`${values?.customerInfo?.firstName} ${values?.customerInfo?.lastName}`}</span>
                            </Box>
                            <Stack sx={{ width: '100%' }}>
                              <Typography variant="subtitle1"></Typography>
                              <Typography color="secondary">
                                {values?.customerInfo?.addressLine && values?.customerInfo?.phoneNumber
                                  ? `${values.customerInfo.addressLine}, \u00A0\u00A0${values.customerInfo.phoneNumber}`
                                  : `${values?.customerInfo?.addressLine || ''} ${values?.customerInfo?.phoneNumber || ''}`}
                              </Typography>
                              <Typography color="secondary">{values?.customerInfo?.email}</Typography>
                              {values?.customerInfo?.gstIn && <Typography color="secondary">GSTIN: {values.customerInfo.gstIn}</Typography>}
                              {handleCustomerSelected(values?.customerInfo?.firstName)}
                            </Stack>
                          </Typography>
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
                            Select
                          </Button>
                          <AddressModal
                            open={isCustomerOpen}
                            setOpen={(value) =>
                              dispatch(
                                customerPopup({
                                  isCustomerOpen: value
                                })
                              )
                            }
                            handlerAddress={(value) => setFieldValue('customerInfo', value)}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </MainCard>
                  {touched.customerInfo && errors.customerInfo && (
                    <FormHelperText error={true}>{errors?.customerInfo?.firstName as string}</FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} sm={12} sx={{ marginTop: '-25px', marginBottom: '-20px' }}>
                  <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    style={{ opacity: isCustomerSelected ? 1 : 0.2, pointerEvents: isCustomerSelected ? 'auto' : 'none' }}
                  >
                    <Grid item xs={6} style={{ paddingRight: '0px', paddingLeft: '15px' }}>
                      <Typography variant="h5" style={{ margin: '0', padding: '15px 0' }}>
                        Details <span style={{ color: 'grey', fontSize: '0.9em' }}>(Note : )</span>
                      </Typography>
                    </Grid>
                    <Grid item xs={6} container justifyContent="flex-end" alignItems="center" style={{ paddingLeft: '5px' }}>
                      <Grid item style={{ marginLeft: 'auto' }}>
                        <FormControlLabel
                          control={
                            <Switch color="secondary" checked={soNoSoDate} onChange={() => setSoNoSoDate(!soNoSoDate)} name="soNoSoDate" />
                          }
                          label="So Number"
                          style={{ margin: '0' }}
                        />
                      </Grid>
                      <Grid item style={{ marginLeft: '5px' }}>
                        <FormControlLabel
                          control={<Switch checked={showGSTRates} onChange={() => setShowGSTRates(!showGSTRates)} name="showGSTRates" />}
                          label="GST Rates"
                          style={{ margin: '0' }}
                        />
                      </Grid>
                      <Grid item style={{ marginLeft: '5px' }}>
                        <FormControlLabel
                          control={<Switch color="success" checked={discount} onChange={() => setDiscount(!discount)} name="discount" />}
                          label="Discount"
                          style={{ margin: '0' }}
                        />
                      </Grid>
                      <Grid item style={{ marginLeft: '5px' }}>
                        <FormControlLabel
                          control={<Switch color="error" checked={feesVisible} onChange={() => setFees(!feesVisible)} name="fees" />}
                          label="Fees"
                          style={{ margin: '0' }}
                        />
                      </Grid>
                      {/* <Grid item style={{ marginLeft: '5px' }}>
                        <Tooltip title="Default GSt Rates">
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={defaultGSTRates}
                                onChange={() => setDefaultGSTRates(defaultGSTRates)} // Update the state with the new value
                                name="defaultGSTRates"
                              />
                            }
                            label=""
                          />
                        </Tooltip>
                      </Grid> */}
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} style={{ opacity: isCustomerSelected ? 1 : 0.2, pointerEvents: isCustomerSelected ? 'auto' : 'none' }}>
                  <FieldArray
                    name="invoice_detail"
                    render={({ remove, push }) => {
                      return (
                        <>
                          <TableContainer>
                            <Table sx={{ minWidth: 650 }}>
                              <TableHead>
                                <TableRow>
                                  <TableCell align="center" sx={{ padding: '2px 0px' }}>
                                    #
                                  </TableCell>
                                  {soNoSoDate && (
                                    <>
                                      <TableCell align="center" sx={{ padding: '2px 0px' }}>
                                        So No
                                      </TableCell>
                                      <TableCell align="center" sx={{ padding: '2px 0px' }}>
                                        So Date
                                      </TableCell>
                                    </>
                                  )}
                                  <TableCell align="center" sx={{ padding: '2px 0px' }}>
                                    Name
                                  </TableCell>
                                  <TableCell align="center" sx={{ padding: '2px 0px' }}>
                                    Description
                                  </TableCell>
                                  <TableCell align="center" sx={{ padding: '2px 0px', width: '20px' }} width={20}>
                                    Qty
                                  </TableCell>
                                  <TableCell align="center" sx={{ padding: '2px 0px' }}>
                                    Price
                                  </TableCell>
                                  {feesVisible && (
                                    <TableCell align="center" sx={{ padding: '2px 0px', color: 'red' }}>
                                      Fees
                                    </TableCell>
                                  )}
                                  {discount && (
                                    <TableCell align="center" sx={{ padding: '2px 0px', color: '#008F0D' }}>
                                      Discount (%)
                                    </TableCell>
                                  )}
                                  <TableCell align="center" sx={{ padding: '2px 0px' }}>
                                    Taxable Amt
                                  </TableCell>
                                  {showGSTRates && (
                                    <>
                                      <TableCell align="center" sx={{ padding: '2px 0px', color: 'Highlight' }}>
                                        CGST (%)
                                      </TableCell>
                                    </>
                                  )}
                                  <TableCell align="center" sx={{ padding: '2px 0px' }}>
                                    <Tooltip title={`CGST Rate : ${cgstRate} (%)`} placement="top">
                                      <span>CGST Amt</span>
                                    </Tooltip>
                                  </TableCell>
                                  {showGSTRates && (
                                    <>
                                      <TableCell align="center" sx={{ padding: '2px 0px', color: 'Highlight' }}>
                                        SGST (%)
                                      </TableCell>
                                    </>
                                  )}
                                  <TableCell align="center" sx={{ padding: '2px 0px' }}>
                                    <Tooltip title={`SGST Rate : ${sgstRate} (%)`} placement="top">
                                      <span>SGST Amt</span>
                                    </Tooltip>
                                  </TableCell>
                                  {showGSTRates && (
                                    <>
                                      <TableCell align="center" sx={{ padding: '2px 0px', color: 'Highlight' }}>
                                        IGST (%)
                                      </TableCell>
                                    </>
                                  )}
                                  <TableCell align="center" sx={{ padding: '2px 0px' }}>
                                    <Tooltip title={`IGST Rate : ${igstRate} (%)`} placement="top">
                                      <span>IGST Amt</span>
                                    </Tooltip>
                                  </TableCell>
                                  <TableCell align="right" sx={{ padding: '2px 0px' }}>
                                    Item Amt
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {values.invoice_detail?.map((item: any, index: number) => (
                                  <TableRow key={item.id}>
                                    <TableCell>
                                      <Stack direction="row" justifyContent="flex-end" alignItems="flex-end" spacing={2}>
                                        {values.invoice_detail.indexOf(item) + 1}
                                        <Tooltip title="Remove Item">
                                          <Button
                                            sx={{ minWidth: 10 }}
                                            color="error"
                                            onClick={() => handelDeleteItem((index: number) => remove(index), index)}
                                          >
                                            <DeleteOutlined />
                                          </Button>
                                        </Tooltip>
                                      </Stack>
                                    </TableCell>
                                    <InvoiceItem
                                      key={item.id}
                                      id={item.id}
                                      index={index}
                                      soNo={item.soNo}
                                      soDate={item.soDate}
                                      name={item.name}
                                      description={item.description}
                                      qty={item.quantity}
                                      price={item.price}
                                      fees={item.fees}
                                      discount={item.discount}
                                      taxableAmount={item.taxableAmount}
                                      cgst={item.cgst}
                                      sgst={item.sgst}
                                      igst={item.igst}
                                      soNoVisibility={soNoSoDate}
                                      ratesVisibility={showGSTRates}
                                      feesVisibility={feesVisible}
                                      discountVisibility={discount}
                                      onDeleteItem={(index: number) => remove(index)}
                                      onEditItem={handleChange}
                                      Blur={handleBlur}
                                      errors={errors}
                                      touched={touched}
                                      products={products}
                                      setFieldValue={setFieldValue}
                                    />
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          <Divider />
                          {touched.invoice_detail && errors.invoice_detail && !Array.isArray(errors?.invoice_detail) && (
                            <Stack direction="row" justifyContent="center" sx={{ p: 1.5 }}>
                              <FormHelperText error={true}>{errors.invoice_detail as string}</FormHelperText>
                            </Stack>
                          )}
                          <Grid container justifyContent="space-between">
                            <Grid item xs={12} md={6}>
                              <Box sx={{ pt: 2.5, pr: 2.5, pb: 2.5, pl: 0 }}>
                                <Button
                                  color="primary"
                                  startIcon={<PlusOutlined />}
                                  onClick={() =>
                                    push({
                                      id: UIDV4(),
                                      name: '',
                                      description: '',
                                      quantity: 0,
                                      price: 0
                                    })
                                  }
                                  variant="dashed"
                                  sx={{ bgcolor: 'transparent !important' }}
                                >
                                  Add Item
                                </Button>
                              </Box>
                            </Grid>
                            <Grid item xs={6} sm={6} md={8}>
                              <Stack spacing={1}>
                                <InputLabel>Notes</InputLabel>
                                <TextField
                                  placeholder="Address"
                                  rows={3}
                                  value={values.note}
                                  multiline
                                  name="note"
                                  onChange={handleChange}
                                  inputProps={{
                                    maxLength: notesLimit
                                  }}
                                  helperText={`${values.note.length} / ${notesLimit}`}
                                  sx={{
                                    width: '70%',
                                    '& .MuiFormHelperText-root': {
                                      mr: 0,
                                      display: 'flex',
                                      justifyContent: 'flex-end'
                                    }
                                  }}
                                />
                              </Stack>
                            </Grid>
                            <Grid item xs={12} md={4} sx={{ marginTop: '-80px' }}>
                              <Stack spacing={1} sx={{ marginTop: 2, paddingRight: '22px' }}>
                                <Stack direction="row" justifyContent="space-between">
                                  <Typography color={theme.palette.grey[500]}>Sub Total:</Typography>
                                  <Typography>{formattedSubtotal ? country?.prefix + '' + formattedSubtotal : '0.0'}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                  <Typography color={theme.palette.grey[500]}> Fees:</Typography>
                                  <Typography>{country?.prefix + '' + formattedFees}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                  <Typography color={theme.palette.grey[500]}> Discount:</Typography>
                                  <Typography style={discountStyle}>{country?.prefix + '' + formattedDiscount}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                  <Typography color={theme.palette.grey[500]}>Taxable Amount:</Typography>
                                  <Typography>{country?.prefix + '' + formattedTaxableAmount}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                  <Typography color={theme.palette.grey[500]}>CGST Tax Amount:</Typography>
                                  <Typography>{country?.prefix + '' + formattedCGSTAmount}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                  <Typography color={theme.palette.grey[500]}>SGST Tax Amount:</Typography>
                                  <Typography>{country?.prefix + '' + formattedSGSTAmount}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                  <Typography color={theme.palette.grey[500]}>IGST Tax Amount:</Typography>
                                  <Typography>{country?.prefix + '' + formattedIGSTAmount}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                  <Typography color={theme.palette.grey[500]}>RoundingOff:</Typography>
                                  <Typography>{country?.prefix + '' + formattedRoundingOff}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                  <Typography variant="subtitle1">Grand Total:</Typography>
                                  <Typography variant="subtitle1">
                                    {grandAmount % 1 === 0
                                      ? country?.prefix + '' + formattedGrandAmount
                                      : country?.prefix + '' + formattedGrandAmount}
                                  </Typography>
                                </Stack>
                              </Stack>
                            </Grid>
                          </Grid>
                        </>
                      );
                    }}
                  />
                </Grid>
                <Grid item xs={12} style={{ opacity: isCustomerSelected ? 1 : 0.2, pointerEvents: isCustomerSelected ? 'auto' : 'none' }}>
                  <Grid container justifyContent="flex-end" alignItems="flex-end">
                    <Stack direction="row" justifyContent="flex-end" alignItems="flex-end" spacing={2} sx={{ height: '100%' }}>
                      <Button
                        variant="outlined"
                        color="secondary"
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
                      <Button variant="outlined" color="secondary" sx={{ color: 'secondary.dark' }}>
                        Save
                      </Button>
                      <Button color="primary" variant="contained" type="submit">
                        Create & Send
                      </Button>
                      <InvoiceModal
                        isOpen={isOpen}
                        setIsOpen={(value: any) =>
                          dispatch(
                            reviewInvoicePopup({
                              isOpen: value
                            })
                          )
                        }
                        key={values.invoiceNumber}
                        invoiceInfo={{
                          ...values,
                          subtotal,
                          taxRate,
                          discountRate,
                          grandAmount
                        }}
                        company={company}
                        items={values?.invoice_detail}
                        onAddNextInvoice={addNextInvoiceHandler}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
      <AlertProductDelete title="Item" open={openDelete} handleClose={handleModalClose} />
    </MainCard>
  );
};

export default Createinvoice;
