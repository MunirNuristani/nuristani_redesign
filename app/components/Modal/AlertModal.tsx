import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "min(90vw, 500px)",
  maxHeight: "90vh",
  outline: "none",
};

interface Props {
  open: boolean;
  toggleAlertModal: () => void;
  buttonText?: string;
  msg: string;
}

export default function BasicModal({
  open,
  toggleAlertModal,
  buttonText,
  msg,
}: Props) {
  const handleClose = () => {
    toggleAlertModal();
  };

  return (
    <Modal
      className="backdrop-blur-sm"
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        },
      }}
    >
      <Box sx={style}>
        <div
          className="relative w-full bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-in"
          onClick={(e) => e.stopPropagation()}
          style={{
            animation: "modalSlideIn 0.3s ease-out",
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            border: "1px solid rgba(148, 163, 184, 0.1)",
          }}
        >
          {/* Enhanced Header with Gradient */}
          <div
            className="relative h-16 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg"
            style={{
              background:
                "var(--color-primary, linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%))",
            }}
          >
            {/* Decorative Pattern */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />

            {/* Close Button */}
            <button
              type="button"
              className="absolute top-3 right-4 text-white hover:text-red-300 hover:bg-white/20 rounded-full p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 hover:scale-110"
              onClick={handleClose}
              aria-label="Close modal"
            >
              <AiOutlineCloseCircle className="w-6 h-6" />
            </button>

            {/* Header Title Area */}
            <div className="absolute bottom-2 left-6">
              <div className="w-8 h-1 bg-white/60 rounded-full"></div>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-8 pb-6">
            <div className="flex flex-col items-center justify-center text-center space-y-6">
              {/* Alert Icon/Indicator */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              {/* Alert Message */}
              <div
                id="alert-modal-description"
                dir="rtl"
                className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-md font-medium"
                dangerouslySetInnerHTML={{ __html: msg }}
                style={{
                  lineHeight: "1.6",
                  letterSpacing: "0.01em",
                }}
              />
            </div>
          </div>

          {/* Action Button Area */}
          {buttonText && (
            <div className="px-8 pb-8">
              <Button
                variant="contained"
                type="button"
                fullWidth
                onClick={handleClose}
                autoFocus
                sx={{
                  fontWeight: 600,
                  fontSize: "16px",
                  height: "48px",
                  borderRadius: "12px",
                  textTransform: "none",
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                    boxShadow: "0 6px 16px rgba(59, 130, 246, 0.4)",
                    
                  },
                  "&:active": {
                    transform: "translateY(0px)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                {buttonText}
              </Button>
            </div>
          )}

          {/* Bottom Accent Line */}
          <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
        </div>

        <style jsx>{`
          @keyframes modalSlideIn {
            from {
              opacity: 0;
              transform: translate(-50%, -60%) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
          }
        `}</style>
      </Box>
    </Modal>
  );
}
