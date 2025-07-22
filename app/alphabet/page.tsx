"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAppContext } from "@/context/AppContext";
import { phrases } from "@/utils/i18n";
import Image from "next/image";
import rotateImage from "../../public/rotatePhone.svg";
import LoadingPage from "../loading";

type LanguageCode = "en" | "prs" | "ps" | "nr";
interface Alphabet {
  Letter: string;
  Latin: string;
  Name: string;
  Description: string;
  recording1: { url: string; filename: string; type: string; size: number }[];
  recording2: { url: string; filename: string; type: string; size: number }[];
}
const Page = () => {
  const [dir, setDir] = useState("");
  const [alphabets, setAlphabets] = useState<Alphabet[]>([]);
  const [lang, setLang] = useState("en");
  const [isLoading, setIsLoading] = useState(true);
  const { state } = useAppContext();
  const { language }: { language: LanguageCode } = state;

  const getData = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("/api/alphabet/get");
      setAlphabets(res.data);
    } catch (error) {
      console.error("Error fetching alphabet data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setLang(language);
  }, [language]);

  const {
    alphabetHeading,
    letter,
    latin,
    nameOfLetter,
    usage,
    // phoneme,
    rotate,
  } = phrases;

  const cells =
    "outline flex justify-center items-center h-full w-full min-h-20 text-center";

  useEffect(() => {
    setDir(lang === "en" ? "ltr" : "rtl");
  }, [lang]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      {isLoading ? (
        <LoadingPage />
      ) : (
        <>
          <div
            dir={dir}
            className="container my-10 flex flex-col justify-center  p-5 rounded-xl  lg:max-w-[1400px]  md:max-w-[700px] max-w-[300px] mx-2 sm:mt-[20px] min-h-[600px]"
          >
            {/* <div className="flex  flex-col justify-center items-center md:text-3xl text-xl my-4">
              <h3 className="md:text-5xl text-4xl text-center sm:text-center mt-6 w-full">
                {" "}
                {alphabetHeading[lang as keyof typeof alphabetHeading]}{" "}
              </h3>
            </div> */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-2">
                {alphabetHeading[lang as keyof typeof alphabetHeading]}
              </h1>
            </div>
            <div className="md:hidden xl:hidden lg:hidden flex flex-col justify-center items-center">
              <p className="mt-5 w-full text-center text-2xl">
                {rotate[lang as keyof typeof rotate]}
              </p>
              <Image
                src={rotateImage}
                alt="rotate your phone "
                width={100}
                height={200}
              />
            </div>
            <div
              dir={dir}
              className="border-2 text-xl hidden md:flex lg:flex xl:flex flex-col "
            >
              <div className="grid grid-cols-8 w-full ">
                <div className={cells}>
                  {letter[lang as keyof typeof letter]}
                </div>
                <div className={cells}>
                  {" "}
                  {latin[lang as keyof typeof latin]}{" "}
                </div>
                <div className={cells}>
                  {nameOfLetter[lang as keyof typeof nameOfLetter]}
                </div>
                <div className="col-span-5 outline text-center flex justify-center items-center">
                  {usage[lang as keyof typeof usage]}
                </div>
                {/* <div className={cells}>
                  {phoneme[lang as keyof typeof phoneme]}
                </div> */}
              </div>

              {alphabets.map((el, index) => (
                <div key={index} className="grid grid-cols-8 w-full ">
                  <div className={cells}> {el.Letter}</div>
                  <div className={cells}> {el.Latin}</div>
                  <div className={cells}> {el.Name}</div>
                  <div className="col-span-5 outline text-center flex justify-center items-center">
                    {" "}
                    {el.Description}{" "}
                  </div>
                  {/* <div className={cells}>
                    {el.recording1 &&
                    el.recording1[0] &&
                    el.recording1[0].url ? (
                      <></>
                    ) : (
                      <span className="text-gray-400 text-sm">No audio</span>
                    )}
                  </div> */}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
