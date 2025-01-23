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
import { Group } from "../../contexts/masterControlContext/subMasterContext/MasterGroupsContext";

interface Props {
  group: Group;
  onSave: (id: string, updatedData: Partial<Group>) => Promise<void>;
  onClose: () => void;
}

const EditGroupForm: React.FC<Props> = ({ group, onSave, onClose }) => {
  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Group Name is required")
      .min(3, "Group Name must be at least 3 characters"),
    description: Yup.string()
      .required("Description is required")
      .min(3, "Description must be at least 3 characters"),
    is_public: Yup.boolean().required("Public status is required"),
  });

  type FormFields = keyof typeof formik.values;

  const formik = useFormik({
    initialValues: {
      name: group.name,
      description: group.description,
      is_public: group.is_public,
    },
    validationSchema,
    onSubmit: async (values) => {
      await onSave(group.id, values);
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
          { name: "name", label: "Group Name", type: "text" },
          { name: "description", label: "Description", type: "textarea" },
          {
            name: "is_public",
            label: "Public Group",
            type: "select",
            options: [
              { value: true, label: "Public" },
              { value: false, label: "Private" },
            ],
          },
        ].map((field) => (
          <TextField
            key={field.name}
            name={field.name as FormFields}
            label={field.label}
            type={field.type}
            select={field.type === "select"}
            multiline={field.type === "textarea"}
            rows={field.type === "textarea" ? 4 : undefined}
            value={formik.values[field.name as FormFields]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched[field.name as FormFields] &&
              !!formik.errors[field.name as FormFields]
            }
            helperText={
              formik.touched[field.name as FormFields] &&
              formik.errors[field.name as FormFields]
            }
            fullWidth
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
          >
            {field.type === "select" &&
              field.options?.map((option, index) => (
                <MenuItem key={index} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
          </TextField>
        ))}
      </DialogContent>
      <DialogActions className="bg-[#2e2e2a] outline-orange-500 dark:border-t dark:border-gray-600">
        <Button
          sx={{ color: "#fa0022", "&:hover": { color: "#a50022" } }}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          sx={{
            backgroundColor: "#367316",
            color: "white",
            "&:hover": { backgroundColor: "#005a00" },
          }}
          type="submit"
        >
          Save
        </Button>
      </DialogActions>
    </form>
  );
};

export default EditGroupForm;
