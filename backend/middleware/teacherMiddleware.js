const teacherModel = require("../models/userModel");

const ROLES = {
  User: 2000,
  Teacher: 3000,
  Admin: 1000,
};

const verifyUserRole = async (req, res, next) => {
  const teacherData = await teacherModel.findById(req.userId);
  // console.log("asdfa", teacherData);
  if (teacherData.role != ROLES.Teacher) return res.status(401).json({ role: true });
  if (!teacherData.isAccess) return res.status(401).json({ access: true });
  next();
};

module.exports = verifyUserRole;
