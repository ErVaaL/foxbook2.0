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
import { Group } from "../../../contexts/masterControlContext/subMasterContext/MasterGroupsContext";
import EditGroupForm from "../../../forms/masterForms/GroupEditForm";

interface Props {
  data: Group[];
  editItem: (id: string, updatedData: Partial<Group>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
}

const GroupsTable: React.FC<Props> = ({ data, editItem, deleteItem }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [deleteGroup, setDeleteGroup] = useState<Group | null>();

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditClick = (group: Group) => setSelectedGroup(group);
  const handleEditClose = () => setSelectedGroup(null);

  const handleDeleteClick = (group: Group) => setDeleteGroup(group);
  const handleDeleteClose = () => setDeleteGroup(null);
  const handleConfirmDelete = async () => {
    if (deleteGroup) {
      await deleteItem(deleteGroup.id);
      setDeleteGroup(null);
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
                Name
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
                Owner
              </TableCell>
              <TableCell
                className="dark:text-white text-black font-bold"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                Privacy
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
              .map((group) => (
                <TableRow key={group.id}>
                  <TableCell className="dark:text-white">
                    {group.name}
                  </TableCell>
                  <TableCell className="dark:text-white">
                    {group.description}
                  </TableCell>
                  <TableCell className="dark:text-white">
                    @{group.owner.username}
                  </TableCell>
                  <TableCell className="dark:text-white">
                    {group.is_public ? "Public" : "Private"}
                  </TableCell>
                  <TableCell className="dark:text-white">
                    {group.created_at}
                  </TableCell>
                  <TableCell className="dark:text-white">
                    <IconButton
                      className="text-orange-400 hover:text-orange-600 dark:text-darkgoldenrod dark:hover:text-goldenrodhover"
                      onClick={() => handleEditClick(group)}
                    >
                      <FaEdit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(group)}>
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
      <Dialog open={!!selectedGroup} onClose={handleEditClose}>
        {selectedGroup && (
          <EditGroupForm
            group={selectedGroup}
            onSave={(id, updatedData) =>
              editItem(id, {
                ...updatedData,
                owner: updatedData.owner,
              })
            }
            onClose={handleEditClose}
          />
        )}
      </Dialog>
      <Dialog open={!!deleteGroup} onClose={handleDeleteClose}>
        <DialogTitle className="dark:bg-[#1a1a1a] dark:text-gray-300">
          Delete Group
        </DialogTitle>
        <DialogContent className="dark:bg-[#1a1a1a] dark:text-gray-300">
          Are you sure you want to delete this group?
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
            onClick={handleConfirmDelete}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default GroupsTable;
