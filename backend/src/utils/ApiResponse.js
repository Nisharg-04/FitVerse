// This class is used to send appropriate responses to the client. It takes the status code, data, and message as arguments and sends the response to the client. This class is used to send responses to the client after the API request is processed.

class ApiResponse {
  constructor({ statusCode, data, message = "success" }) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };
