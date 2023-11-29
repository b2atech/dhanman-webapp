// material-ui
import { Grid, List, ListItem, Stack, TableCell, TableRow, Typography } from '@mui/material';

// third-party

// project import
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';

// assets

// ==============================|| Paid Payment - VIEW ||============================== //

const PaidPaymentView = ({ data }: any) => {
  return (
    <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' }, overflow: 'hidden' }}>
      <TableCell colSpan={8} sx={{ p: 2.5, overflow: 'hidden' }}>
        <Transitions type="slide" direction="down" in={true}>
          <Grid container spacing={2.5} sx={{ pl: { xs: 0, sm: 5, md: 6, lg: 10, xl: 12 } }}>
            <Grid item xs={12} sm={7} md={8} lg={8} xl={9}>
              <Stack spacing={2.5}>
                <MainCard title="Paid Payment Details">
                  <List sx={{ py: 0 }}>
                    <ListItem>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Typography color="secondary">Vendor Name</Typography>
                          <Typography>Mr. {data.vendorName}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">Amount</Typography>
                            <Typography>{data.amount}</Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">Description</Typography>
                            <Typography>{data.description}</Typography>
                          </Stack>
                        </Grid>
                      </Grid>
                    </ListItem>
                  </List>
                </MainCard>
              </Stack>
            </Grid>
          </Grid>
        </Transitions>
      </TableCell>
    </TableRow>
  );
};

export default PaidPaymentView;
