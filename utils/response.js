export const sendResponse = (res, statusCode, message, data) => {
    res.status(statusCode).json({ status: true, message, data: data || null });
};

export const sendError = (res, statusCode, message) => {
    res.status(statusCode).json({ status: false, message });
};
