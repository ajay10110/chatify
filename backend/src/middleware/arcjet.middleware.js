export const arcjetProtection = async (req, res, next) => {
  console.log("Arcjet middleware bypassed");
  next();
};