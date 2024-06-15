import logger from "../logger/logger.js";

function handleError(error, context = {}) {
    let errorMessage = "An unknown error occurred.";

    if (error.response) {
        const status = error.response.status;
        const message =
            error.response.data?.message ||
            error.response.statusText ||
            "Unknown error message";

        errorMessage = `Error! Status: ${status}. Message: ${message}`;
    } else if (error.request) {
        errorMessage = "No response received from server.";
    } else if (error.message) {
        error = error.message;
    }

    const errorDetails = {
        message: errorMessage,
        stack: error.stack || "No stack trace available",
        context,
    };

    logger.error(errorDetails);
}

export default handleError;
