// material-ui
import { Button, Dialog, DialogContent, Stack, Typography } from '@mui/material';

// project import
import Avatar from 'components/@extended/Avatar';
import { PopupTransition } from 'components/@extended/Transitions';
import { openSnackbar } from 'store/reducers/snackbar';
import { deleteProductRequest } from 'api/services/InventoryService';
import { useDispatch } from 'store';

// assets
import { DeleteFilled } from '@ant-design/icons';

// types
interface Props {
  title: string;
  open: boolean;
  handleClose: (status: boolean) => void;
  id: string;
}

// ==============================|| Product - DELETE ||============================== //

export default function AlertProductDelete({ title, open, handleClose, id }: Props) {
  const dispatch = useDispatch();
  const deleteProduct = () => {
    handleClose(true);
    deleteProductRequest(id).then(() => {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Product deleted successfully',
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      );
      window.location.reload();
    });
  };

  return (
    <Dialog
      open={open}
      onClose={() => handleClose(false)}
      keepMounted
      TransitionComponent={PopupTransition}
      maxWidth="xs"
      aria-labelledby="column-delete-title"
      aria-describedby="column-delete-description"
    >
      <DialogContent sx={{ mt: 2, my: 1 }}>
        <Stack alignItems="center" spacing={3.5}>
          <Avatar color="error" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
            <DeleteFilled />
          </Avatar>
          <Stack spacing={2}>
            <Typography variant="h4" align="center">
              Are you sure you want to delete "{title}" ?
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ width: 1 }}>
            <Button fullWidth onClick={() => handleClose(false)} color="secondary" variant="outlined">
              Cancel
            </Button>
            <Button fullWidth color="error" variant="contained" onClick={deleteProduct} autoFocus>
              Delete
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
