// material-ui
import { Grid, Tab, Tabs } from '@mui/material';
import { Divider } from 'antd';
// import { Divider } from 'antd';
import MainCard from 'components/MainCard';
import Goods from 'pages/inventory/products/goods';
import Service from 'pages/inventory/products/service';
import { useState } from 'react';
// ==============================|| ADD PRODUCTS  ||============================== //

export default function AddProductForm() {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <>
      <MainCard>
        <Grid item xs={12} sm={9} lg={8}>
          <Tabs value={selectedTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
            <Tab label="Goods" />
            <Tab label="Services" />
          </Tabs>
        </Grid>
        <Divider />
        {selectedTab === 0 ? <Goods /> : <Service />}
      </MainCard>
    </>
  );
}
