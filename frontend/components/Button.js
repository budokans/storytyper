export default function Button({ buttonClass, onClick, children, ...props }) {
  return (
    <>
      <button className={buttonClass} onClick={onClick} {...props}>
        {children}
      </button>
    </>
  );
}
