import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {AiOutlineCloseCircle} from 'react-icons/ai'
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  height: "50%",
  p: 4,
};

interface Props {
  open: boolean;
  toggleAlertModal: () => void;
  buttonText?: string;
  msg: string;
}

export default function BasicModal({open,toggleAlertModal, buttonText, msg}: Props) {
  const handleClose = () => {
    toggleAlertModal();
  };
  

  return (
    <div>
      <Modal
        className="w-full h-full flex justify-center items-center"
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div
            className="relative w-full  max-w-md mx-4 bg-white rounded-lg shadow-xl p-6 pt-12 transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <div className="w-full h-12 absolute rounded-t-lg top-0 left-0 bg-[var(--color-primary)]">
              {" "}
              <button
                type="button"
                className="absolute top-2 right-4 text-white hover:text-red-500 rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                onClick={handleClose}
                aria-label="Close modal"
              >
                <AiOutlineCloseCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex flex-col items-center justify-center text-center">
              {/* Alert Message */}
              <div
                id="alert-modal-description"
                dir={"rtl"}
                className="text-lg md:text-xl m-6 text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: msg }}
              >
    
              </div>

              {/* Action Button */}
              {true && (
                <Button
                  variant="contained"
                  type="button"
                  sx={{
                    fontWeight: "normal",
                    fontSize: "18px",
                    width: "50%",
                  }}
                  onClick={handleClose}
                  autoFocus
                >
                  {buttonText}
                </Button>
              )}
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
