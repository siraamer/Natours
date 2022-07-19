const sanitizeUser = function (user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    photo: user.photo,
  };
};

export default sanitizeUser;
