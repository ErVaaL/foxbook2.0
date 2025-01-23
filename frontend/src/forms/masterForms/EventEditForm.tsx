import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { DialogContent, Button, TextField, DialogActions } from "@mui/material";
import { Event } from "../../contexts/masterControlContext/subMasterContext/MasterEventsContext";

interface Props {
  event: Event;
  onSave: (id: string, updatedData: Partial<Event>) => Promise<void>;
  onClose: () => void;
}

const EditEventForm: React.FC<Props> = ({ event, onSave, onClose }) => {
  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    event_date: Yup.string().required("Event Date is required"),
  });

  const formik = useFormik({
    initialValues: {
      title: event.title,
      description: event.description,
      event_date: event.event_date,
    },
    validationSchema,
    onSubmit: async (values) => {
      await onSave(event.id, values);
      onClose();
    },
  });

  type FormFields = keyof typeof formik.values;

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
          { name: "title", label: "Event title", type: "text" },
          { name: "description", label: "Description", type: "textarea" },
          {
            name: "event_date",
            label: "Event Date",
            type: "date",
          },
        ].map((field) => (
          <TextField
            key={field.name}
            name={field.name as FormFields}
            label={field.label}
            type={field.type}
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
          ></TextField>
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

export default EditEventForm;
