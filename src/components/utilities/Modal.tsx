import React, {FormEvent, ReactNode} from 'react'
import styles from "./Modal.module.scss";

interface ModalProps {
  children: ReactNode;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  header: string;
  genericError: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function Modal({ children, setModal, header, genericError,onSubmit} : ModalProps) {
  return (
    <div
    className={styles['backdrop']}
    onClick={() => setModal(false)}
  >
    <div className={styles['modal']} onClick={(e) => e.stopPropagation()}>
      <div className={styles['modal-header']}>
        <div className={styles['modal-title']}>{header}</div>
        <button
          onClick={() => setModal(false)}
          className={styles['close']}
        >
          &#10006;
        </button>
      </div>
      <form
        onSubmit={onSubmit}
        className={styles['form-container']}
      >
        {children}
        {genericError && (
          <span className={styles["server-error-message"]}>
            Server Error. Please Refresh Page or try again later.
          </span>
        )}
{/*
   <div
          className={`${styles["input-container"]} ${styles[tagIsInvalidClass]}`}
        >
          <label>Tag</label>
          <input
            placeholder="tag"
            onChange={tagChangeHandler}
            onBlur={tagBlurHandler}
            value={tag}
            type="text"
          />
          {tagIsInvalid && (
            <span className={styles["invalid-message"]}>
              Tag is blank.
            </span>
          )}
        </div>
        <div className={styles['sign-up-button-container']}>
          <button
            disabled={!tagIsValid}
            className={styles['sign-up-button']}
            type="submit"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
*/}          
       </form>
    </div>
  </div>

  )
}
