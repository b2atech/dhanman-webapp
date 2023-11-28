import { Button, Divider, Grid, InputLabel, Stack, TextField, FormControl, Autocomplete, FormHelperText } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import MainCard from 'components/MainCard';
import React, { useEffect, useState } from 'react';
import { getAllCustomers } from 'api/services/SalesService';

// Define validation schema using Yup
const validationSchema = Yup.object({
  customername: Yup.string().required('Customer Name is required'),
  receiveddate: Yup.date().required('Date is required'),
  amount: Yup.string().max(255).required('Amount is Required'),
  modeofpayment: Yup.string().required('Mode Of Payment is required')
});

const options = ['Cash', 'Check', 'Bank Remittance', 'Credit Card'];
function PaymentRecieved() {
  const navigate = useNavigate();
  const [value, setMode] = React.useState<string | null>(options[0]);
  const [inputValue, setInputValue] = React.useState('');
  const [customernames, setCustomerNames] = useState<any>();

  useEffect(() => {
    getAllCustomers('3fa85f64-5717-4562-b3fc-2c963f66afa6')
      .then((customerList) => {
        if (Array.isArray(customerList)) {
          const names = customerList.map((customer) => `${customer.firstName} ${customer.lastName}`);
          setCustomerNames(names);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <MainCard>
      <Formik
        initialValues={{
          customername: '',
          receiveddate: null,
          amount: '',
          emailAddress: '',
          city: '',
          modeofpayment: '',
          description: ''
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          resetForm();
        }}
      >
        {({ handleChange, handleSubmit, values, errors, touched, resetForm }) => (
          <Form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={0.5}>
                  <InputLabel>Customer Name</InputLabel>
                  <FormControl sx={{ width: '50%' }} error={Boolean(touched.customername && errors.customername)}>
                    {customernames && customernames.length > 0 ? (
                      <Autocomplete
                        value={values.customername}
                        onChange={(event: any, newValue: string | null) => {
                          handleChange({ target: { name: 'customername', value: newValue } });
                        }}
                        id="controllable-states-demo"
                        options={customernames}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={Boolean(touched.customername && errors.customername)}
                            helperText={touched.customername && errors.customername ? errors.customername : ''}
                          />
                        )}
                      />
                    ) : (
                      <div>Loading...</div>
                    )}
                  </FormControl>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel>Date</InputLabel>
                  <FormControl sx={{ width: '50%' }} error={Boolean(touched.receiveddate && errors.receiveddate)}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <TextField
                        type="date"
                        variant="outlined"
                        fullWidth
                        InputLabelProps={{
                          shrink: true
                        }}
                        value={values.receiveddate}
                        onChange={(e) => {
                          handleChange({ target: { name: 'receiveddate', value: e.target.value } });
                        }}
                        error={Boolean(touched.receiveddate && errors.receiveddate)}
                      />
                    </LocalizationProvider>
                    {touched.receiveddate && errors.receiveddate && <FormHelperText error={true}>{errors.receiveddate}</FormHelperText>}
                  </FormControl>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={0.5}>
                  <InputLabel>Amount</InputLabel>
                  <FormControl>
                    <TextField
                      type="number"
                      style={{ width: '50%' }}
                      id="amount"
                      name="amount"
                      placeholder="Enter Amount"
                      value={values.amount}
                      onChange={handleChange}
                      fullWidth
                      inputProps={{ style: { textAlign: 'right' } }}
                      error={Boolean(touched.amount && errors.amount)}
                      helperText={touched.amount && errors.amount ? 'Please Enter Some Amount' : ''}
                    />
                  </FormControl>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={0.5}>
                  <InputLabel>Mode of Payment</InputLabel>
                  <FormControl sx={{ width: '50%' }} error={Boolean(touched.modeofpayment && errors.modeofpayment)}>
                    <Autocomplete
                      value={value}
                      onChange={(event: any, newValue: string | null) => {
                        setMode(newValue);
                        handleChange({ target: { name: 'modeofpayment', value: newValue } });
                      }}
                      inputValue={inputValue}
                      onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue);
                      }}
                      id="controllable-states-demo"
                      options={options}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={Boolean(touched.modeofpayment && errors.modeofpayment)}
                          helperText={touched.modeofpayment && errors.modeofpayment ? errors.modeofpayment : ''}
                        />
                      )}
                    />
                  </FormControl>
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack spacing={0.5}>
                  <InputLabel>Description</InputLabel>
                  <FormControl>
                    <TextField
                      style={{ width: '50%' }}
                      id="description"
                      type="text"
                      name="description"
                      placeholder="Enter Description Here"
                      value={values.description}
                      onChange={handleChange}
                      fullWidth
                    />
                  </FormControl>
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={2}>
                  <Button variant="contained" color="error" onClick={() => navigate('/master/customers')}>
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    type="reset"
                    color="secondary"
                    onClick={() => {
                      resetForm();
                      setMode(null);
                      setInputValue('');
                    }}
                  >
                    Reset
                  </Button>
                  <Button variant="contained" color="success" type="submit">
                    Save
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </MainCard>
  );
}

export default PaymentRecieved;
