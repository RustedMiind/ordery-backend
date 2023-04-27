const jwt = require("jsonwebtoken");
const User = require("../models/User");
const UserToken = require("../models/UserToken");
const Admin = require("../models/Admin");
const AdminToken = require("../models/AdminToken");

const handleErrors = (err) => {
  const error = { message: err.message };
};

function userAuth(req, res, next) {
  // Get jwt cookie from request
  // Return the encoded token if found or undefind if not
  const token = req.cookies.jwt;
  // Error code 401 Unauthorized
  if (!token) return res.status(406).json({ message: "Login to proceed" });
  jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
    if (err) {
      // Not Acceptable
      return res.status(401).json({ message: "Not acceptable token" });
    } else {
      // Look for the token on the database
      UserToken.findById(decodedToken.id)
        .then((result) => {
          // Look if the token refers to a real account or not
          User.findById(result.userId).then((user) => {
            if (user) next(); // Need to add banned check here
            // Error code 403 Forbidden
            else res.status(403).json({ message: "User is banned" });
          });
        })
        .catch((err) => {
          res.status(403).json({ message: "Invalid Token Login To Proceed" });
        });
    }
  });
}
function adminAuth(req, res, next) {
  // Get jwt cookie from request
  // Return the encoded token if found or undefind if not
  const token = req.cookies.adminjwt;
  // Error code 401 Unauthorized
  if (!token) res.status(406).json({ message: "Login to proceed" });
  jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
    if (err) {
      // Not Acceptable
      return res.status(401).json({ message: "Not acceptable token" });
    } else {
      // Look for the token on the database
      AdminToken.findById(decodedToken.id)
        .then((result) => {
          // Look if the token refers to a real account or not
          Admin.findById(result.adminId)
            .then((admin) => {
              if (admin) next(); // Need to add banned check here
              // Error code 403 Forbidden
              else res.status(403).json({ message: "User is banned" });
            })
            .catch((err) => {
              res
                .status(403)

                .cookie("adminjwt", "", { httpOnly: true, maxAge: 100 })
                .json({ message: "You dont have the role for this action" });
            });
        })
        .catch((err) => {
          res
            .status(403)
            .cookie("adminjwt", "", { httpOnly: true, maxAge: 100 })
            .json({ message: "Invalid Token Login To Proceed" });
        });
    }
  });
}

module.exports = { userAuth, adminAuth };
