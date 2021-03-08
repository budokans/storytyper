import { useState, useEffect } from "react";
import PropTypes from "prop-types";

function ClientOnly({ children, ...props }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <div {...props}>{children}</div>;
}

ClientOnly.propTypes = {
  children: PropTypes.element.isRequired,
};

export default ClientOnly;
