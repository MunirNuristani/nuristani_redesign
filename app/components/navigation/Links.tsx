import React from "react";
import { FiFacebook, FiInstagram, FiMail } from "react-icons/fi";

const Links = () => {

  return (
    <div
      className={`flex flex-row-reverse justify-center items-center text-lg lg:text-3xl `}
    >
      <a
        href="https://www.facebook.com/MTGCF/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FiFacebook className="mx-2 lg:mx-4 " />
      </a>
      <a
        href="https://www.instagram.com/mtgkfoundation/"
        target="_blank"
        rel="noopener noreferrer"
        className="border-r-2"
      >
        <FiInstagram className="mx-2 lg:mx-4" />
      </a>
      <a
        href="mailto:mtkgfoundation@gmail.com,nuristani.munir@gmail.com"
        className="border-r-2"
      >
        <FiMail className="mx-2 lg:mx-4 " />
      </a>
    </div>
  );
};

export default Links;
