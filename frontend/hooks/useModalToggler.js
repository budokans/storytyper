import { useState } from "react";

export default function useModalToggler() {
  const [modalIsShowing, setModalIsShowing] = useState(false);

  function handleToggleModal() {
    setModalIsShowing(!modalIsShowing);
  }

  return [modalIsShowing, handleToggleModal];
}
