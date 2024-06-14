import logger from "../logger/logger.js";

function handleError(error) {
    if (error.response) {
        console.log(
            `Error! Status: ${error.response.status}. Message: ${error.response.data.message}`
        );
        // logger.error(
        //     `Error! Status: ${error.response.status}. Message: ${error.response.data.message}`
        // );
    } else {
        logger.error(error);
        console.log(error);
    }
}

export default handleError;
