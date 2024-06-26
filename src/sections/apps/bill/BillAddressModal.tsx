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

// ==============================|| BILL - SELECT ADDRESS ||============================== //

const AddressBillModal = ({ open, setOpen, handlerAddress }: AddressModalType) => {
  const [selectedVendor, setSelectedVendor] = useState(null);

  function closeAddressModal() {
    setOpen(false);
    setSelectedVendor(null);
  }
  function addAddress() {
    if (selectedVendor) {
      handlerAddress(selectedVendor);
    }
    closeAddressModal();
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
      <DialogContent sx={{ p: 2.5, height: '500px', width: '400px' }}>
        <Stack spacing={2}>
          <Address handlerAddress={(value) => setSelectedVendor(value)} />
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2.5 }}>
        <Button color="error" onClick={closeAddressModal}>
          Cancel
        </Button>
        <Button onClick={addAddress} color="primary" variant="contained">
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
  const [addressList, setAddressList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getAllVendors('3fa85f64-5717-4562-b3fc-2c963f66afa6').then((vendorList) => setAddressList(vendorList));
  }, []);

  const filteredAddressList = addressList.filter((vendor: any) => `${vendor.vendorName}`.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <>
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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </FormControl>

      {filteredAddressList.map((vendorList: any) => (
        <Box
          onClick={() => handlerAddress(vendorList)}
          key={vendorList.id}
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
            {`${vendorList.firstName} ${vendorList.lastName}`}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Typography textAlign="left" variant="body2" color="secondary">
              {vendorList.email}
            </Typography>
            <Typography textAlign="left" variant="body2" color="secondary">
              {vendorList.phoneNumber}
            </Typography>
            <Typography textAlign="left" variant="body2" color="secondary">
              {vendorList.addressLine}
            </Typography>
          </Stack>
          <Typography textAlign="left" variant="body2" color="secondary">
            {vendorList.gstIn}
          </Typography>
        </Box>
      ))}
    </>
  );
};

export default AddressBillModal;
