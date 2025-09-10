import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";


const SuperAdminChoiceModal = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={() => onClose(null)}
      PaperProps={{
        sx: { borderRadius: 3, padding: 2, minWidth: 350 },
      }}
    >
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", fontSize: 22 }}>
        Choose Your Login
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center" }}>


        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 2 }}>
          <Button
            onClick={() => onClose("/dashboard")}
            variant="contained"
            
            sx={{
              flex: 1,
              borderRadius: 2,
              paddingY: 1.5,
              textTransform: "none",
              fontSize: 16,
              background: "linear-gradient(45deg, #1976d2, #42a5f5)",
            }}
          >
            Admin
          </Button>

          <Button
            onClick={() => onClose("/accounts")}
            variant="contained"
           
            sx={{
              flex: 1,
              borderRadius: 2,
              paddingY: 1.5,
              textTransform: "none",
              fontSize: 16,
              background: "linear-gradient(45deg, #9c27b0, #ba68c8)",
            }}
          >
            Accounts
          </Button>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center" }}>
        <Button onClick={() => onClose(null)} color="error">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SuperAdminChoiceModal;
