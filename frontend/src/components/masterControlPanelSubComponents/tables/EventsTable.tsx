import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Event } from "../../../contexts/masterControlContext/subMasterContext/MasterEventsContext";
import EditEventForm from "../../../forms/masterForms/EventEditForm";

interface Props {
  data: Event[];
  editItem: (id: string, updatedData: Partial<Event>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
}

const EventsTable: React.FC<Props> = ({ data, editItem, deleteItem }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [deleteEvent, setDeleteEvent] = useState<Event | null>(null);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditClick = (event: Event) => setSelectedEvent(event);
  const handleEditClose = () => setSelectedEvent(null);

  const handleDeleteClick = (event: Event) => setDeleteEvent(event);
  const handleDeleteClose = () => setDeleteEvent(null);
  const handleDeleteConfirm = async () => {
    if (deleteEvent) {
      await deleteItem(deleteEvent.id);
      setDeleteEvent(null);
    }
  };

  return (
    <Paper
      sx={{ width: "100%", overflow: "hidden" }}
      className="dark:bg-[#1a1a1a] dark:text-white transition-colors duration-200"
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow
              sx={{ backgroundColor: "#3e3e3e" }}
              className="dark:bg-[#3e3e3e] bg-gray-200 transition-colors duration-200"
            >
              <TableCell
                className="dark:text-white text-black font-bold"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                Title
              </TableCell>
              <TableCell
                className="dark:text-white text-black font-bold"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                Description
              </TableCell>
              <TableCell
                className="dark:text-white text-black font-bold"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                Event Date
              </TableCell>
              <TableCell
                className="dark:text-white text-black font-bold"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                Created At
              </TableCell>
              <TableCell
                className="dark:text-white text-black font-bold"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="dark:text-white">
                    {event.title}
                  </TableCell>
                  <TableCell className="dark:text-white">
                    {event.description}
                  </TableCell>
                  <TableCell className="dark:text-white">
                    {event.event_date}
                  </TableCell>
                  <TableCell className="dark:text-white">
                    {event.created_at}
                  </TableCell>
                  <TableCell className="dark:text-white">
                    <IconButton
                      className="text-orange-400 hover:text-orange-600 dark:text-darkgoldenrod dark:hover:text-goldenrodhover"
                      onClick={() => handleEditClick(event)}
                    >
                      <FaEdit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(event)}>
                      <FaTrash className="text-red-500 hover:text-red-700" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        className="dark:bg-[#1a1a1a] dark:text-white transition-colors duration-200"
        sx={{
          "& .MuiTablePagination-toolbar": {
            color: "white",
          },
          "& .MuiSvgIcon-root": {
            color: "white",
          },
        }}
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog open={!!selectedEvent} onClose={handleEditClose}>
        {selectedEvent && (
          <EditEventForm
            event={selectedEvent}
            onSave={(id, updatedData) =>
              editItem(id, {
                ...updatedData,
              })
            }
            onClose={handleEditClose}
          />
        )}
      </Dialog>
      <Dialog open={!!deleteEvent} onClose={handleDeleteClose}>
        <DialogTitle className="dark:bg-[#1a1a1a] dark:text-gray-300">
          Delete Event
        </DialogTitle>
        <DialogContent className="dark:bg-[#1a1a1a] dark:text-gray-300">
          Are you sure you want to delete this event?
        </DialogContent>
        <DialogActions className="dark:bg-[#1a1a1a]">
          <Button
            onClick={handleDeleteClose}
            sx={{ color: "#9a9a9a", "&:hover": { color: "#4e4e4e" } }}
          >
            Cancel
          </Button>
          <Button
            sx={{
              backgroundColor: "#fa0022",
              color: "white",
              "&:hover": { backgroundColor: "#a50022" },
            }}
            onClick={handleDeleteConfirm}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default EventsTable;
