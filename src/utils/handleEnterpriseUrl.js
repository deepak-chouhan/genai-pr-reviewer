import handleError from "./handleError.js";
import getFilenameAndDirname from "./getFilenameAndDirname.js";

const { __filename } = getFilenameAndDirname(import.meta);

function handleEnterpriseUrl(url) {
    if (!url) {
        handleError(new Error(`Given URL -> "${url}" is not valid.`), {
            source: handleEnterpriseUrl.name,
            __filename,
        });
    }

    let parsedUrl;
    try {
        parsedUrl = new URL(url);
    } catch (e) {
        handleError(new Error(`Given URL -> "${url}" is not a valid URL.`), {
            source: handleEnterpriseUrl.name,
            __filename,
        });
    }

    // Regular expression to match GitHub Enterprise URL patterns
    const githubEnterprisePattern = /github\.(.*)\.com/;

    if (githubEnterprisePattern.test(parsedUrl.hostname) === true) {
        return parsedUrl.origin;
    } else {
        handleError(new Error("Please enter a GitHub Enterprise URL."), {
            source: handleEnterpriseUrl.name,
            __filename,
        });
    }
}

export default handleEnterpriseUrl;
