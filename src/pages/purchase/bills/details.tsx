import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Divider,
  FormControl,
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
  const navigation = useNavigate();
  const { id } = useParams();
  const [list, setList] = useState<IBillType>();

  const [loading, setLoading] = useState<boolean>(true);

  const componentRef: React.Ref<HTMLDivElement> = useRef(null);

  useEffect(() => {
    if (id) {
      getBillById(id).then((BillList) => {
        setList(BillList);
        setLoading(false);
      });
    }
  }, [id]);

  const today = new Date(`${list?.billDate}`).toLocaleDateString('en-GB', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  });

  const due_dates = new Date(`${list?.dueDate}`).toLocaleDateString('en-GB', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  });

  const subTotal = (list?.lines ?? []).reduce((total, row) => {
    return total + row.amount;
  }, 0);
  if (loading) return <Loader />;

  const taxRate = (Number(list?.tax) * subTotal) / 100;
  const discountRate = (Number(list?.discount) * subTotal) / 100;

  return (
    <MainCard content={false}>
      <Stack spacing={2.5}>
        <Box sx={{ p: 2.5, pb: 0 }}>
          <MainCard content={false} sx={{ p: 1.25, bgcolor: 'primary.lighter', borderColor: theme.palette.primary[100] }}>
            <Stack direction="row" justifyContent="flex-end" spacing={1}>
              <Button onClick={() => navigation('/purchase/bills/list')} variant="contained" startIcon={<ArrowBackIcon />} size="small">
                Back
              </Button>
              <IconButton onClick={() => navigation(`/purchase/bills/edit/${id}`)}>
                <EditOutlined style={{ color: theme.palette.grey[900] }} />
              </IconButton>
              <PDFDownloadLink document={<ExportPDFView list={list} />} fileName={`${list?.billNumber}-${list?.vendor?.firstName}.pdf`}>
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
                    <Chip
                      label={list?.billStatus}
                      variant="light"
                      size="small"
                      color={list?.billStatus === 'Closed' ? 'error' : list?.billStatus === 'Paid' ? 'success' : 'info'}
                    />
                  </Stack>
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
                    <Typography color="secondary">{`${list?.vendor.firstName} ${list?.vendor.lastName}`}</Typography>
                    <Typography color="secondary">{list?.vendor.addressLine}</Typography>
                    <Typography color="secondary">{list?.vendor.phoneNumber}</Typography>
                    <Typography color="secondary">{list?.vendor.email}</Typography>
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
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {list?.lines?.map((row: any, index) => (
                      <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.description}</TableCell>
                        <TableCell align="right">{row.quantity}</TableCell>
                        <TableCell align="right">{row.price}</TableCell>
                        <TableCell align="right">{row.amount}</TableCell>
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
                  <Typography variant="subtitle1">₹ {subTotal}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color={theme.palette.grey[500]}>Discount:</Typography>
                  <Typography>₹ {discountRate}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color={theme.palette.grey[500]}>Tax:</Typography>
                  <Typography>₹ {taxRate}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle1">Grand Total:</Typography>
                  <Typography variant="subtitle1">₹ {list?.totalAmount.toFixed(2)}</Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" spacing={1}>
                <Typography color="secondary">Note: </Typography>
                <Typography>{list?.note}</Typography>
              </Stack>
            </Grid>
          </Grid>
        </Box>
        <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ p: 2.5, a: { textDecoration: 'none', color: 'inherit' } }}>
          <PDFDownloadLink document={<ExportPDFView list={list} />} fileName={`${list?.billNumber}-${list?.vendor.firstName}.pdf`}>
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
