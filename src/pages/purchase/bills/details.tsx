import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Divider,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton
} from '@mui/material';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

// third-party

// project import
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import { getBillById } from 'api/services/BillService';
import { getCompanyDetail } from 'api/services/CommonService';
import config from 'config';

// types
import { IBillType } from 'types/bill';

//asset
import LogoSection from 'components/logo';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ExportPDFView from 'sections/apps/bill/export-pdf';
import { DownloadOutlined, EditOutlined, PrinterFilled, ShareAltOutlined } from '@ant-design/icons';
import ReactToPrint from 'react-to-print';

// ==============================|| BILL - DETAILS ||============================== //

const Details = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigation = useNavigate();
  const [company, setCompany] = useState<any>();

  // const { list } = useSelector((state) => state.bill);
  const [bill, setBill] = useState<IBillType>();
  const [loading, setLoading] = useState<boolean>(false);
  const companyId: string = String(config.companyId);

  useEffect(() => {
    if (companyId) {
      getCompanyDetail(companyId).then((companyInfo) => {
        setCompany(companyInfo);
      });
    }
  }, [companyId]);

  useEffect(() => {
    if (id) {
      getBillById(id).then((BillList) => {
        setBill(BillList);
        setLoading(false);
      });
    }
  }, [id]);

  const today = new Date(`${bill?.billDate}`).toLocaleDateString('en-GB', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  });

  const due_dates = new Date(`${bill?.dueDate}`).toLocaleDateString('en-GB', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  });

  const addCommas = (number: string | number) => {
    const parsedNumber = typeof number === 'string' ? parseFloat(number) : number;
    const formattedNumber = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(parsedNumber);
    return formattedNumber;
  };

  const componentRef: React.Ref<HTMLDivElement> = useRef(null);

  const subTotal = (bill?.lines ?? []).reduce((total, row) => {
    return total + row.price * row.quantity;
  }, 0);
  const formattedSubtotal = addCommas(subTotal.toFixed(2));

  const discountRate = (bill?.lines ?? []).reduce((total, row) => {
    return total + row.discount;
  }, 0);

  const formatteDiscount = addCommas(discountRate.toFixed(2));

  const fees = (bill?.lines ?? []).reduce((total, row) => {
    return total + row.fees;
  }, 0);
  const formattedFees = addCommas(fees.toFixed(2));

  const taxableAmount = subTotal - discountRate + fees;
  const formattedTaxableAmt = addCommas(taxableAmount.toFixed(2));

  const cgstAmt = (bill?.lines ?? []).reduce((total, row) => {
    return total + row.cgstTaxAmount;
  }, 0);
  const formatteCgstAmt = addCommas(cgstAmt.toFixed(2));

  const sgstAmt = (bill?.lines ?? []).reduce((total, row) => {
    return total + row.sgstTaxAmount;
  }, 0);
  const formatteSgstAmt = addCommas(sgstAmt.toFixed(2));

  const igstAmt = (bill?.lines ?? []).reduce((total, row) => {
    return total + row.igstTaxAmount;
  }, 0);
  const formatteIgstAmt = addCommas(igstAmt.toFixed(2));

  const roundingAmt = subTotal + cgstAmt + sgstAmt - discountRate + fees;

  const grandAmount = Math.ceil(roundingAmt);
  const formattedGrandAmount = addCommas(grandAmount);

  const roundingOff = grandAmount - roundingAmt;
  const formattedRoundOff = addCommas(roundingOff);

  const discountStyle = {
    color: '#3EB489'
  };
  if (loading) return <Loader />;

  return (
    <MainCard content={false}>
      <Stack spacing={2.5}>
        <Box sx={{ p: 2.5, pb: 0 }}>
          <MainCard content={false} sx={{ p: 1.25, bgcolor: 'primary.lighter', borderColor: theme.palette.primary[100] }}>
            <Stack direction="row" justifyContent="flex-end" spacing={1}>
              <Button onClick={() => navigation('/purchase/bills/list')} variant="contained" startIcon={<ArrowBackIcon />} size="small">
                Back to Bills
              </Button>
              <IconButton onClick={() => navigation(`/purchase/bills/edit/${id}`)}>
                <EditOutlined style={{ color: theme.palette.grey[900] }} />
              </IconButton>
              <PDFDownloadLink document={<ExportPDFView list={bill} />} fileName={`${bill?.billNumber}-${bill?.vendor?.firstName}.pdf`}>
                <IconButton>
                  <DownloadOutlined style={{ color: theme.palette.grey[900] }} />
                </IconButton>
              </PDFDownloadLink>
              <ReactToPrint
                trigger={() => (
                  <IconButton>
                    <PrinterFilled style={{ color: theme.palette.grey[900] }} />
                  </IconButton>
                )}
                content={() => componentRef.current}
              />
              <IconButton>
                <ShareAltOutlined style={{ color: theme.palette.grey[900] }} />
              </IconButton>
            </Stack>
          </MainCard>
        </Box>
        <Box sx={{ p: 2.5 }} id="print" ref={componentRef}>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sx={{ marginTop: '-30px' }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between">
                <Box>
                  <Stack direction="row" spacing={2}>
                    <LogoSection />
                  </Stack>
                  {/* <Typography color="secondary">{list?.bill_id}</Typography> */}
                </Box>
                <Box>
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Chip
                      label={bill?.billStatus}
                      variant="light"
                      size="small"
                      color={bill?.billStatus === 'Closed' ? 'error' : bill?.billStatus === 'Paid' ? 'success' : 'info'}
                    />
                    <Typography variant="subtitle1">Bill Date</Typography>
                    <Typography color="secondary">{today}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Typography sx={{ overflow: 'hidden' }} variant="subtitle1">
                      Due Date
                    </Typography>
                    <Typography color="secondary">{due_dates}</Typography>
                  </Stack>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ marginTop: '-10px' }}>
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
                </Grid>
              </MainCard>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ marginTop: '-10px' }}>
              <MainCard>
                <Stack spacing={2}>
                  <Typography variant="h5">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ paddingRight: '10px' }}>To:</span>
                      <span>{`${bill?.vendor?.firstName} ${bill?.vendor?.lastName}`}</span>
                    </Box>
                    <Stack sx={{ width: '100%' }}>
                      <Typography variant="subtitle1"></Typography>
                      <Typography color="secondary">
                        {bill?.vendor?.addressLine && bill?.vendor?.phoneNumber
                          ? `${bill.vendor.addressLine}, \u00A0\u00A0${bill.vendor.phoneNumber}`
                          : `${bill?.vendor?.addressLine || ''} ${bill?.vendor?.phoneNumber || ''}`}
                      </Typography>
                      <Typography color="secondary">{bill?.vendor?.email}</Typography>
                      {bill?.vendor?.gstIn && <Typography color="secondary">GSTIN: {bill.vendor.gstIn}</Typography>}
                    </Stack>
                  </Typography>
                </Stack>
              </MainCard>
            </Grid>
            <Grid item xs={12}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      {/* <TableCell>PO No</TableCell>
                      <TableCell>PO Date</TableCell> */}
                      <TableCell>Name</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Fees</TableCell>
                      <TableCell align="right">Discount</TableCell>
                      <TableCell align="right">Taxable Amt</TableCell>
                      <TableCell align="right">CGST Amt</TableCell>
                      <TableCell align="right">SGST Amt</TableCell>
                      <TableCell align="right">IGST Amt</TableCell>
                      <TableCell align="right">Total Amt</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bill?.lines?.map((row: any, index) => (
                      <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell>{index + 1}</TableCell>
                        {/* <TableCell>{}</TableCell>
                        <TableCell>{}</TableCell> */}
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.description}</TableCell>
                        <TableCell align="right">{row.quantity}</TableCell>
                        <TableCell align="right">{row.price}</TableCell>
                        <TableCell align="right">{row.fees}</TableCell>
                        <TableCell align="right">{row.discount}</TableCell>
                        <TableCell align="right">{row.taxableAmount}</TableCell>
                        <TableCell align="right">{row.cgstTaxAmount}</TableCell>
                        <TableCell align="right">{row.sgstTaxAmount}</TableCell>
                        <TableCell align="right">{row.igstTaxAmount}</TableCell>
                        <TableCell align="right">₹ {Number(row.price * row.quantity).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ borderWidth: 1 }} />
            </Grid>
            <Grid item xs={12} sm={6} md={8}></Grid>
            <Grid item xs={12} sm={6} md={8}>
              <Stack direction="row" spacing={1}>
                <Typography color="secondary">Note: </Typography>
                <Typography>{bill?.note}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Stack spacing={1} sx={{ paddingRight: '22px', marginTop: '-20px' }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color={theme.palette.grey[500]}>Sub Total:</Typography>
                  <Typography variant="subtitle1">₹ {formattedSubtotal}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color={theme.palette.grey[500]}>Fees:</Typography>
                  <Typography variant="subtitle1">₹ {formattedFees}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color={theme.palette.grey[500]}>Discount:</Typography>
                  <Typography style={discountStyle}>₹ {formatteDiscount}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color={theme.palette.grey[500]}>Taxable Amount:</Typography>
                  <Typography>₹ {formattedTaxableAmt}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color={theme.palette.grey[500]}>CGST Tax Amount:</Typography>
                  <Typography>₹ {formatteCgstAmt}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color={theme.palette.grey[500]}>SGST Tax Amount:</Typography>
                  <Typography>₹ {formatteSgstAmt}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color={theme.palette.grey[500]}>IGST Tax Amount:</Typography>
                  <Typography>₹ {formatteIgstAmt}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color={theme.palette.grey[500]}>RoundingOff:</Typography>
                  <Typography>₹ {formattedRoundOff}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle1">Grand Total:</Typography>
                  <Typography variant="subtitle1">₹ {formattedGrandAmount}</Typography>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Box>
        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={2}
          sx={{ p: 2.5, a: { textDecoration: 'none', color: 'inherit' }, position: 'relative', top: '-30px' }}
        >
          <PDFDownloadLink document={<ExportPDFView list={bill} />} fileName={`${bill?.billNumber}-${bill?.vendor.firstName}.pdf`}>
            <Button variant="contained" color="primary">
              Download
            </Button>
          </PDFDownloadLink>
        </Stack>
      </Stack>
    </MainCard>
  );
};
export default Details;
