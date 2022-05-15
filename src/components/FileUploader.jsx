import { useState } from "react";
import "./fileupload.css";

function FileUploader(props) {
  const [file, setFile] = useState(null);
  const onInputChange = (e) => {
    // props.uploadCSV(e.target.value)
    props.uploadCSV(e.target.files);
    setFile(e.target.files[0]);
  };
  return (
    <div>
      <form method="post" action="#" id="#">
        <div className="form-group files">
          <label>ファイルをアップロードしてください </label>
          <input
            type="file"
            onChange={onInputChange}
            className="form-control"
            multiple=""
          />
        </div>
      </form>
    </div>
  );
}

export default FileUploader;
