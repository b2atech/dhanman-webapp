// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Divider,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  FormControl,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from '@mui/material';

// third-party
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { getAllVendors } from 'api/services/BillService';

type AddressModalType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handlerAddress: (a: any) => void;
};

// ==============================|| INVOICE - SELECT ADDRESS ||============================== //

const AddressBillModal = ({ open, setOpen, handlerAddress }: AddressModalType) => {
  function closeAddressModal() {
    setOpen(false);
  }

  return (
    <Dialog
      maxWidth="sm"
      open={open}
      onClose={closeAddressModal}
      sx={{ '& .MuiDialog-paper': { p: 0 }, '& .MuiBackdrop-root': { opacity: '0.5 !important' } }}
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Select Address</Typography>
          <Button startIcon={<PlusOutlined />} onClick={closeAddressModal} color="primary">
            Add New
          </Button>
        </Stack>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 2.5 }}>
        <FormControl sx={{ width: '100%', pb: 2 }}>
          <TextField
            autoFocus
            id="name"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined />
                </InputAdornment>
              )
            }}
            placeholder="Search"
            fullWidth
          />
        </FormControl>
        <Stack spacing={2}>
          <Address handlerAddress={handlerAddress} />
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2.5 }}>
        <Button color="error" onClick={closeAddressModal}>
          Cancel
        </Button>
        <Button onClick={closeAddressModal} color="primary" variant="contained">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

type AddressProps = {
  handlerAddress: (e: any) => void;
};
const Address = ({ handlerAddress }: AddressProps) => {
  const theme = useTheme();
  const [address, setAddress] = useState([]);
  useEffect(() => {
    getAllVendors('3fa85f64-5717-4562-b3fc-2c963f66afa6').then((addressList) => setAddress(addressList));
  }, []);

  return (
    <>
      {address.map((customer: any) => (
        <Box
          onClick={() => handlerAddress(customer)}
          key={customer.email}
          sx={{
            width: '100%',
            border: '1px solid',
            borderColor: 'grey.200',
            borderRadius: 1,
            p: 1.25,
            '&:hover': {
              bgcolor: theme.palette.primary.lighter,
              borderColor: theme.palette.primary.lighter
            }
          }}
        >
          <Typography textAlign="left" variant="subtitle1">
            {customer.name}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Typography textAlign="left" variant="body2" color="secondary">
              {customer.id}
            </Typography>
            <Typography textAlign="left" variant="body2" color="secondary">
              {customer.address}
            </Typography>
            <Typography textAlign="left" variant="body2" color="secondary">
              {customer.phoneNumber}
            </Typography>
            <Typography textAlign="left" variant="body2" color="secondary">
              {customer.email}
            </Typography>
          </Stack>
        </Box>
      ))}
    </>
  );
};

export default AddressBillModal;
