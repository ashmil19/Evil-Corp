const userModel = require("../models/userModel");

const ROLES = {
  User: 2000,
  Teacher: 3000,
  Admin: 1000,
};

const verifyUserRole = async (req, res, next) => {
  const userData = await userModel.findById(req.userId);
  if (userData.role != ROLES.User) return res.status(401).json({ role: true });
  if (!userData.isAccess) return res.status(401).json({ access: true });
  next();
};

module.exports = verifyUserRole;
