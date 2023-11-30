// material-ui
import { Grid, InputLabel, Stack, TextField, Chip, Button, DialogActions } from '@mui/material';

// ==============================|| ADD PRODUCTS  ||============================== //

export default function Goods() {
  return (
    <>
      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <InputLabel>Goods Name</InputLabel>
            <TextField
              autoFocus
              required
              id="goodsName"
              name="Goods Name"
              placeholder="Enter Goods Name"
              fullWidth
              autoComplete="given-name"
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <InputLabel>Description</InputLabel>
            <TextField
              required
              id="description"
              name="Description Name"
              placeholder="Enter Description"
              fullWidth
              autoComplete="family-name"
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <InputLabel>Category Name</InputLabel>
            <TextField required id="CategoryName" name="Category Name" placeholder="Enter Category" fullWidth autoComplete="given-name" />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <InputLabel>Unit</InputLabel>
            <TextField required id="UnitName" name="Unit Name" placeholder="Enter Unit" fullWidth autoComplete="given-name" />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ paddingBottom: 2.5 }}>
          <Stack spacing={0.5}>
            <InputLabel>HSN No.</InputLabel>
            <TextField required id="hsnCode" name="HSN Code" placeholder="Enter HSN" fullWidth autoComplete="given-name" />
          </Stack>
        </Grid>

        <Grid container spacing={2.5}>
          <Grid item xs={12} sm>
            <Stack spacing={0.5} sx={{ paddingLeft: 3 }}>
              <InputLabel>SGST</InputLabel>
              <TextField required id="sgst" name="sgstno" placeholder="Enter SGST" fullWidth autoComplete="family-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm>
            <Stack spacing={0.5} sx={{ paddingLeft: 1 }}>
              <InputLabel>CGST</InputLabel>
              <TextField required id="cgst" name="cgstno" placeholder="Enter CGST" fullWidth autoComplete="family-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm>
            <Stack spacing={0.5} sx={{ paddingLeft: 1 }}>
              <InputLabel>IGST</InputLabel>
              <TextField required id="igst" name="igstno" placeholder="Enter IGST" fullWidth autoComplete="family-name" />
            </Stack>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <InputLabel>Supplier Name</InputLabel>
            <TextField
              required
              id="suppliername"
              name="suppliernames"
              placeholder="Enter Supplier Name"
              fullWidth
              autoComplete="shipping address-level2"
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <InputLabel>Buy Price</InputLabel>
            <TextField id="buyprice" name="buypricename" placeholder="Enter Buy Price" fullWidth />
          </Stack>
        </Grid>

        <Grid item xs={12} sm={12}>
          <Chip color="info" label="Track Stock" />
          <Grid item xs={12} sm={2} sx={{ paddingBottom: 2.5 }}>
            <Stack spacing={0.5}>
              <InputLabel>Initial Stock Level</InputLabel>
              <TextField
                required
                id="initailstockid"
                name="initailstock"
                placeholder="Enter Initial Stock"
                fullWidth
                autoComplete="shipping country"
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Stack spacing={0.5}>
              <InputLabel>Low Stock Threshold</InputLabel>
              <TextField
                required
                id="lowstockthresholdid"
                name="lowstockthreshold"
                placeholder="Enter Low Stock"
                fullWidth
                autoComplete="shipping country"
              />
            </Stack>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={12}>
          <DialogActions sx={{ p: 2.5 }}>
            <Grid container justifyContent="flex-end" alignItems={'end'}>
              <Grid item>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button type="submit" color="primary" variant="contained">
                    Add
                  </Button>
                  <Button variant="contained" type="reset" color="error">
                    Cancel
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </DialogActions>
        </Grid>
      </Grid>
    </>
  );
}
