// This component is used to create and show the error in the react app
// Instead of writing all the error newly we will jst use then app then this will take care of everything since its a subclass of the Error class

class createError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "Fail" : "Error";
  }
}

module.exports = createError;
