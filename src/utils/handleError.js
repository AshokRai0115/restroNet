function handleError(err) {
  // Initialize an empty object to store error messages.
  const errors = {};

  // Log the original error for debugging purposes.
  console.error(err);

  // --- Handling Mongoose Validation Errors ---
  // Mongoose validation errors have a 'name' property of 'ValidationError'.
  if (err.name === 'ValidationError') {
    // Iterate over the error details provided by Mongoose.
    for (const field in err.errors) {
      // The path of the invalid field and its message are directly accessible.
      errors[field] = err.errors[field].message;
    }
  }

  // --- Handling MongoDB Duplicate Key Errors ---
  // MongoDB duplicate key errors have a 'code' of 11000.
  if (err.code === 11000) {
    const duplicateKey = Object.keys(err.keyValue)[0];
    let customMessage = `The ${duplicateKey} '${err.keyValue[duplicateKey]}' is already in use.`;

    // You can add more specific messages for certain fields here.
    if (duplicateKey === 'item_name') {
      customMessage = 'This item already exists. Please try editing instead.';
    }

    errors[duplicateKey] = customMessage;
  }

  // --- Handling other types of errors ---
  // You can add more conditions here to handle different error types.
  // Example: if (err.name === 'CastError') { ... }

  // Return the errors object. It will be empty if no specific errors were found.
  return errors;
}

module.exports = handleError;