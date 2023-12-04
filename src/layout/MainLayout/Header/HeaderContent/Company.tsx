import { useEffect, useState } from 'react';
// material-ui
import { Box, Grid, Stack, FormControl, Select, Autocomplete, MenuItem, TextField } from '@mui/material';

// assets
import { getAllCompanies } from 'api/services/CommonService';
import { ICompany } from 'types/company';

// project import
import useConfig from 'hooks/useConfig';

// // ==============================|| HEADER CONTENT - SEARCH ||============================== //
// export type CompanyInfo = {
//   Id: String;
//   Name: String;
// };
const Company = () => {
  const [companies, setCompanies] = useState<ICompany[]>();
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const { onChangeClient } = useConfig();

  const handleListItemClick = (clientId: String) => {
    onChangeClient(clientId);
  };

  useEffect(() => {
    getAllCompanies()
      .then((companyList) => {
        if (Array.isArray(companyList)) {
          setCompanies(companyList);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <Box sx={{ flexShrink: 0, ml: 0.85 }}>
      <FormControl sx={{ width: { xs: '100%', md: 280 } }}>
        <Grid item xs={12} sm={6} md={3}>
          <Stack spacing={1} direction="row">
            <Autocomplete
              fullWidth
              autoHighlight
              id="company"
              options={companies || []}
              getOptionLabel={(option) => option.name}
              value={companies?.find((company) => company.id === selectedCompanyId)}
              onChange={(event, newValue) => {
                if (newValue) {
                  setSelectedCompanyId(newValue.id);
                  handleListItemClick(newValue.id);
                } else {
                  setSelectedCompanyId('');
                  handleListItemClick('');
                }
              }}
              renderInput={(params) => <TextField {...params} placeholder="Enter Company Name" />}
            />
            <Select value="2023">
              <MenuItem value={2023}>2023</MenuItem>
              <MenuItem value={2021}>2021</MenuItem>
              <MenuItem value={2020}>2020</MenuItem>
            </Select>
          </Stack>
        </Grid>
      </FormControl>
    </Box>
  );
};

export default Company;
