import React, { memo } from "react";
import styles from "./ActorName.module.scss";
import globalStyles from "@/sharedStyles/global-classes.module.scss";

interface propDefs {
  actorName: string;
  actorNameIsInvalid: boolean;
  actorNameExists: boolean;
  actorNameChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  actorNameBlurHandler: () => void;
}

export default memo(function actorName(props: propDefs) {
  const actorNameIsInvalidClass = props.actorNameIsInvalid
    ? "invalid-input-border"
    : "";

  return (
    <div className={`${styles["actor-name-input-container"]}`}>
      <label className={styles["name-label"]} htmlFor="actor-name">
        Name
      </label>
      <input
        placeholder="Name"
        id="actor-name"
        onChange={props.actorNameChangeHandler}
        onBlur={props.actorNameBlurHandler}
        type="text"
        value={props.actorName}
        className={`${styles["actor-name-input"]} ${globalStyles[actorNameIsInvalidClass]}`}
      />
      {props.actorNameIsInvalid && (
        <span className={globalStyles["invalid-message"]}>
          Name is required.
        </span>
      )}
      {props.actorNameExists && (
        <span className={globalStyles["invalid-message"]}>
          actor name already exists.
        </span>
      )}
    </div>
  );
});
