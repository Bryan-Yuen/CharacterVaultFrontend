import React from 'react';
import styles from './PornstarName.module.scss';
import useInput from '../hooks/useInput';
import globalStyles from '@/sharedStyles/global-classes.module.scss'

interface propDefs {
  pornstarName: string;
  pornstarNameIsInvalid: boolean;
  pornstarNameChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  pornstarNameBlurHandler: () => void;
}

export default function PornstarName(props: propDefs) {

  const pornstarNameIsInvalidClass = props.pornstarNameIsInvalid ? 'invalid-input-border' : '';

  return (
    <div
      className={`${styles['pornstar-name-input-container']}`}
    >
      <label>Name</label>
      <input
        placeholder="Name"
        onChange={props.pornstarNameChangeHandler}
        onBlur={props.pornstarNameBlurHandler}
        type="text"
        value={props.pornstarName}
        className={`${styles['pornstar-name-input']} ${globalStyles[pornstarNameIsInvalidClass]}`}
      />
      {props.pornstarNameIsInvalid && (
        <span className={globalStyles['invalid-message']}>Name is required.</span>
      )}
    </div>
  );
}
