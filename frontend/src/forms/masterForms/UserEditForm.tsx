import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { User } from "../../contexts/masterControlContext/subMasterContext/MasterUsersContext";

interface Props {
  user: User;
  onSave: (id: string, updatedData: Partial<User>) => Promise<void>;
  onClose: () => void;
}

const EditUserForm: React.FC<Props> = ({ user, onSave, onClose }) => {
  const validationSchema = Yup.object({
    first_name: Yup.string()
      .required("First Name is required")
      .min(3, "First Name must be at least 3 characters"),
    last_name: Yup.string()
      .required("Last Name is required")
      .min(3, "Last Name must be at least 3 characters"),
    username: Yup.string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    birthday: Yup.date().required("Birthday is required"),
    phone: Yup.string()
      .matches(/^[0-9]+$/, "Phone number must contain only digits")
      .min(9, "Phone number must be at least 9 digits")
      .max(15, "Phone number cannot exceed 15 digits"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .optional(),
  });

  type FormFields = keyof typeof formik.values;

  const formik = useFormik({
    initialValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone || "",
      username: user.username,
      birthday: user.birthday || "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const updateData: Partial<User> = {
        first_name: values.first_name,
        last_name: values.last_name,
        username: values.username,
        birthday: values.birthday,
        email: values.email,
        phone: values.phone,
      };

      if (values.password) {
        updateData.password_digest = values.password;
      }

      await onSave(user.id, updateData);
      onClose();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <DialogContent
        className="dark:bg-[#1a1a1a] dark:text-gray-300"
        sx={{
          backgroundColor: { xs: "white", md: "#1a1a1a" },
          color: { xs: "black", md: "white" },
        }}
      >
        {[
          { name: "first_name", label: "First Name" },
          { name: "last_name", label: "Last Name" },
          { name: "username", label: "Username" },
          { name: "email", label: "Email" },
          { name: "phone", label: "Phone" },
          { name: "birthday", label: "Birthday", type: "date" },
          {
            name: "password",
            label: "Password (Leave blank to keep current)",
            type: "password",
          },
        ].map((field) => (
          <TextField
            key={field.name}
            fullWidth
            label={field.label}
            name={field.name}
            type={field.type || "text"}
            value={formik.values[field.name as FormFields]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched[field.name as FormFields] &&
              Boolean(formik.errors[field.name as FormFields])
            }
            helperText={
              formik.touched[field.name as FormFields] &&
              formik.errors[field.name as FormFields]
            }
            margin="dense"
            sx={{
              "& label": { color: "#b0b0b0" },
              "& label.Mui-focused": { color: "#e0e0e0" },
              "& .MuiInputBase-root": {
                backgroundColor: "#2e2e2e",
                color: "#e0e0e0",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#555",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#888",
              },
              "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#aaa",
              },
            }}
          />
        ))}

        <TextField
          select
          fullWidth
          label="Role"
          name="role"
          value={user.role}
          disabled
          margin="dense"
          sx={{
            "& label": { color: "#b0b0b0" },
            "& .MuiInputBase-root": {
              backgroundColor: "#2e2e2e",
              color: "#e0e0e0",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#555",
            },
          }}
        >
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="superadmin">Super Admin</MenuItem>
        </TextField>
      </DialogContent>

      <DialogActions className="bg-[#2e2e2a] outline-orange-500 dark:border-t dark:border-gray-600">
        <Button
          onClick={onClose}
          sx={{ color: "#fa0022", "&:hover": { color: "#a50022" } }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          sx={{
            backgroundColor: "#367316",
            color: "white",
            "&:hover": { backgroundColor: "#005a00" },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </form>
  );
};

export default EditUserForm;
