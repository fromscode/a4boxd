class NotFoundError extends Error {
    status = 404;
    constructor() {
        super("The requested page could not be found");
    }
}

export default new NotFoundError();
