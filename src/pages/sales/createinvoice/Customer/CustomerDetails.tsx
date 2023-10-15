// material-ui
import { useTheme } from '@mui/material/styles';
import {
  useMediaQuery,
  Grid,
  Divider,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  Stack,
  TableCell,
  TableRow,
  Typography
} from '@mui/material';

// third-party
import { PatternFormat } from 'react-number-format';

// project import
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';

// assets
import { EnvironmentOutlined, LinkOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

// ==============================|| CUSTOMER - VIEW ||============================== //

const CustomerView = ({ data }: any) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <TableRow sx={{ '&:hover': { bgcolor: `transparent !important` }, overflow: 'hidden' }}>
      <TableCell colSpan={8} sx={{ p: 2.5, overflow: 'hidden' }}>
        <Transitions type="slide" direction="down" in={true}>
          <Grid container spacing={2.5} sx={{ pl: { xs: 0, sm: 5, md: 6, lg: 10, xl: 12 } }}>
            <Grid item xs={12} sm={5} md={4} lg={4} xl={3}>
              <MainCard>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Stack spacing={2.5} alignItems="center">
                      <Stack spacing={0.3} alignItems="center">
                        <Typography fontWeight={{fontWeight:'bold'}} >
                             Mr. {data.firstName} {data.lastName}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction="row" justifyContent="space-around" alignItems="center">
                      <Stack spacing={0.3} alignItems="center">
                        <Typography variant="h5">{data.progress}%</Typography>
                        <Typography color="secondary">Progress</Typography>
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <List component="nav" aria-label="main mailbox folders" sx={{ py: 0 }}>
                      <ListItem>
                        <ListItemIcon>
                          <MailOutlined />
                        </ListItemIcon>
                        <ListItemSecondaryAction>
                          <Typography align="right">{data.email}</Typography>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <PhoneOutlined />
                        </ListItemIcon>
                        <ListItemSecondaryAction>
                          <Typography align="right">
                            <PatternFormat displayType="text" format="+1 (###) ###-####" mask="_" defaultValue={data.phoneNumber} />
                          </Typography>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <EnvironmentOutlined />
                        </ListItemIcon>
                        <ListItemSecondaryAction>
                          <Typography align="right">{data.city}</Typography>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <LinkOutlined />
                        </ListItemIcon>
                        <ListItemSecondaryAction>
                          <Link align="right" href="https://google.com" target="_blank">
                            https://anshan.dh.url
                          </Link>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              </MainCard>
            </Grid>
            <Grid item xs={12} sm={7} md={8} lg={8} xl={9}>
              <Stack spacing={2.5}>
                <MainCard title="Personal Details">
                  <List sx={{ py: 0 }}>
                    <ListItem divider={!matchDownMD}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">Full Name</Typography>
                            <Typography>
                              Mr. {data.firstName} {data.lastName}
                            </Typography>
                          </Stack>
                        </Grid>
                      </Grid>
                    </ListItem>
                    <ListItem divider={!matchDownMD}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">City</Typography>
                            <Typography>{data.city}</Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">Zip Code</Typography>
                            <Typography>
                              <PatternFormat displayType="text" format="### ###" mask="_" defaultValue={data.contact} />
                            </Typography>
                          </Stack>
                        </Grid>
                      </Grid>
                    </ListItem>
                    <ListItem>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Address</Typography>
                        <Typography>{data.Address}</Typography>
                      </Stack>
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

export default CustomerView;
