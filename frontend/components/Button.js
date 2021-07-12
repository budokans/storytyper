import PropTypes from "prop-types";

function Button({ buttonClass, onClick, children, ...props }) {
  return (
    <button className={buttonClass} onClick={onClick} {...props}>
      {children}
    </button>
  );
}

Button.propTypes = {
  buttonClass: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.string.isRequired,
};

export default Button;
