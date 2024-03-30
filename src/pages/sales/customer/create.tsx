// material-ui
import { Button, Grid, InputLabel, Stack, TextField } from "@mui/material";

// project imports
import MainCard from "components/MainCard";

// assets
import { useState } from "react";

// third-party
import * as Yup from "yup";
import { useFormik, FormikValues, Form, FormikProvider } from "formik";

// project imports
import AlertCustomerDelete from "./AlertCustomerDelete";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";
//import { updateCustomerRequest } from "api/services/SalesService";
//import config from "config";
import { createUserRequest } from "api/services/CommonService";
// constant
const getInitialValues = (user: FormikValues | null) => {
  if (user) {
    const newUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
    return newUser;
  } else {
    const newUser = {
      id: "",
      firstName: "",
      lastName: "",
      email: "",
    };
    return newUser;
  }
};
// ==============================|| CUSTOMER ADD / EDIT ||============================== //

export interface Props {
  user?: any;
  onCancel: () => void;
}
const AddUser = ({ user, onCancel }: Props) => {
  const isCreating = !user;
  const UserSchema = Yup.object().shape({
    firstName: Yup.string().max(255).required("Please Enter First Name"),
    lastName: Yup.string().max(255).required("Please Enter Last Name"),
    email: Yup.string()
      .max(255)
      .required("Please Enter E-mail Address")
      .matches(
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        "E-Mail Address Is Not Valid"
      ),
  });

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    onCancel();
  };

  const inputProps = {
    style: { borderRadius: 8 },
  };

  const handleCancel = () => {
    // Go back to the previous page
    window.history.back();
  };

  const formik = useFormik({
    initialValues: getInitialValues(user!),
    enableReinitialize: true,
    validationSchema: UserSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const userData = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
        };
        const response = await createUserRequest(userData);
        if (response === 200) {
          dispatch(
            openSnackbar({
              open: true,
              message: "User added successfully.",
              anchorOrigin: { vertical: "top", horizontal: "right" },
              variant: "alert",
              alert: {
                color: "success",
              },
              close: false,
            })
          );
          window.location.reload();
        }

        setSubmitting(false);
        onCancel();
      } catch (error) {
        console.error(error);
      }
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <MainCard title={user ? "Edit Customer" : "New User"}>
              <Grid container direction="column" spacing={2} alignItems="left">
                <Grid container item xs={6} spacing={2}>
                  <Grid item xs={2}>
                    <Stack spacing={0.1}>
                      <InputLabel htmlFor="user-name">First Name</InputLabel>
                      <TextField
                        fullWidth
                        id="firstName"
                        type="text"
                        placeholder="Enter Full Name"
                        {...getFieldProps("firstName")}
                        error={Boolean(touched.firstName && errors.firstName)}
                        helperText={
                          touched.firstName && errors.firstName
                            ? "Please enter your First Name"
                            : ""
                        }
                        InputProps={inputProps}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={2}>
                    <Stack spacing={0.1}>
                      <InputLabel htmlFor="user-lastName">Last Name</InputLabel>
                      <TextField
                        fullWidth
                        id="user-lastName"
                        type="text"
                        placeholder="Enter Last Name"
                        {...getFieldProps("lastName")}
                        error={Boolean(touched.lastName && errors.lastName)}
                        helperText={
                          touched.lastName && errors.lastName
                            ? "Please Enter Last Name"
                            : ""
                        }
                        InputProps={inputProps}
                      />
                    </Stack>
                  </Grid>
                </Grid>
                <Grid container item xs={10} spacing={2}>
                  <Grid item xs={4}>
                    <Stack spacing={0.1}>
                      <InputLabel htmlFor="user-email">E-mail</InputLabel>
                      <TextField
                        fullWidth
                        id="user-email"
                        type="email"
                        placeholder="Enter Email"
                        InputProps={inputProps}
                        {...getFieldProps("email")}
                        error={Boolean(touched.email && errors.email)}
                        helperText={
                          touched.email && errors.email
                            ? (errors.email as React.ReactNode)
                            : ""
                        }
                      />
                    </Stack>
                  </Grid>
                </Grid>

                <Grid
                  container
                  direction="column"
                  spacing={2}
                  alignItems="left"
                >
                  <Grid item xs={3}>
                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent="flex-end"
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                      >
                        {user ? "Edit" : "Add"}
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
            </MainCard>
          </Form>
        </FormikProvider>
        {!isCreating && (
          <AlertCustomerDelete
            title={user.fatherName}
            open={openAlert}
            handleClose={handleAlertClose}
            id={user.Id}
          />
        )}
      </Grid>
    </Grid>
  );
};
export default AddUser;
