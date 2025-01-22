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
import { User } from "../../contexts/masterControlContext/subMasterContext/MasterUsersContext";
import EditUserForm from "../../forms/masterForms/UserEditForm";

interface Props {
  data: User[];
  editItem: (id: string, updatedData: Partial<User>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
}

const UserTable: React.FC<Props> = ({ data, editItem, deleteItem }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>();

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditClick = (user: User) => setSelectedUser(user);

  const handleEditClose = () => setSelectedUser(null);

  const handleDeleteClick = (user: User) => setDeleteUser(user);
  const handleDeleteClose = () => setDeleteUser(null);
  const handleConfirmDelete = async () => {
    if (deleteUser) {
      await deleteItem(deleteUser.id);
      setDeleteUser(null);
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
              className="dark:bg-[#3e3e3e] bg-gray-200 transition-colors duration-200"
              sx={{ backgroundColor: "#3e3e3e" }}
            >
              <TableCell
                className="dark:text-white text-black font-bold"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                User
              </TableCell>
              <TableCell
                className="dark:text-white text-black font-bold"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                Email
              </TableCell>
              <TableCell
                className="dark:text-white text-black font-bold"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                Role
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
              .map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell
                    className="flex items-center gap-2 dark:text-white"
                    sx={{ display: "flex", alignItems: "center", gap: 2 }}
                  >
                    <img
                      src={user.avatar || "https://via.placeholder.com/50"}
                      alt="Avatar"
                      style={{ width: 40, height: 40, borderRadius: "50%" }}
                    />
                    @{user.username}
                  </TableCell>
                  <TableCell className="dark:text-white">
                    {user.email}
                  </TableCell>
                  <TableCell
                    className="dark:text-white capitalize"
                    sx={{ textTransform: "capitalize" }}
                  >
                    {user.role}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditClick(user)}>
                      <FaEdit className="text-orange-400 hover:text-orange-600 dark:text-darkgoldenrod dark:hover:text-goldenrodhover" />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(user)}>
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
      <Dialog open={!!selectedUser} onClose={handleEditClose}>
        {selectedUser && (
          <EditUserForm
            user={selectedUser}
            onSave={editItem}
            onClose={handleEditClose}
          />
        )}
      </Dialog>
      <Dialog open={!!deleteUser} onClose={handleDeleteClose}>
        <DialogTitle className="dark:bg-[#1a1a1a] dark:text-gray-300">
          Confirm Deletion
        </DialogTitle>
        <DialogContent className="dark:bg-[#1a1a1a] dark:text-gray-300">
          Are you sure you want to delete{" "}
          <span className="font-bold">@{deleteUser?.username}</span>?
        </DialogContent>
        <DialogActions className="dark:bg-[#1a1a1a]">
          <Button
            onClick={handleDeleteClose}
            sx={{ color: "#fa0022", "&:hover": { color: "#a50022" } }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            sx={{
              backgroundColor: "#367316",
              color: "white",
              "&:hover": { backgroundColor: "#005a00" },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default UserTable;
