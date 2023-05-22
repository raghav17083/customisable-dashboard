class ApiError extends Error {
  constructor(data) {
    super(data.message);
    this.status = data.status;
  }
}

module.exports = ApiError;
