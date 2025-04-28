"use client";
import React, {useState} from "react";
import Image from "next/image";
import Hamburger from "hamburger-react";
import Menu from "./Menu";
const Header = () => {
  const [isOpen, setOpen] = useState<boolean>(false);
  return (
    <>
      {" "}
      <div className="w-full h-20 bg-[#D0D0D0] flex items-center ">
        <div className="flex justify-between items-center w-full  pl-7 pr-7">
          <div className="relative h-[60px] w-[60px] ">
            <Image
              src={"/logo_original_noLabel.png"}
              alt="logo"
              width={100}
              height={100}
            />
          </div>
          <div className="text-2xl font-bold cursor-pointer z-50">
            <Hamburger toggled={isOpen} toggle={setOpen} />
          </div>
        </div>
      </div>
      <div className={`fixed overflow-x-hidden transition top-0 right-0 h-screen flex justify-center items-center bg-[#D0D0D0] z-40 ${isOpen ? "open" : "close"} `}>
        <Menu/>
      </div>
    </>
  );
};

export default Header;
