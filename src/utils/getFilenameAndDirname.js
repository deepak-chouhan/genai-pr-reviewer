import { fileURLToPath } from "url";
import { dirname } from "path";

function getFilenameAndDirname(meta) {
    const __filename = fileURLToPath(meta.url);
    const __dirname = dirname(__filename);
    return { __filename, __dirname };
}

export default getFilenameAndDirname;
