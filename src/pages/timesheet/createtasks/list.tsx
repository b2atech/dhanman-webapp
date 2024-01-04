/* eslint-disable prettier/prettier */
// material-ui
import { useTheme } from '@mui/material/styles';
import { Autocomplete, Button, Divider, FormHelperText, Grid, InputLabel, Stack, TextField } from '@mui/material';

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useState, useEffect } from 'react';
import { IProject } from 'types/timeSheet';

// project imports
import { getAllProjects } from 'api/services/TimeSheetService';
// import countries from 'data/countries';

// assets

import MainCard from 'components/MainCard';
// import trimFc from 'utils/trimFc';

// validation schema
const validationSchema = yup.object({
  projectName: yup.string().required('Project Name is required').nullable(),
  spenttime: yup.string().required('Spent time required'),
  remainingtime: yup.string().required('Remaining time required'),
  taskID: yup.string().required('Task ID is required'),
  taskname: yup.string().required('Task Name is required'),
  estimatetime: yup.string().required('Task ID is required'),
  assignedto: yup.string().required('Assignmnet is required')
});

// ==============================|| FORMS VALIDATION - ADDRESS ||============================== //

function GoogleMapAutocomplete() {
  const theme = useTheme();

  const formik = useFormik({
    initialValues: {
      taskID: '',
      estimatetime: '',
      taskname: '',
      remainingtime: '',
      spenttime: '',
      projectName: '',
      assignedto: ''
    },
    validationSchema,
    onSubmit: async (values, { setErrors, setStatus, setSubmitting }) => {
      // submit location
    }
  });

  const [projects, setProjects] = useState<IProject[]>([]);
  useEffect(() => {
    getAllProjects().then((projectsList) => {
      if (Array.isArray(projectsList)) {
        setProjects(projectsList);
      }
    });
  }, []);

  const projectName: string[] = projects.map((project) => project.name);

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
              <InputLabel>Select Project</InputLabel>
              <Autocomplete
                id="projectName"
                value={formik.values.projectName}
                onChange={(event: any, newValue: string | null) => {
                  formik.setFieldValue('projectName', newValue);
                }}
                options={projectName}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select Project"
                    sx={{ '& .MuiAutocomplete-input.Mui-disabled': { WebkitTextFillColor: theme.palette.text.primary } }}
                  />
                )}
              />
              {formik.touched.projectName && formik.errors.projectName && (
                <FormHelperText
                  error
                  id="helper-text-projectName">
                  {formik.errors.projectName}
                </FormHelperText>
              )}
            </Stack>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}>
            <Stack spacing={1}>
              <InputLabel>Task Name</InputLabel>
              <TextField
                id="taskname"
                name="taskname"
                placeholder="Enter Task Name"
                value={formik.values.taskname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.taskname && Boolean(formik.errors.taskname)}
                helperText={formik.touched.taskname && formik.errors.taskname}
                fullWidth
              />
            </Stack>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}>
            <Stack spacing={1}>
              <InputLabel>Task ID</InputLabel>
              <TextField
                id="taskID"
                name="taskID"
                placeholder="Enter Task ID"
                value={formik.values.taskID}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.taskID && Boolean(formik.errors.taskID)}
                helperText={formik.touched.taskID && formik.errors.taskID}
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
