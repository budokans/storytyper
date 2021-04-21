import Header from "./Header";

export default function MobileMessage() {
  return (
    <>
      <Header />
      <div className="mobile-container">
        <i className="ri-error-warning-fill"></i>
        <p className="mobile-container__message">
          Nooo! You're using a device with a screen too small to play Story
          Typer, the game that improves your typing speed while you read cool
          50-word stories!
        </p>

        <p className="mobile-container__message">
          Please return using a device with a larger screen.
        </p>

        <p className="mobile-container__message">
          In the mean time, why not check out the cool stories over at{" "}
          <a
            href="http://fiftywordstories.com/"
            target="_blank"
            rel="noreferrer"
            className="out-link"
          >
            fiftywordstories.com
          </a>
        </p>
      </div>
    </>
  );
}
