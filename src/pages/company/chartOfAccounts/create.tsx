// AddCOAForm.js

import { InputLabel, TextField, Grid, Autocomplete, FormControlLabel, Switch, Tooltip, Button } from '@mui/material';
import { Stack } from '@mui/system';
import config from 'config';
import MainCard from 'components/MainCard';
import { Form, FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';

import { getAllAccountGroups } from 'api/services/CommonService';
//import { IaccountGroup } from 'types/accountgroup';

const AddCOA = () => {
  const COASchema = Yup.object().shape({
    name: Yup.string().max(255).required('Please Enter Name'),
    alternativeName: Yup.string().max(255).required('Please Enter Alternative Name'),
    type: Yup.string().max(255).required('Please Enter Type'),
    groupCode: Yup.string().max(255).required('Please Select Group Code'),
    dueDays: Yup.number().required('Please Enter Due Days').positive('Due Days must be a positive number'),
    isLedger: Yup.boolean(),
    isShowOut: Yup.boolean(),
    isTender: Yup.boolean(),
    remark: Yup.string().max(255).required('Please Enter Remark'),
    description: Yup.string().required('Please Enter Description')
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      alternativeName: '',
      type: '',
      groupCode: '',
      dueDays: '',
      isLedger: false,
      isShowOut: false,
      isTender: false,
      remark: '',
      description: ''
    },
    validationSchema: COASchema,
    onSubmit: (values) => {
      // Handle form submission
      console.log('Form values:', values);
    }
  });
  const [groupCodes, setGroupCodes] = useState<any[]>([]);
  const { errors, touched, handleSubmit, getFieldProps } = formik;
  const companyId: string = String(config.companyId);

  const handleCancel = () => {
    // Go back to the previous page
    window.history.back();
  };

  useEffect(() => {
    getAllAccountGroups(companyId)
      .then((accountGroupList) => {
        if (Array.isArray(accountGroupList)) {
          const names = accountGroupList.map((account) => ({
            id: account.id,
            name: account.name
          }));
          setGroupCodes(names);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [companyId]);

  const handleSwitchChange = () => {};
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <MainCard title="Create New COA">
              <Grid container direction="column" spacing={2} alignItems="left">
                <Grid container item xs={6} spacing={2}>
                  <Grid item xs={4}>
                    <Stack spacing={0.1}>
                      <InputLabel htmlFor="coa-name">Name</InputLabel>
                      <TextField
                        fullWidth
                        id="coa-name"
                        type="text"
                        placeholder="Enter Name"
                        {...getFieldProps('name')}
                        error={Boolean(touched.name && errors.name)}
                        helperText={touched.name && errors.name ? 'Please Enter Name' : ''}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={3}>
                    <Stack spacing={0.1}>
                      <InputLabel htmlFor="coa-alternativeName">Alternative Name</InputLabel>
                      <TextField
                        fullWidth
                        id="coa-alternativeName"
                        type="text"
                        placeholder="Enter Alternative Name"
                        {...getFieldProps('alternativeName')}
                        error={Boolean(touched.alternativeName && errors.alternativeName)}
                        helperText={touched.alternativeName && errors.alternativeName ? 'Please Enter Alternative Name' : ''}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={3}>
                    <Stack spacing={0.1}>
                      <InputLabel htmlFor="coa-type">Type</InputLabel>
                      <TextField
                        fullWidth
                        id="coa-type"
                        type="text"
                        placeholder="Enter Type"
                        {...getFieldProps('type')}
                        error={Boolean(touched.type && errors.type)}
                        helperText={touched.type && errors.type ? 'Please Enter Type' : ''}
                      />
                    </Stack>
                  </Grid>
                </Grid>

                <Grid container item xs={9} spacing={2}>
                  <Grid item xs={4}>
                    <Stack spacing={0.1}>
                      <InputLabel htmlFor="groupCode">Group Code</InputLabel>
                      <Autocomplete
                        fullWidth
                        id="groupCode"
                        options={groupCodes}
                        getOptionLabel={(option) => option.name}
                        sx={{ width: '100%' }}
                        renderInput={(params) => (
                          <TextField
                            placeholder="Enter Group Code"
                            {...params}
                            error={Boolean(touched.groupCode && errors.groupCode)}
                            helperText={touched.groupCode && errors.groupCode ? 'Please Enter Group Code' : ''}
                          />
                        )}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={3}>
                    <Stack spacing={0.1}>
                      <InputLabel htmlFor="coa-dueDays">Due Days</InputLabel>
                      <TextField
                        fullWidth
                        id="coa-dueDays"
                        type="number"
                        placeholder="Enter Due Days"
                        {...getFieldProps('dueDays')}
                        inputProps={{
                          step: 1, // Enforce whole numbers only
                          onInput: (e) => {
                            // Allow only whole numbers
                            const inputValue = Math.max(0, parseInt(e.currentTarget.value) || 0);
                            e.currentTarget.value = inputValue.toString();
                          }
                        }}
                        error={Boolean(touched.dueDays && errors.dueDays)}
                        helperText={touched.dueDays && errors.dueDays ? (errors.dueDays as React.ReactNode) : ''}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={3}>
                    <Stack spacing={0.1}>
                      <InputLabel htmlFor="remark">Remark</InputLabel>
                      <TextField
                        fullWidth
                        type="text"
                        id="remark"
                        placeholder="Enter Remark"
                        {...getFieldProps('remark')}
                        error={Boolean(touched.remark && errors.remark)}
                        helperText={touched.remark && errors.remark ? 'Please Enter Remark' : ''}
                      />
                    </Stack>
                  </Grid>
                </Grid>

                <Grid container item xs={9} spacing={1}>
                  <Grid item xs={4}>
                    <Stack spacing={1} direction="row">
                      <Tooltip title={true ? 'True' : 'False'}>
                        <FormControlLabel
                          value=""
                          control={<Switch color="info" checked={true} onChange={handleSwitchChange} />}
                          label="Ledger"
                          labelPlacement="start"
                          sx={{ margin: '0', padding: '0', marginRight: 0, whiteSpace: 'nowrap' }}
                        />
                      </Tooltip>
                      <Tooltip title={true ? 'True' : 'False'}>
                        <FormControlLabel
                          value=""
                          control={<Switch color="info" checked={true} onChange={handleSwitchChange} />}
                          label="Show Out"
                          labelPlacement="start"
                          sx={{ margin: '0', padding: '0', marginRight: 0, whiteSpace: 'nowrap' }}
                        />
                      </Tooltip>
                      <Tooltip title={true ? 'True' : 'False'}>
                        <FormControlLabel
                          value=""
                          control={<Switch color="info" checked={true} onChange={handleSwitchChange} />}
                          label="TDS TCS"
                          labelPlacement="start"
                          sx={{ margin: '0', padding: '0', marginRight: 0, whiteSpace: 'nowrap' }}
                        />
                      </Tooltip>
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack spacing={0.1}>
                      <InputLabel htmlFor="description">Description</InputLabel>
                      <TextField
                        fullWidth
                        id="description"
                        type="text"
                        multiline // This enables the multiline text field
                        rows={4}
                        placeholder="Enter Description"
                        {...getFieldProps('description')}
                        error={Boolean(touched.description && errors.description)}
                        helperText={touched.description && errors.description ? 'Please Enter Description' : ''}
                      />
                    </Stack>
                  </Grid>
                </Grid>
                <Grid container item xs={12}>
                  <Grid item xs={12}>
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                      <Button type="submit" variant="contained">
                        Save
                      </Button>
                      <Button variant="contained" color="error" onClick={handleCancel}>
                        Cancel
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
            </MainCard>
          </Form>
        </FormikProvider>
      </Grid>
    </Grid>
  );
};
export default AddCOA;
