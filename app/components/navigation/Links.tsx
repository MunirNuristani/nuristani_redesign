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
        aria-label="Visit our Facebook page"
      >
        <FiFacebook className="mx-2 lg:mx-4" aria-hidden="true" />
      </a>
      <a
        href="https://www.instagram.com/mtgkfoundation/"
        target="_blank"
        rel="noopener noreferrer"
        className="border-r-2"
        aria-label="Visit our Instagram page"
      >
        <FiInstagram className="mx-2 lg:mx-4" aria-hidden="true" />
      </a>
      <a
        href="mailto:mtkgfoundation@gmail.com,nuristani.munir@gmail.com"
        className="border-r-2"
        aria-label="Send us an email"
      >
        <FiMail className="mx-2 lg:mx-4" aria-hidden="true" />
      </a>
    </div>
  );
};

export default Links;
