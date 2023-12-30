import { Button, Grid, Stack, Tooltip } from '@mui/material';

import MainCard from 'components/MainCard';

import {
  Autocomplete,
  InputLabel,
  FormControl,
  FormControlLabel,
  TextField,
  Box,
  Switch,
  FormHelperText,
  Typography,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TableBody,
  Table,
  Divider
  // Checkbox
  //Tooltip
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import BillAddressModal from 'sections/apps/bill/BillAddressModal';
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'store';
import { toggleCustomerPopup, selectCountry, reviewInvoicePopup } from 'store/reducers/invoice';
import { customerPopup } from 'store/reducers/invoice';
import BillItem from 'sections/apps/bill/billItem';
import { useTheme } from '@mui/material/styles';
import { v4 as UIDV4 } from 'uuid';
import { openSnackbar } from 'store/reducers/snackbar';
import { CountryType } from 'types/invoice';
import { openDrawer } from 'store/reducers/menu';
//import useConfig from 'hooks/useConfig';

// third party
import * as yup from 'yup';
import { format } from 'date-fns';
import { FieldArray, Form, Formik } from 'formik';
import { useNavigate } from 'react-router';
import { BillHeader_main, BillLine } from 'types/billiingDetails';
import { createBillRequest, getBillDefaultStatus } from 'api/services/BillService';
import AddressBillModal from 'sections/apps/bill/BillAddressModal';
import { useEffect, useState } from 'react';
import { getAllProducts } from 'api/services/InventoryService';
import { getCompanyDetail } from 'api/services/CommonService';
import Loader from 'components/Loader';
// import { CheckBox } from '@mui/icons-material';
import BillModal from 'sections/apps/bill/BillModal';

//assets
import { DeleteOutlined } from '@ant-design/icons';
import AlertProductDelete from '../../../sections/apps/bill/AlertProductDelete';
import { FormattedMessage } from 'react-intl';

const validationSchema = yup.object({
  id: yup.string().required('Bill ID is required'),
  billNumber: yup.string().required('bill number is required'),
  status: yup.string().required('Status selection is required'),
  billDate: yup.date().required('bill date is required'),
  due_date: yup
    .date()
    .when('billDate', (billDate, schema) => {
      return billDate && schema.min(billDate, "Due date can't be before bill date");
    })
    .required('Due date is required'),
  vendorInfo: yup
    .object({
      phoneNumber: yup.string().required('bill receiver information is required')
    })
    .required('bill receiver information is required'),
  bill_detail: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required('Product name is required'),
        description: yup.string(),
        qty: yup.number().min(1, 'Quantity must be at least 1'),
        price: yup.number().min(0, 'Price must be at least 0')
      })
    )
    .required('bill details is required')
    .min(1, 'bill must have at least 1 item'),
  discount: yup.number().min(0, 'Discount must be at least 0'),
  tax: yup.number().min(0, 'Tax must be at least 0'),
  note: yup.string().max(500, 'Notes cannot exceed 500 characters')
});

// ==============================|| BILL - CREATE ||============================== //

