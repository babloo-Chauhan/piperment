export default (req, res, next) => {
  if (req.user.role !== "VENDOR")
    return res.status(403).json({ message: "Vendor only" });
  next();
};
