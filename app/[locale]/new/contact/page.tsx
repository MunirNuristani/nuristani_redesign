"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAppContext } from "@/context/AppContext";
import { phrases } from "@/utils/i18n";

interface MessageData {
  Name: string;
  Email: string;
  Message: string;
}

export default function NewContactPage() {
  const {
    contactUs, name, email, message,
    contactMsgSalutation, contactMsgDetails, contactMsgClosing,
    send, letterCount, sendMessageBody, msgSentSuccess,
    nameValidation, emailValidation, messageValidation,
  } = phrases;

  const { state } = useAppContext();
  const { language: lang } = state;

  const [msg, setMsg] = useState<MessageData>({ Name: "", Email: "", Message: "" });
  const [validation, setValidation] = useState({ name: false, email: false, msg: false });
  const [touched, setTouched] = useState({ name: false, email: false, msg: false });
  const [mailMessage, setMailMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setMailMessage(sendMessageBody[lang] || "");
  }, [lang, sendMessageBody]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await axios.post("/api/sendMessage", { Name: msg.Name, Email: msg.Email, Message: mailMessage, lang });
      await axios.post("/api/sendMessage/toAdmin", { ...msg });
      setSent(true);
      setMsg({ Name: "", Email: "", Message: "" });
      setTouched({ name: false, email: false, msg: false });
      setValidation({ name: false, email: false, msg: false });
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMsg((m) => ({ ...m, Name: value }));
    setValidation((v) => ({ ...v, name: value.trim().length > 0 }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMsg((m) => ({ ...m, Email: value }));
    setValidation((v) => ({ ...v, email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) }));
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMsg((m) => ({ ...m, Message: value }));
    setValidation((v) => ({ ...v, msg: value.length >= 10 }));
  };

  const isFormValid = validation.name && validation.email && validation.msg;

  return (
    <>
      <section className="page-hero">
        <div className="hero-bg" />
        <div className="wrap">
          <p className="kicker">{contactUs[lang]}</p>
          <h1>{contactUs[lang]}</h1>
        </div>
      </section>

      <div className="dict-results" style={{ maxWidth: 680 }}>
        <p className="lede">{contactMsgSalutation[lang]}</p>
        <p className="lede">{contactMsgDetails[lang]}</p>
        <p className="lede" dangerouslySetInnerHTML={{ __html: contactMsgClosing[lang] }} />

        {sent && (
          <div className="word-card-full" style={{ borderColor: "var(--accent)", marginTop: 24 }}>
            <p className="wc-meaning" style={{ margin: 0 }}>{msgSentSuccess[lang]}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="contact-form">
          <div className="field">
            <label htmlFor="c-name">{name[lang]}</label>
            <input
              id="c-name"
              type="text"
              value={msg.Name}
              onChange={handleNameChange}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            />
            {touched.name && !validation.name && <p className="field-error">{nameValidation[lang]}</p>}
          </div>

          <div className="field">
            <label htmlFor="c-email">{email[lang]}</label>
            <input
              id="c-email"
              type="email"
              placeholder="email@example.com"
              value={msg.Email}
              onChange={handleEmailChange}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            />
            {touched.email && !validation.email && <p className="field-error">{emailValidation[lang]}</p>}
          </div>

          <div className="field">
            <label htmlFor="c-message">{message[lang]}</label>
            <textarea
              id="c-message"
              rows={5}
              value={msg.Message}
              onChange={handleMessageChange}
              onBlur={() => setTouched((t) => ({ ...t, msg: true }))}
            />
            <div className="field-meta">
              <span>{letterCount[lang]}: {msg.Message.length}</span>
              {touched.msg && !validation.msg && <span className="field-error">{messageValidation[lang]}</span>}
            </div>
          </div>

          <button type="submit" className="cta solid" disabled={!isFormValid || sending} style={{ width: "100%", justifyContent: "center" }}>
            {send[lang]}
          </button>
        </form>
      </div>
    </>
  );
}
