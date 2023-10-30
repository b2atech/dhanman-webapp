import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Grid,
  IconButton,
  Chip,
  FormControl,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Divider,
  CircularProgress
} from '@mui/material';

// third-party
import ReactToPrint from 'react-to-print';
import { PDFDownloadLink } from '@react-pdf/renderer';

// project import
import MainCard from 'components/MainCard';
import LogoSection from 'components/logo';
import ExportPDFView from 'sections/apps/invoice/export-pdf';

import { useSelector } from 'store';
// import { getInvoiceSingleList } from 'store/reducers/invoice';

// assets
import { DownloadOutlined, EditOutlined, PrinterFilled, ShareAltOutlined } from '@ant-design/icons';
import { getInvoice } from 'api/services/SalesService';
import { IInvoiceType } from 'types/invoice';

// ==============================|| INVOICE - DETAILS ||============================== //

const Invoicedetails = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigation = useNavigate();

  const { country, list } = useSelector((state) => state.invoice);
  const [list1, setList] = useState<IInvoiceType>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInvoice('366c9d49-6ad3-4acf-98fe-75cc45de72a1').then((InvoiceHeader) => {
      setList(InvoiceHeader);
      setLoading(false);
    });
  }, [id]);

  const today = new Date(`${list1?.invoiceDate}`).toLocaleDateString('en-GB', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  });

  const due_dates = new Date(`${list1?.dueDate}`).toLocaleDateString('en-GB', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  });

  const subtotal = list1?.lines?.reduce((prev: any, curr: any) => {
    if (curr.name.trim().length > 0) return prev + Number(curr.price * Math.floor(curr.qty));
    else return prev;
  }, 0);

  const taxRate = (Number(list1?.tax) * subtotal) / 100;
  const discountRate = (Number(list1?.discount) * subtotal) / 100;
  const total = subtotal - discountRate + taxRate;
  const componentRef: React.Ref<HTMLDivElement> = useRef(null);
  const grandAmount = Number(list1?.totalAmount);

  return (
    <MainCard content={false}>
      
      {loading ? (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="500px">
        <CircularProgress size={60} thickness={4} />
        <Typography variant="body1" style={{ marginTop: '32x' }}>
          Loading, please wait...
        </Typography>
      </Box>
      ) : (
      <Stack spacing={2.5}>
        <Box sx={{ p: 2.5, pb: 0 }}>
          <MainCard content={false} sx={{ p: 1.25, bgcolor: 'primary.lighter', borderColor: theme.palette.primary[100] }}>
            <Stack direction="row" justifyContent="flex-end" spacing={1}>
              <IconButton onClick={() => navigation(`/apps/invoice/edit/${id}`)}>
                <EditOutlined style={{ color: theme.palette.grey[900] }} />
              </IconButton>
              <PDFDownloadLink document={<ExportPDFView list={list} />} fileName={`${list?.invoice_id}-${list?.customer_name}.pdf`}>
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
            <Grid item xs={12}>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between">
                <Box>
                  <Stack direction="row" spacing={2}>
                    <LogoSection />
                    <Chip label={list1?.invoiceStatus} variant="light" color="success" size="small" />
                  </Stack>
                  <Typography color="secondary">{list?.invoice_id}</Typography>
                </Box>
                <Box>
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Typography variant="subtitle1">Date</Typography>
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
            <Grid item xs={12} sm={6}>
              <MainCard>
                <Stack spacing={1}>
                  <Typography variant="h5">From:</Typography>
                  <FormControl sx={{ width: '100%' }}>
                    <Typography color="secondary">Belle J. Richter</Typography>
                    <Typography color="secondary">1300 Cooks Mine, NM 87829</Typography>
                    <Typography color="secondary">305-829-7809</Typography>
                    <Typography color="secondary">belljrc23@gmail.com</Typography>
                  </FormControl>
                </Stack>
              </MainCard>
            </Grid>
            <Grid item xs={12} sm={6}>
              <MainCard>
                <Stack spacing={1}>
                  <Typography variant="h5">To:</Typography>
                  <FormControl sx={{ width: '100%' }}>
                    <Typography color="secondary">{`${list1?.customer.firstName} ${list1?.customer.lastName}`}</Typography>
                    <Typography color="secondary">{list1?.customer.city}</Typography>
                    <Typography color="secondary">{list1?.customer.phoneNumber}</Typography>
                    <Typography color="secondary">{list1?.customer.email}</Typography>
                  </FormControl>
                </Stack>
              </MainCard>
            </Grid>
            <Grid item xs={12}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Qty</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {list1?.lines?.map((row: any, index) => (
                      <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.description}</TableCell>
                        <TableCell align="right">{row.quantity}</TableCell>
                        <TableCell align="right">{country?.prefix + '' + Number(row.price).toFixed(2)}</TableCell>
                        <TableCell align="right">{country?.prefix + '' + Number(row.price * row.quantity).toFixed(2)}</TableCell>
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
            <Grid item xs={12} sm={6} md={4}>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color={theme.palette.grey[500]}>Sub Total:</Typography>
                  <Typography variant="subtitle1">
                    {grandAmount % 1 === 0 ? country?.prefix + '' + grandAmount : country?.prefix + '' + grandAmount.toFixed(2)}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color={theme.palette.grey[500]}>Discount:</Typography>
                  <Typography variant="h6" color={theme.palette.success.main}>
                    {country?.prefix + '' + discountRate?.toFixed(2)}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color={theme.palette.grey[500]}>Tax:</Typography>
                  <Typography>{country?.prefix + '' + taxRate?.toFixed(2)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle1">Grand Total:</Typography>
                  <Typography variant="subtitle1">
                    {total % 1 === 0 ? country?.prefix + '' + total : country?.prefix + '' + total?.toFixed(2)}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" spacing={1}>
                <Typography color="secondary">Notes: </Typography>
                <Typography>Thank you for your business. We appreciate your prompt attention to this invoice.</Typography>
              </Stack>
            </Grid>
          </Grid>
        </Box>
        <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ p: 2.5, a: { textDecoration: 'none', color: 'inherit' } }}>
          <PDFDownloadLink document={<ExportPDFView list={list} />} fileName={`${list?.invoice_id}-${list?.customer_name}.pdf`}>
            <Button variant="contained" color="primary">
              Download
            </Button>
          </PDFDownloadLink>
        </Stack>
      </Stack>
      )
      }
      
    </MainCard>
  );
};

export default Invoicedetails;
