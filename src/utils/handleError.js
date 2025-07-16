function handleError(err) {
  console.log(err, "..............................................");

  const error = {
    email: '',
    password: '',
    username: '',
  };

  if (err.message && err.message.toLowerCase().includes("validation failed")) {
    Object.values(err.errors).forEach((errObj) => {
      const { path, message } = errObj.properties;
      if (error.hasOwnProperty(path)) {
        error[path] = message;
      }
    });
  }

  if (err.code === 11000) {
    const dupFields = Object.keys(err.keyPattern || err.keyValue || {});
    dupFields.forEach((field) => {
      if (field === "email") {
        error.email = "Email already in use.";
      }
      if (field === "username") {
        error.username = "Username already taken.";
      }
    });
  }

  return error;
}

module.exports = handleError;
