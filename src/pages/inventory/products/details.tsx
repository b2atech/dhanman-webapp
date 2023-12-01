// material-ui
import { Grid, List, ListItem, Stack, TableCell, TableRow, Typography } from '@mui/material';

// third-party

// project import
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';

// assets

// ==============================|| PRODUCT - VIEW ||============================== //

const ProductDetails = ({ data }: any) => {
  return (
    <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' }, overflow: 'hidden' }}>
      <TableCell colSpan={12} sx={{ p: 1.5, overflow: 'hidden' }}>
        <Transitions type="slide" direction="down" in={true}>
          <Grid container spacing={0.5} sx={{ pl: { xs: 0, sm: 5, md: 6, lg: 10, xl: 12 } }}>
            <Grid item xs={12} sm={2} md={8} lg={8} xl={9}>
              <Stack spacing={0.5}>
                <MainCard
                  title={
                    <Typography color="Primary" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
                      {data.productName} Detail's
                    </Typography>
                  }
                >
                  <List sx={{ px: 0 }}>
                    <ListItem>
                      <Grid container spacing={3}>
                        <Grid item xs={6}>
                          <Typography color="secondary">Category</Typography>
                          <Typography>{data.categoryName}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">Description</Typography>

                            <Typography>{data.description}</Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={12}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">{data.hsnCode ? 'HSN CODE' : 'SAC'}</Typography>
                            <Typography>{data.hsnCode ? data.hsnCode : data.sac}</Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography color="secondary">Cost</Typography>
                          <Typography>{data.purchasePrice}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">Rate</Typography>
                            <Typography>{data.sellingPrice}</Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography color="secondary" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
                            Inventory
                          </Typography>
                          <Typography color="secondary">
                            OPN.STOCK : <b>{data.openingStock}</b>
                          </Typography>
                          <Typography color="secondary">
                            MIN.STOCK : <b>{data.minimumStock}</b>
                          </Typography>
                          <Typography color="secondary">
                            Unit : <b>{data.unit}</b>
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography color="secondary" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
                            Taxes
                          </Typography>
                          <Typography color="secondary">
                            CGST : <b>{data.cgst}</b>
                          </Typography>
                          <Typography color="secondary">
                            SGST : <b>{data.sgst}</b>
                          </Typography>
                          <Typography color="secondary">
                            IGST : <b>{data.igst}</b>
                          </Typography>
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

export default ProductDetails;
