import React, { memo } from "react";
import styles from "./PornstarName.module.scss";
import globalStyles from "@/sharedStyles/global-classes.module.scss";

interface propDefs {
  pornstarName: string;
  pornstarNameIsInvalid: boolean;
  pornstarNameExists: boolean;
  pornstarNameChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  pornstarNameBlurHandler: () => void;
}

export default memo(function PornstarName(props: propDefs) {
  const pornstarNameIsInvalidClass = props.pornstarNameIsInvalid
    ? "invalid-input-border"
    : "";

  return (
    <div className={`${styles["pornstar-name-input-container"]}`}>
      <label className={styles["name-label"]} htmlFor="pornstar-name">
        Name
      </label>
      <input
        placeholder="Name"
        id="pornstar-name"
        onChange={props.pornstarNameChangeHandler}
        onBlur={props.pornstarNameBlurHandler}
        type="text"
        value={props.pornstarName}
        className={`${styles["pornstar-name-input"]} ${globalStyles[pornstarNameIsInvalidClass]}`}
      />
      {props.pornstarNameIsInvalid && (
        <span className={globalStyles["invalid-message"]}>
          Name is required.
        </span>
      )}
      {props.pornstarNameExists && (
        <span className={globalStyles["invalid-message"]}>
          Pornstar name already exists.
        </span>
      )}
    </div>
  );
});
