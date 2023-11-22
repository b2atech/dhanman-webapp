import { Grid, Divider, List, ListItem, ListItemSecondaryAction, Stack, TableCell, TableRow, Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';

// ==============================|| CUSTOMER - VIEW ||============================== //

const ProductDetails = ({ data }: any) => {
  return (
    <TableRow sx={{ '&:hover': { bgcolor: `transparent !important` }, overflow: 'hidden' }}>
      <TableCell colSpan={8} sx={{ p: 2.5, overflow: 'hidden' }}>
        <Transitions type="slide" direction="down" in={true}>
          <Grid container spacing={2.5} sx={{ pl: { xs: 0, sm: 5, md: 6, lg: 10, xl: 12 } }}>
            <Grid item xs={12} sm={5} md={4} lg={10} xl={6}>
              <MainCard>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Stack spacing={2.5} alignItems="center">
                      <Stack spacing={0.3} alignItems="center">
                        <Typography fontWeight={{ fontWeight: 'bold' }}>Product Detail</Typography>
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <List component="nav" aria-label="main mailbox folders" sx={{ py: 0 }}>
                      <ListItem>
                        <Typography>Product Id</Typography>
                        <ListItemSecondaryAction>
                          <Typography align="right">{data.id}</Typography>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <Typography>Name</Typography>
                        <ListItemSecondaryAction>
                          <Typography align="right">{data.productName}</Typography>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <Typography>Description</Typography>
                        <ListItemSecondaryAction>
                          <Typography align="right">{data.description}</Typography>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <Typography>Price</Typography>
                        <ListItemSecondaryAction>
                          <Typography align="right">{data.unitPrice}</Typography>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <Typography>Quantity</Typography>
                        <ListItemSecondaryAction>
                          <Typography align="right">{data.quntityInStock}</Typography>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <Typography>Recorder Level</Typography>
                        <ListItemSecondaryAction>
                          <Typography align="right">{data.recorderLevel}</Typography>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              </MainCard>
            </Grid>
            <Grid item xs={12} sm={7} md={8} lg={8} xl={9}></Grid>
          </Grid>
        </Transitions>
      </TableCell>
    </TableRow>
  );
};

export default ProductDetails;
