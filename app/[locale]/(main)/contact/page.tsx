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
    send, letterCount, sendMessageBody, msgSentSuccess, msgSentFailure,
    nameValidation, emailValidation, messageValidation,
  } = phrases;

  const { state } = useAppContext();
  const { language: lang } = state;

  const [msg, setMsg] = useState<MessageData>({ Name: "", Email: "", Message: "" });
  const [validation, setValidation] = useState({ name: false, email: false, msg: false });
  const [touched, setTouched] = useState({ name: false, email: false, msg: false });
  const [mailMessage, setMailMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sent" | "failed">("idle");
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
      setStatus("sent");
      setMsg({ Name: "", Email: "", Message: "" });
      setTouched({ name: false, email: false, msg: false });
      setValidation({ name: false, email: false, msg: false });
    } catch (error) {
      console.error(error);
      setStatus("failed");
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

  useEffect(() => {
    if (status === "idle") return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setStatus("idle");
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [status]);

  return (
    <>
      <section className="page-hero">
        <div className="hero-bg" />
        <div className="wrap">
          <h1>{contactUs[lang]}</h1>
        </div>
      </section>

      <div className="dict-results" style={{ maxWidth: 680 }}>
        <p className="lede">{contactMsgSalutation[lang]}</p>
        <p className="lede">{contactMsgDetails[lang]}</p>
        <p className="lede" dangerouslySetInnerHTML={{ __html: contactMsgClosing[lang] }} />

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 mt-[30px]">
          <div className="flex flex-col gap-[7px]">
            <label htmlFor="c-name" className="text-[0.82rem] font-semibold text-(--ink-muted)">{name[lang]}</label>
            <input
              id="c-name"
              type="text"
              className="w-full font-[inherit] text-[0.98rem] px-4 py-[13px] border border-(--line) rounded-lg bg-(--surface) text-(--ink) focus:outline-none focus:border-(--accent) focus:shadow-[0_0_0_4px_var(--accent-soft)]"
              value={msg.Name}
              onChange={handleNameChange}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            />
            {touched.name && !validation.name && (
              <p className="m-0 text-[0.8rem] text-(--accent-2)">{nameValidation[lang]}</p>
            )}
          </div>

          <div className="flex flex-col gap-[7px]">
            <label htmlFor="c-email" className="text-[0.82rem] font-semibold text-(--ink-muted)">{email[lang]}</label>
            <input
              id="c-email"
              type="email"
              placeholder="email@example.com"
              className="w-full font-[inherit] text-[0.98rem] px-4 py-[13px] border border-(--line) rounded-lg bg-(--surface) text-(--ink) focus:outline-none focus:border-(--accent) focus:shadow-[0_0_0_4px_var(--accent-soft)]"
              value={msg.Email}
              onChange={handleEmailChange}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            />
            {touched.email && !validation.email && (
              <p className="m-0 text-[0.8rem] text-(--accent-2)">{emailValidation[lang]}</p>
            )}
          </div>

          <div className="flex flex-col gap-[7px]">
            <label htmlFor="c-message" className="text-[0.82rem] font-semibold text-(--ink-muted)">{message[lang]}</label>
            <textarea
              id="c-message"
              rows={5}
              className="w-full font-[inherit] text-[0.98rem] px-4 py-[13px] border border-(--line) rounded-lg bg-(--surface) text-(--ink) resize-y focus:outline-none focus:border-(--accent) focus:shadow-[0_0_0_4px_var(--accent-soft)]"
              value={msg.Message}
              onChange={handleMessageChange}
              onBlur={() => setTouched((t) => ({ ...t, msg: true }))}
            />
            <div className="flex justify-between text-[0.8rem] text-(--ink-muted)">
              <span>{letterCount[lang]}: {msg.Message.length}</span>
              {touched.msg && !validation.msg && <span className="text-(--accent-2)">{messageValidation[lang]}</span>}
            </div>
          </div>

          <button type="submit" className="cta solid" disabled={!isFormValid || sending} style={{ width: "100%", justifyContent: "center" }}>
            {send[lang]}
          </button>
        </form>
      </div>

      {status !== "idle" && (
        <div
          className="fixed inset-0 z-[110] bg-[rgba(20,30,20,0.5)] flex items-center justify-center p-6 motion-safe:animate-[confirmOverlayIn_0.2s_ease] motion-reduce:animate-none"
          onClick={() => setStatus("idle")}
        >
          <div
            className="relative bg-(--surface) rounded-(--radius) pt-10 px-8 pb-8 max-w-[420px] w-full text-center shadow-[0_30px_60px_-20px_rgba(20,30,20,0.5)] motion-safe:animate-[confirmModalIn_0.25s_ease] motion-reduce:animate-none"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-[14px] end-[14px] w-8 h-8 rounded-full bg-transparent border-0 text-(--ink-muted) flex items-center justify-center transition-colors duration-150 ease-in-out hover:bg-(--surface-2)"
              aria-label="Close"
              onClick={() => setStatus("idle")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            {status === "sent" ? (
              <>
                <div className="w-14 h-14 rounded-full bg-(--accent-soft) text-(--accent) flex items-center justify-center mx-auto mb-5">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <p className="m-0 text-[1.05rem] leading-[1.7] text-(--ink)" dangerouslySetInnerHTML={{ __html: msgSentSuccess[lang] }} />
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-full bg-[color-mix(in_srgb,var(--accent-2)_15%,transparent)] text-(--accent-2) flex items-center justify-center mx-auto mb-5">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </div>
                <p className="m-0 text-[1.05rem] leading-[1.7] text-(--ink)" style={{ whiteSpace: "pre-line" }}>{msgSentFailure[lang]}</p>
              </>
            )}
            <button className="cta solid mt-6" style={{ justifyContent: "center" }} onClick={() => setStatus("idle")}>
              {phrases.close[lang]}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
