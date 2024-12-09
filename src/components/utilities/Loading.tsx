import React from "react";
import styles from "./Loading.module.scss";
import { ThreeDots } from "react-loader-spinner";

export default function Loading() {
  return (
    <ThreeDots
        visible={true}
        height="80"
        width="80"
        color="white"
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass={styles["loading"]}
      />
  );
}
