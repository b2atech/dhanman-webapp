import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Grid,
  IconButton,
  Chip,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Divider
} from '@mui/material';

// third-party
import ReactToPrint from 'react-to-print';
import { PDFDownloadLink } from '@react-pdf/renderer';

// project import
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import LogoSection from 'components/logo';
import ExportPDFView from 'sections/apps/invoice/export-pdf';

import { useSelector } from 'store';
// import { getInvoiceSingleList } from 'store/reducers/invoice';

// assets
import { DownloadOutlined, EditOutlined, PrinterFilled, ShareAltOutlined } from '@ant-design/icons';
import { getInvoice } from 'api/services/SalesService';
import { getCompanyDetail } from 'api/services/CommonService';
import config from 'config';
import { IInvoiceType } from 'types/invoice';

// ==============================|| INVOICE - DETAILS ||============================== //

const Invoicedetails = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigation = useNavigate();
  const [company, setCompany] = useState<any>();

  const { list } = useSelector((state) => state.invoice);
  const [invoice, setInvoice] = useState<IInvoiceType>();
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
      getInvoice(id).then((InvoiceHeader) => {
        setInvoice(InvoiceHeader);
        setLoading(false);
      });
    }
  }, [id]);

  const today = new Date(`${invoice?.invoiceDate}`).toLocaleDateString('en-GB', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  });

  const due_dates = new Date(`${invoice?.dueDate}`).toLocaleDateString('en-GB', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  });

  const componentRef: React.Ref<HTMLDivElement> = useRef(null);
  const subTotal = (invoice?.lines ?? []).reduce((total, row) => {
    return total;
  }, 0);
  const taxRate = Number(invoice?.discount);
  const discountRate = (invoice?.lines ?? []).reduce((total, row) => {
    return (row.discount / 100) * row.price * row.quantity;
  }, 0);
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
              <IconButton onClick={() => navigation(`/sales/invoices/edit/${id}`)}>
                <EditOutlined style={{ color: theme.palette.grey[900] }} />
              </IconButton>
              <PDFDownloadLink
                document={<ExportPDFView list={invoice} company={company} />}
                fileName={`${invoice?.invoiceNumber}-${invoice?.customer.firstName}.pdf`}
              >
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
                  <Typography color="secondary">{list?.invoice_id}</Typography>
                </Box>
                <Box>
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Chip
                      label={invoice?.invoiceStatus}
                      variant="light"
                      size="small"
                      color={invoice?.invoiceStatus === 'Closed' ? 'error' : invoice?.invoiceStatus === 'Paid' ? 'success' : 'info'}
                    />
                    <Typography variant="subtitle1">Invoice Date</Typography>
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
              <MainCard>
                <Stack spacing={1}>
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
                </Stack>
              </MainCard>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ marginTop: '-10px' }}>
              <MainCard>
                <Stack spacing={1}>
                  <Typography variant="h5">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ paddingRight: '10px' }}>To:</span>
                      <span>{`${invoice?.customer?.firstName} ${invoice?.customer?.lastName}`}</span>
                    </Box>
                    <Stack sx={{ width: '100%' }}>
                      <Typography variant="subtitle1"></Typography>
                      <Typography color="secondary">
                        {invoice?.customer?.addressLine && invoice?.customer?.phoneNumber
                          ? `${invoice.customer.addressLine}, \u00A0\u00A0${invoice.customer.phoneNumber}`
                          : `${invoice?.customer?.addressLine || ''} ${invoice?.customer?.phoneNumber || ''}`}
                      </Typography>
                      <Typography color="secondary">{invoice?.customer?.email}</Typography>
                      {invoice?.customer?.gstIn && <Typography color="secondary">GSTIN: {invoice.customer.gstIn}</Typography>}
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
                      <TableCell>SO No</TableCell>
                      <TableCell>SO Date</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Fees</TableCell>
                      <TableCell align="right">Discount</TableCell>
                      <TableCell align="right">Taxable Amount</TableCell>
                      <TableCell align="right">Cgst Amount</TableCell>
                      <TableCell align="right">Sgst Amount</TableCell>
                      <TableCell align="right">Igst Amount</TableCell>
                      <TableCell align="right">Total Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoice?.lines?.map((row: any, index) => (
                      <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{}</TableCell>
                        <TableCell>{}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.description}</TableCell>
                        <TableCell align="right">{row.quantity}</TableCell>
                        <TableCell align="right">₹ {Number(row.price).toFixed(2)}</TableCell>
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
                <Typography>{invoice?.note}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Stack spacing={1} sx={{ paddingRight: '22px', marginTop: '-20px' }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color={theme.palette.grey[500]}>Sub Total:</Typography>
                  <Typography variant="subtitle1">₹ {subTotal}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color={theme.palette.success[500]}>Discount:</Typography>
                  <Typography style={discountStyle}>₹ {discountRate}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color={theme.palette.grey[500]}>Tax:</Typography>
                  <Typography>₹ {taxRate}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle1">Grand Total:</Typography>
                  <Typography variant="subtitle1">₹ {invoice?.totalAmount}</Typography>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Box>
        <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ p: 2.5, a: { textDecoration: 'none', color: 'inherit' } }}>
          <PDFDownloadLink
            document={<ExportPDFView list={invoice} company={company} />}
            fileName={`${invoice?.invoiceNumber}-${invoice?.customer.firstName}.pdf`}
          >
            <Button variant="contained" color="primary">
              Download
            </Button>
          </PDFDownloadLink>
        </Stack>
      </Stack>
    </MainCard>
  );
};

export default Invoicedetails;
