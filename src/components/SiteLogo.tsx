import React from "react";
import { StaticImage } from "gatsby-plugin-image";

export default function SiteLogo(props: { text: string }) {
  return (
    <div className="flex justify-center items-center text-white font-black
      text-3xl py-5">
      <StaticImage
        src="../images/icon.png"
        alt={props.text + " Logo"}
        width={50}
        height={50}
        placeholder="blurred"
      />
      <span>{props.text}</span>
    </div>
  );
}
