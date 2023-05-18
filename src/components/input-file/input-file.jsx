import "./input-file.css";

function InputFile() {
  return ( <div className="input__wrapper">
  <input
    name="file"

    type="file"
    id="input__file"
    className="input input__file"
    multiple
  />
  <label for="input__file" className="input__file-button">
    <span className="arrow">&#8595; </span>
    <div className="loader-pdf">
      {" "}
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>{" "}
    <span className="input__file-button-text">Upload PDF file </span>
  </label>
</div>)
}
export default InputFile;
