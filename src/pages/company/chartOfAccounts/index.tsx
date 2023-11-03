import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

// material-ui
import { Box, Grid } from '@mui/material';
import { getRootChartOfAccounts, getRootChartOfAccountsOrder, getItems, getColumns, getColumnsOrder } from 'store/reducers/coa';

// project imports
import Loader from 'components/Loader';
import CoaContainer from './coaContainer';
import { useDispatch } from 'store';
//import { openDrawer } from 'store/reducers/menu';

// function a11yProps(index: number) {
//   return {
//     id: `simple-tab-${index}`,
//     'aria-controls': `simple-tabpanel-${index}`
//   };
// }

// ==============================|| APPLICATION - KANBAN ||============================== //

export default function COAPage() {
  const dispatch = useDispatch();
  //const { pathname } = useLocation();

  const [loading, setLoading] = useState<boolean>(true);

  //   let selectedTab = 0;
  //   switch (pathname) {
  //     default:
  //       selectedTab = 0;
  //   }

  //   const [value, setValue] = useState(selectedTab);
  //   const handleChange = (event: SyntheticEvent, newValue: number) => {
  //     setValue(newValue);
  //   };

  useEffect(() => {
    // hide left drawer when email app opens
    //dispatch(openDrawer(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const items = dispatch(getItems());
    const columns = dispatch(getColumns());
    const columnOrder = dispatch(getColumnsOrder());
    const story = dispatch(getRootChartOfAccounts());
    const storyOrder = dispatch(getRootChartOfAccountsOrder());

    Promise.all([items, columns, columnOrder, story, storyOrder]).then(() => setLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Loader />;

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <CoaContainer></CoaContainer>
          {/* <Tabs value={value} variant="scrollable" onChange={handleChange}>
            <Tab component={Link} to="/company/coa/backlogs" label={value === 0 ? 'Board' : 'View as Board'} {...a11yProps(0)} />
          </Tabs> */}
        </Grid>
        <Grid item xs={12}>
          <Outlet />
        </Grid>
      </Grid>
    </Box>
  );
}
