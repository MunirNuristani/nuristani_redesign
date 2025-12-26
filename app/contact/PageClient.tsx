"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Send, X } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import AlertModal from "../components/Modal/AlertModal";
import { phrases } from "@/utils/i18n";
import axios from "axios";
import Input from "@/app/components/ui/Input";
import Textarea from "@/app/components/ui/Textarea";
import Button from "@/app/components/ui/Button";


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
  const [open, setOpen] = useState(false);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div
        className="max-w-4xl mx-auto mt-4 sm:mt-8 md:mt-16 mb-8 flex flex-col justify-center"
        dir={dir}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-2">
            {contactUs[lang]}
          </h1>
        </div>
        <div
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 md:p-12 w-full"
          dir={dir}
        >
          <div className="mb-8">
            <p className="text-justify leading-relaxed text-2xl mb-4">
              {contactMsgSalutation[lang]}
            </p>
            <p className="text-justify leading-relaxed text-xl mb-4">
              {contactMsgDetails[lang]}
            </p>
            <p
              className="text-justify leading-relaxed text-xl"
              dangerouslySetInnerHTML={{ __html: contactMsgClosing[lang] }}
            />
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-6">
              <Input
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
              />

              <Input
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
              />

              <div>
                <Textarea
                  fullWidth
                  required
                  id="message"
                  name="message"
                  label={message[lang]}
                  placeholder={message[lang]}
                  rows={5}
                  value={msg.Message}
                  onChange={handleMessageChange}
                  onBlur={() => handleBlur("msg")}
                  error={touched.msg && !validation.msg}
                />
                <div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center mt-2 gap-2">
                  <p className="text-sm text-gray-600">
                    {letterCount[lang]}: {msg.Message.length}
                  </p>
                  {touched.msg && !validation.msg && (
                    <p className="text-sm text-red-500">
                      {messageValidation[lang]}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-row gap-4 justify-center mt-8">
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={lang === "en" ? <Send className="w-5 h-5" /> : undefined}
                endIcon={
                  lang !== "en" ? <Send className="w-5 h-5 rotate-180" /> : undefined
                }
                disabled={!isFormValid}
                className="min-w-[120px] text-lg py-3 px-6"
              >
                {send[lang]}
              </Button>

              <Button
                type="button"
                variant="outlined"
                size="large"
                startIcon={lang === "en" ? <X className="w-5 h-5" /> : undefined}
                endIcon={lang !== "en" ? <X className="w-5 h-5" /> : undefined}
                onClick={() => {
                  router.push("/");
                }}
                className="min-w-[120px] text-lg py-3 px-6"
              >
                {cancel[lang]}
              </Button>
            </div>
          </form>

          <AlertModal open={open} toggleAlertModal={toggleAlertModal} buttonText={confirm[lang]} msg={msgSentSuccess[lang]}/>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
