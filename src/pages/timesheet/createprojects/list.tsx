/* eslint-disable prettier/prettier */
// material-ui

import { Button, Divider, Grid, InputLabel, Stack, TextField } from '@mui/material';

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';

// assets

import MainCard from 'components/MainCard';
// import trimFc from 'utils/trimFc';

// validation schema
const validationSchema = yup.object({
  projectdescription: yup.string().required('projectdescription required').nullable(),
  assignedto: yup.string().required('assignedto required'),
  projectname: yup.string().required('projectname required'),
  projectid: yup.string().required('projectid is required'),
  estimatetime: yup.string().required('estimatetime is required'),
  spenttime: yup.string().required('spenttime is required'),
  remainingtime: yup.string().required('remainingtime is required')
});

// ==============================|| FORMS VALIDATION - ADDRESS ||============================== //

function GoogleMapAutocomplete() {
  const formik = useFormik({
    initialValues: {
      projectdescription: '',
      assignedto: '',
      estimatetime: '',
      projectname: '',
      projectid: '',
      spenttime: '',
      remainingtime: ''
    },
    validationSchema,
    onSubmit: async (values, { setErrors, setStatus, setSubmitting }) => {
      // submit location
    }
  });

  return (
    <MainCard>
      <form
        onSubmit={formik.handleSubmit}
        id="google-map-forms">
        <Grid
          container
          spacing={3.5}>
          <Grid
            item
            xs={12}
            sm={6}>
            <Stack spacing={1}>
              <InputLabel>Project Name</InputLabel>
              <TextField
                id="projectname"
                name="projectname"
                placeholder="Enter Project Name"
                value={formik.values.projectname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.projectname && Boolean(formik.errors.projectname)}
                helperText={formik.touched.projectname && formik.errors.projectname}
                fullWidth
              />
            </Stack>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}>
            <Stack spacing={1}>
              <InputLabel>Project ID</InputLabel>
              <TextField
                id="projectid"
                name="projectid"
                placeholder="Enter Project ID"
                value={formik.values.projectid}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.projectid && Boolean(formik.errors.projectid)}
                helperText={formik.touched.projectid && formik.errors.projectid}
                fullWidth
              />
            </Stack>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}>
            <Stack spacing={1}>
              <InputLabel>Project Description</InputLabel>
              <TextField
                id="projectdescription"
                name="projectdescription"
                placeholder="Description"
                value={formik.values.projectdescription}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.projectdescription && Boolean(formik.errors.projectdescription)}
                helperText={formik.touched.projectdescription && formik.errors.projectdescription}
                fullWidth
              />
            </Stack>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}>
            <Stack spacing={1}>
              <InputLabel>Assigned to</InputLabel>
              <TextField
                id="assignedto"
                name="assignedto"
                placeholder="Task assigned to"
                value={formik.values.assignedto}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.assignedto && Boolean(formik.errors.assignedto)}
                helperText={formik.touched.assignedto && formik.errors.assignedto}
                fullWidth
              />
            </Stack>
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}>
            <Stack spacing={1}>
              <InputLabel>Estimate Time</InputLabel>
              <TextField
                id="estimatetime"
                name="estimatetime"
                placeholder="Enter Estimate Hours"
                value={formik.values.estimatetime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.estimatetime && Boolean(formik.errors.estimatetime)}
                helperText={formik.touched.estimatetime && formik.errors.estimatetime}
                fullWidth
              />
            </Stack>
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}>
            <Stack spacing={1}>
              <InputLabel>Spent Time</InputLabel>
              <TextField
                id="spenttime"
                name="spenttime"
                placeholder="Enter Spent Time"
                value={formik.values.spenttime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.spenttime && Boolean(formik.errors.spenttime)}
                helperText={formik.touched.spenttime && formik.errors.spenttime}
                fullWidth
              />
            </Stack>
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}>
            <Stack spacing={1}>
              <InputLabel>Remaining Time</InputLabel>
              <TextField
                id="remainingtime"
                name="remainingtime"
                placeholder="Enter Remaining Time"
                value={formik.values.remainingtime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.remainingtime && Boolean(formik.errors.remainingtime)}
                helperText={formik.touched.remainingtime && formik.errors.remainingtime}
                fullWidth
              />
            </Stack>
          </Grid>
          <Grid
            item
            xs={12}>
            <Divider />
          </Grid>
          <Grid
            item
            xs={12}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              spacing={2}>
              <Button
                variant="outlined"
                color="secondary"
                type="reset"
                onClick={() => formik.resetForm()}>
                Undo Changes
              </Button>
              <Button
                variant="contained"
                type="submit"
                disabled={formik.isSubmitting}>
                Update
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </MainCard>
  );
}

export default GoogleMapAutocomplete;
