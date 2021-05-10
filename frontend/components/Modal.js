import { useRef } from "react";
import classNames from "classnames";
import { useThemeContext } from "../context/themeContext";
import PropTypes from "prop-types";

function Modal({
  modalIsShowing,
  onToggleModal,
  modalBodyIsTransparent,
  modalBodyClass,
  children,
}) {
  // Puts the modal body in focus so that onKeyDown will toggle the modal
  const modalBodyRef = useRef(null);
  modalIsShowing && modalBodyRef.current.focus();

  // Closes modal if the user clicks outside of the .modal-body div
  function handleClickOutside(e) {
    if (modalBodyRef.current.contains(e.target)) {
      return;
    } else {
      onToggleModal();
    }
  }

  const { theme } = useThemeContext();

  const modalWrapperClass = classNames({
    modal: true,
    "modal--visible": modalIsShowing,
    [`modal--bg-transparent--${theme}-theme`]: modalBodyIsTransparent,
  });

  return (
    <div className={modalWrapperClass} onClick={handleClickOutside}>
      <div
        className={`modal__body  ${modalBodyClass}`}
        ref={modalBodyRef}
        tabIndex={-1}
        onKeyDown={onToggleModal}
      >
        <button className="modal__btn-close" onClick={onToggleModal}>
          &#10006;
        </button>
        {children}
      </div>
    </div>
  );
}

Modal.propTypes = {
  modalIsShowing: PropTypes.bool.isRequired,
  onToggleModal: PropTypes.func.isRequired,
  modalBodyIsTransparent: PropTypes.bool,
  modalBodyClass: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Modal;