const CreateBill = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { open, isCustomerOpen, country, countries, isOpen } = useSelector((state) => state.invoice);
  const notesLimit: number = 500;
  const navigation = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [showGSTRates, setShowGSTRates] = useState(false);
  const [discount, setDiscount] = useState(false);
  const [feesVisible, setFees] = useState(false);
  const [poNoPoDate, setPoNoPoDate] = useState(false);
  // const [defaultGSTRates, setDefaultGSTRates] = useState();
  const [defaultStatus, setDefaultStatus] = useState();
  const [loading, setLoading] = useState<boolean>(true);
  const [company, setCompany] = useState<any>();
  const [funcToDelete, setfuncToDelete] = useState<any>();
  const [itemUnderDeletion, setItemUnderDeletion] = useState<number>();

  const handelDeleteItem = (func: any, index: number) => {
    setfuncToDelete(() => func);
    setItemUnderDeletion(index);
    setOpenDelete(true);
  };

  const addCommas = (number: number) => {
    const formattedNumber = new Intl.NumberFormat('en-IN').format(number);
    return formattedNumber;
  };

  useEffect(() => {
    getCompanyDetail('3fa85f64-5717-4562-b3fc-2c963f66afa6')
      .then((comapanyName) => {
        setCompany(comapanyName);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const [openDelete, setOpenDelete] = useState(false);
  const handleModalClose = (status: boolean) => {
    setOpenDelete(false);
    if (status) {
      funcToDelete(itemUnderDeletion);
      dispatch(
        openSnackbar({
          open: true,
          message: <FormattedMessage id="billItemDeleted" />,
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
    getAllProducts('3fa85f64-5717-4562-b3fc-2c963f66afa6')
      .then((productList) => {
        if (Array.isArray(productList)) {
          setProducts(productList);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  console.log(company?.name);
  useEffect(() => {
    getBillDefaultStatus('3fa85f64-5717-4562-b3fc-2c963f66afa6')
      .then((status) => {
        setDefaultStatus(status.initialStatusName);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  dispatch(openDrawer(false));

  const handlerCreate = (values: any) => {
    const bill: BillHeader_main = {
      id: Math.floor(Math.random() * 90000) + 10000,
      clientId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      vendorId: values.vendorInfo.id,
      coaId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      discount: Number(values.discount),
      billNumber: String(values.billNumber),
      currency: 'INR',
      billDate: format(values.billDate, 'yyyy-MM-dd'),
      paymentTerm: 10,
      billStatusId: '86369b93-58f6-4809-88bd-bc07fbf406ab',
      billPaymentId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      dueDate: format(values.due_date, 'yyyy-MM-dd'),
      totalAmount: Number(values.totalAmount),
      tax: Number(values.tax),
      note: values.note,
      billDetails: undefined,
      billVoucher: 'YP001',
      customer_name: values.vendorInfo?.name,
      email: values.cashierInfo?.email,
      avatar: Number(Math.round(Math.random() * 10)),
      quantity: Number(
        values.bill_detail?.reduce((sum: any, i: any) => {
          return sum + i.qty;
        }, 0)
      ),
      status: values.status,
      cashierInfo: values.cashierInfo,
      vendorInfo: values.vendorInfo
    };

    bill.lines = values.bill_detail.map((billItem: any) => {
      let billLine = {} as BillLine;
      billLine.amount = parseInt(billItem.price) * billItem.quantity;
      billLine.name = billItem.name;
      billLine.description = billItem.description;
      billLine.quantity = billItem.quantity;
      billLine.price = billItem.price;
      return billLine;
    });

    createBillRequest(bill).then(() => {
      dispatch(
        openSnackbar({
          open: true,
          message: <FormattedMessage id="billItemAdded" />,
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

  const addNextBillHandler = () => {
    dispatch(
      reviewInvoicePopup({
        isOpen: false
      })
    );
  };
  return (
    <MainCard>
      <Formik
        initialValues={{
          id: 120,
          billNumber: '',
          status: 'Unpaid',
          billDate: new Date(),
          due_date: null,
          cashierInfo: {
            name: 'Belle J. Richter',
            address: '1300 Cooks Mine, NM 87829',
            phone: '305-829-7809',
            email: 'belljrc23@gmail.com'
          },
          vendorInfo: {
            phoneNumber: '',
            email: '',
            firstName: '',
            lastName: '',
            city: '',
            gstIn: '',
            addressLine: ''
          },
          bill_detail: [
            {
              poNo: 0,
              poDate: '',
              name: '',
              description: '',
              quantity: 0,
              price: 0,
              amount: 0,
              fees: 0,
              discount: 0,
              taxableAmount: 0,
              cgst: 0,
              CGSTAmount: 0,
              sgst: 0,
              SGSTAmount: 0,
              igst: 0,
              IGSTAmount: 0,
              rateVisibility: showGSTRates,
              discountVisibility: discount,
              feesVisibility: feesVisible
            }
          ],
          discount: 0,
          tax: 0,
          note: '',
          totalAmount: 0
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          handlerCreate(values);
        }}
      >
        {({ handleBlur, errors, handleChange, handleSubmit, values, isValid, setFieldValue, touched }) => {
          const subtotal = values?.bill_detail.reduce((prev, curr: any) => {
            if (curr.name.trim().length > 0) return prev + Number(curr.price * curr.quantity);
            else return prev;
          }, 0);
          const formattedSubtotal = addCommas(subtotal);

          const taxRate = (values.tax * subtotal) / 100;
          const cgstAmount = values?.bill_detail.reduce((prev, curr: any) => {
            if (curr.name.trim().length > 0) return prev + Number((curr.cgst / 100) * curr.price * curr.quantity);
            else return prev;
          }, 0);
          const formattedCGSTAmount = addCommas(cgstAmount);

          const sgstAmount = values?.bill_detail.reduce((prev, curr: any) => {
            if (curr.name.trim().length > 0) return prev + Number((curr.sgst / 100) * curr.price * Math.floor(curr.quantity));
            else return prev;
          }, 0);
          const formattedSGSTAmount = addCommas(sgstAmount);

          const igstAmount = values?.bill_detail.reduce((prev, curr: any) => {
            if (curr.name.trim().length > 0) return prev + Number((curr.igst / 100) * curr.price * Math.floor(curr.quantity));
            else return prev;
          }, 0);
          const formattedIGSTAmount = addCommas(igstAmount);

          const fees = values?.bill_detail.reduce((prev, curr: any) => {
            const feeValue = Number(curr.fees) || 0;
            if (curr.name.trim().length > 0) return prev + feeValue;
            else return prev;
          }, 0);
          const formattedFees = addCommas(fees);

          const discountRate = values?.bill_detail.reduce((prev, curr: any) => {
            const hasValidDiscount = curr.discount !== undefined && curr.discount !== null && !isNaN(curr.discount);
            const hasValidPrice = curr.price !== undefined && curr.price !== null && !isNaN(curr.price);
            const hasValidQuantity = curr.quantity !== undefined && curr.quantity !== null && !isNaN(curr.quantity);

            if (curr.name.trim().length > 0 && hasValidDiscount && hasValidPrice && hasValidQuantity) {
              const discount = -(curr.discount / 100) * curr.price * Math.floor(curr.quantity);
              return prev + Number(discount);
            } else {
              return prev;
            }
          }, 0);
          const formattedDiscount = addCommas(discountRate);

          const taxableAmount = subtotal + discountRate + fees;
          const formattedTaxableAmount = addCommas(taxableAmount);

          const roundOffAmount = subtotal + cgstAmount + sgstAmount + discountRate + fees;

          const grandAmount = Math.ceil(roundOffAmount);
          const formattedGrandAmount = addCommas(grandAmount);

          const roundOff = grandAmount - roundOffAmount;
          const discountStyle = {
            color: '#3EB489'
          };

          const cgstRate = values?.bill_detail?.reduce((prev, curr: any) => {
            if (curr.name.trim().length > 0) return prev + Number(curr.cgst);
            else return prev;
          }, 0);
          const sgstRate = values?.bill_detail?.reduce((prev, curr: any) => {
            if (curr.name.trim().length > 0) return prev + Number(curr.sgst);
            else return prev;
          }, 0);
          const igstRate = values?.bill_detail?.reduce((prev, curr: any) => {
            if (curr.name.trim().length > 0) return prev + Number(curr.igst);
            else return prev;
          }, 0);

          // values.totalAmount = grandAmount;

          return (
            <Form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={5} md={2}>
                  <Stack spacing={1}>
                    <InputLabel>Bill No.</InputLabel>
                    <FormControl sx={{ width: '100%' }}>
                      <TextField
                        name="billNumber"
                        id="billNumber"
                        value={values.billNumber}
                        onChange={handleChange}
                        inputProps={{ maxLength: 16 }}
                      />
                    </FormControl>
                  </Stack>
                  {touched.billNumber && errors.billNumber && <FormHelperText error={true}>{errors.billNumber as string}</FormHelperText>}
                </Grid>
                <Grid item xs={12} sm={5} md={2}>
                  <Stack spacing={1}>
                    <InputLabel>Bill Date</InputLabel>
                    <FormControl sx={{ width: '100%' }} error={Boolean(touched.billDate && errors.billDate)}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          format="dd/MM/yyyy"
                          value={values.billDate}
                          onChange={(newValue) => setFieldValue('billDate', newValue)}
                        />
                      </LocalizationProvider>
                    </FormControl>
                  </Stack>
                  {touched.billDate && errors.billDate && <FormHelperText error={true}>{errors.billDate as string}</FormHelperText>}
                </Grid>
                <Grid item xs={12} sm={5} md={2}>
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
                <Grid item xs={12} sm={6} md={2}>
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
                                autoComplete: 'new-password'
                              }}
                            />
                          );
                        }}
                      />
                    </FormControl>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={5} md={4}>
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
                          <BillAddressModal
                            open={open}
                            setOpen={(value) =>
                              dispatch(
                                toggleCustomerPopup({
                                  open: value
                                })
                              )
                            }
                            handlerAddress={(billAddressList) => setFieldValue('cashierInfo', billAddressList)}
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
                              <span>{`${values?.vendorInfo?.firstName} ${values?.vendorInfo?.lastName}`}</span>
                            </Box>
                            <Stack sx={{ width: '100%' }}>
                              <Typography variant="subtitle1"></Typography>
                              <Typography color="secondary">
                                {values?.vendorInfo?.addressLine && values?.vendorInfo?.phoneNumber
                                  ? `${values.vendorInfo.addressLine}, \u00A0\u00A0${values.vendorInfo.phoneNumber}`
                                  : `${values?.vendorInfo?.addressLine || ''} ${values?.vendorInfo?.phoneNumber || ''}`}
                              </Typography>
                              <Typography color="secondary">{values?.vendorInfo?.email}</Typography>
                              {values?.vendorInfo?.gstIn && <Typography color="secondary">GSTIN: {values.vendorInfo.gstIn}</Typography>}
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

                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <Typography variant="h5" sx={{ ml: 2 }}>
                      Detail <span style={{ color: 'grey', fontSize: '0.9em' }}>(Note : )</span>
                    </Typography>
                  </Grid>
                  <Grid item xs={6} container justifyContent="flex-end" alignItems="center">
                    <FormControlLabel
                      control={<Switch color="secondary" checked={poNoPoDate} onChange={() => setPoNoPoDate(!poNoPoDate)} name="PO No" />}
                      label="PO NO"
                    />
                    <FormControlLabel
                      control={<Switch checked={showGSTRates} onChange={() => setShowGSTRates(!showGSTRates)} name="showGSTRates" />}
                      label="GST Rates"
                    />
                    <FormControlLabel
                      control={<Switch color="success" checked={discount} onChange={() => setDiscount(!discount)} name="discount" />}
                      label="Discount"
                    />
                    <FormControlLabel
                      control={<Switch color="error" checked={feesVisible} onChange={() => setFees(!feesVisible)} name="fees" />}
                      label="Fees"
                    />

                    {/* <Tooltip title="Default GST Rates">
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={defaultGSTRates}
                              onChange={() => setDefaultGSTRates(defaultGSTRates)}
                              name="defaultGSTRates"
                            />
                          }
                          label=""
                        />
                      </Tooltip> */}
                  </Grid>
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
                                  <TableCell align="center" sx={{ padding: '2px 0px' }}>
                                    #
                                  </TableCell>
                                  {poNoPoDate && (
                                    <>
                                      <TableCell align="center" sx={{ padding: '2px 0px' }}>
                                        PO No
                                      </TableCell>
                                      <TableCell align="center" sx={{ padding: '2px 0px' }}>
                                        PO Date
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
                                  <TableCell align="right" sx={{ padding: '2px 0px' }}>
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
                                {values.bill_detail?.map((item: any, index: number) => (
                                  <TableRow key={item.id}>
                                    <TableCell>
                                      <Stack direction="row" justifyContent="flex-end" alignItems="flex-end" spacing={2}>
                                        {values.bill_detail.indexOf(item) + 1}
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
                                    <BillItem
                                      key={item.id}
                                      id={item.id}
                                      index={index}
                                      poNumber={item.poNumber}
                                      poDate={item.poDate}
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
                                      ratesVisibility={showGSTRates}
                                      feesVisibility={feesVisible}
                                      discountVisibility={discount}
                                      poNoPoDateVisibility={poNoPoDate}
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
                          {touched.bill_detail && errors.bill_detail && !Array.isArray(errors?.bill_detail) && (
                            <Stack direction="row" justifyContent="center" sx={{ p: 1.5 }}>
                              <FormHelperText error={true}>{errors.bill_detail as string}</FormHelperText>
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
                                  <Typography>{country?.prefix + '' + formattedSubtotal}</Typography>
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
                                  <Typography color={theme.palette.grey[500]}>Taxable Amount</Typography>
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
                                  <Typography color={theme.palette.grey[500]}>Rounding Off:</Typography>
                                  <Typography>{country?.prefix + '' + roundOff}</Typography>
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
                <Grid item xs={12}>
                  <Grid container justifyContent="flex-end" alignItems="flex-end">
                    <Stack direction="row" justifyContent="flex-end" alignItems="flex-end" spacing={2} sx={{ height: '100%' }}>
                      <Button
                        variant="outlined"
                        color="secondary"
                        // disabled={values.status === '' || !isValid}
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
                      <BillModal
                        isOpen={isOpen}
                        setIsOpen={(value: any) =>
                          dispatch(
                            reviewInvoicePopup({
                              isOpen: value
                            })
                          )
                        }
                        key={values.billNumber}
                        invoiceInfo={{
                          ...values,
                          subtotal,
                          taxRate,
                          discountRate,
                          grandAmount
                        }}
                        company={company}
                        items={values?.bill_detail}
                        onAddNextInvoice={addNextBillHandler}
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

export default CreateBill;
