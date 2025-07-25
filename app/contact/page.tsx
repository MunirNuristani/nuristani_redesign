"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  // Alert,
  // CircularProgress,
  // Backdrop,
  Stack,
  FormHelperText,
} from "@mui/material";
import { Send as SendIcon, Cancel as CancelIcon } from "@mui/icons-material";
import { useAppContext } from "@/context/AppContext";
// import { messages } from "@/utils/airTable";
import AlertModal from "../components/Modal/AlertModal";
import { phrases } from "@/utils/i18n";
import axios from "axios";
// Type definitions
interface MessageData {
  Name: string;
  Email: string;
  Message: string;
}

interface ValidationState {
  name: boolean;
  email: boolean;
  msg: boolean;
}

const Contacts: React.FC = () => {
  const {
    contactUs,
    name,
    email,
    message,
    contactMsgSalutation,
    contactMsgDetails,
    contactMsgClosing,
    send,
    cancel,
    confirm,
    letterCount,
    sendMessageBody,
    msgSentSuccess,
    // msgSentSuccess,
    // msgSentFailure,
    nameValidation,
    emailValidation,
    messageValidation,
  } = phrases;

  const router = useRouter();
  const [msg, setMsg] = useState<MessageData>({
    Name: "",
    Email: "",
    Message: "",
  });
  const [validation, setValidation] = useState<ValidationState>({
    name: false,
    email: false,
    msg: false,
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    msg: false,
  });
  const [dir, setDir] = useState<"ltr" | "rtl">("ltr");
  const [mailMessage, setMailMessage] = useState<string>("");
  const [open, setOpen] = useState(true);
  const toggleAlertModal = () => {
    setOpen(prev=>!prev);
  }
  const { state } = useAppContext();
  const { language: lang } = state;


  useEffect(() => {
    setDir(lang === "en" ? "ltr" : "rtl");
    setMailMessage(sendMessageBody[lang] || "errorOccured");
  }, [lang, sendMessageBody]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/sendMessage", {
        Name: msg.Name,
        Email: msg.Email,
        Message: mailMessage,
        lang: lang
      });
      const sentTOAdmin = await axios.post("/api/sendMessage/toAdmin", {
        ...msg,
      });
      toggleAlertModal();
      console.log(sentTOAdmin);
      console.log(response);
    } catch (error) {
      console.log(error);
    }

    

    // try {
    //   await messages.create([{ fields: { ...msg } }]);

    //   dispatch({
    //     type: "MULTIPLE_ASSIGNMENT",
    //     payload: {
    //       showAlertModal: true,
    //       alertModalMessage: msgSentSuccess[lan],
    //       loadingPage: false,
    //     },
    //   });
    // } catch (error) {
    //   console.error("Error sending message:", error);
    //   dispatch({
    //     type: "MULTIPLE_ASSIGNMENT",
    //     payload: {
    //       showAlertModal: true,
    //       alertModalMessage: msgSentFailure[lan],
    //       loadingPage: false,
    //     },
    //   });
    // }

    setMsg({ Name: "", Email: "", Message: "" });
    setTouched({ name: false, email: false, msg: false });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setMsg({ ...msg, Name: value });
    setValidation({ ...validation, name: value.trim().length > 0 });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setMsg({ ...msg, Email: value });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setValidation({ ...validation, email: emailRegex.test(value) });
  };

  const handleMessageChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    const value = e.target.value;
    setMsg({ ...msg, Message: value });
    setValidation({ ...validation, msg: value.length >= 10 });
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched({ ...touched, [field]: true });
  };

  const isFormValid = validation.name && validation.email && validation.msg;

  return (
    <>
      {/* <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingPage}
      >
        <CircularProgress color="inherit" />
      </Backdrop> */}

      <Container
        maxWidth="md"
        dir={dir}
        sx={{
          mt: { xs: 2, sm: 4, md: 8 },
          mb: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-2">
            {contactUs[lang]}
          </h1>
        </div>
        <Paper
          elevation={8}
          sx={{
            p: { xs: 3, sm: 4, md: 6 },
            width: "100%",
            maxWidth: {
              xs: "100%",
              sm: 500,
              md: 700,
              lg: 900,
              xl: 1200,
            },
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: 3,
          }}
          dir={dir}
        >
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="body1"
              paragraph
              sx={{ textAlign: "justify", lineHeight: 1.6, fontSize: "1.5rem" }}
            >
              {contactMsgSalutation[lang]}
            </Typography>
            <Typography
              variant="body1"
              paragraph
              sx={{ textAlign: "justify", lineHeight: 1.6, fontSize: "1.2rem" }}
            >
              {contactMsgDetails[lang]}
            </Typography>
            <Typography
              variant="body1"
              sx={{ textAlign: "justify", lineHeight: 1.6, fontSize: "1.2rem" }}
              dangerouslySetInnerHTML={{ __html: contactMsgClosing[lang] }}
            />
          </Box>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={3}>
              <TextField
                fullWidth
                required
                id="name"
                name="name"
                label={name[lang]}
                placeholder={name[lang]}
                value={msg.Name}
                onChange={handleNameChange}
                onBlur={() => handleBlur("name")}
                error={touched.name && !validation.name}
                helperText={
                  touched.name && !validation.name ? nameValidation[lang] : ""
                }
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                fullWidth
                required
                id="email"
                name="email"
                type="email"
                label={email[lang]}
                placeholder="email@example.com"
                value={msg.Email}
                onChange={handleEmailChange}
                onBlur={() => handleBlur("email")}
                error={touched.email && !validation.email}
                helperText={
                  touched.email && !validation.email
                    ? emailValidation[lang]
                    : ""
                }
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />

              <Box>
                <TextField
                  fullWidth
                  required
                  id="message"
                  name="message"
                  label={message[lang]}
                  placeholder={message[lang]}
                  multiline
                  rows={5}
                  value={msg.Message}
                  onChange={handleMessageChange}
                  onBlur={() => handleBlur("msg")}
                  error={touched.msg && !validation.msg}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: { xs: "column", sm: "row-reverse" },
                    mt: 1,
                    gap: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {letterCount[lang]}: {msg.Message.length}
                  </Typography>
                  {touched.msg && !validation.msg && (
                    <FormHelperText error>
                      {messageValidation[lang]}
                    </FormHelperText>
                  )}
                </Box>
              </Box>
            </Stack>

            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              sx={{ mt: 4 }}
            >
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={lang === "en" ? <SendIcon /> : ""}
                endIcon={
                  lang !== "en" ? <SendIcon className="rotate-180" /> : ""
                }
                disabled={!isFormValid}
                sx={{
                  minWidth: 120,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1.1rem",
                  py: 1.5,
                  px: 3,
                }}
              >
                {send[lang]}
              </Button>

              <Button
                type="button"
                variant="outlined"
                size="large"
                startIcon={lang === "en" ? <CancelIcon /> : ""}
                endIcon={lang !== "en" ? <CancelIcon /> : ""}
                onClick={() => {
                  router.push("/");
                }}
                sx={{
                  minWidth: 120,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1.1rem",
                  py: 1.5,
                  px: 3,
                }}
              >
                {cancel[lang]}
              </Button>
            </Stack>
          </Box>

          <AlertModal open={open} toggleAlertModal={toggleAlertModal} buttonText={confirm[lang]} msg={msgSentSuccess[lang]}/>
        </Paper>
      </Container>
    </>
  );
};

export default Contacts;
