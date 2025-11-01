
const sendSuccess = ({res, data, message = "Success", statusCode = 200}) => {
    const response = {
        success: true,
        message,
        data
    };
    console.log(res.status(statusCode), "ssssssseeeeeeerrrrrssssssss")
    return res.status(statusCode).json(response);
};

const sendError = (res, message = "Something went wrong", statusCode = 400, errors = null) => {
    const response = {
        success: false,
        message
    };

    if (errors) {
        response.errors = errors;
    }

    return res.status(statusCode).json(response);
};

module.exports = { sendSuccess, sendError };
