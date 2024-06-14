import handleError from "../controllers/handleError.js";

function handleEnterpriseUrl(url) {
    if (!url) {
        handleError(new Error(`Given URL -> "${url}" is not valid.`));
    }

    let parsedUrl;
    try {
        parsedUrl = new URL(url);
    } catch (e) {
        handleError(new Error(`Given URL -> "${url}" is not a valid URL.`));
    }

    // Regular expression to match GitHub Enterprise URL patterns
    const githubEnterprisePattern = /github\.(.*)\.com/;

    if (githubEnterprisePattern.test(parsedUrl.hostname) === true) {
        return parsedUrl.origin;
    } else {
        handleError(new Error("Please enter a GitHub Enterprise URL."));
    }
}

export default handleEnterpriseUrl;
