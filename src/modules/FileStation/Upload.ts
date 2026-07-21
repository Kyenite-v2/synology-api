import { isNode } from "../../utils/index.js";
import { createFormData, getFormDataHeaders } from "../../utils/index.js";
import { FileStationApi } from "../../types/index.js";
var OverwriteEnum;
(function (OverwriteEnum) {
  OverwriteEnum["OVERWRITE"] = "overwrite";
  OverwriteEnum["SKIP"] = "skip";
})(OverwriteEnum || (OverwriteEnum = {}));
export async function uploadFile(params) {
  if (!this.isConnecting) {
    await this.connect();
  }
  const api = this.getApiInfoByName(FileStationApi.Upload);
  const {
    path,
    file,
    overwrite = OverwriteEnum.OVERWRITE,
    create_parents = true,
  } = params;
  const formData = createFormData();
  formData.append("method", "upload");
  formData.append("version", String(api?.maxVersion));
  formData.append("api", FileStationApi.Upload);
  formData.append("path", path);
  formData.append("overwrite", overwrite);
  formData.append("create_parents", String(create_parents));
  if (isNode) {
    let fileContent;
    let fileName;

    if (typeof file === "string") {
      const fs = require("fs/promises");
      const path = require("path");

      fileName = path.basename(file);
      fileContent = await fs.readFile(file);
    } else if (file instanceof File) {
      fileName = file.name;
      fileContent = Buffer.from(await file.arrayBuffer());
    } else if (Buffer.isBuffer(file)) {
      fileName = "upload";
      fileContent = file;
    }

    formData.append("file", fileContent, {
      filename: fileName,
      contentType: "application/octet-stream",
    });
  } else {
    // for browser environment
    formData.append("file", file);
  }
  const res = this.run(FileStationApi.Upload, {
    method: "post",
    data: formData,
    headers: getFormDataHeaders(formData),
  });
  return res;
}
