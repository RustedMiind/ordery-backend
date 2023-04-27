const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const AdminToken = require("../models/AdminToken");

const handleErrors = function (err) {
  const error = { message: err };
  if (typeof err === "string") {
    return error;
  }
  // return error;
  if (err.code === 11000 && err.keyPattern.phone === 1) {
    error.message = "This phone number is registered already";
  } else if (err.code === 11000 && err.keyPattern.userId === 1) {
    error.message =
      "This user has another login session, do you want to login anyways?";
  } else if (err.message.includes("fName")) {
    error.message = "Your first name is Required";
  } else if (err.message.includes("fName")) {
    error.message = "Your last name is Required";
  } else if (err.message.includes("phone")) {
    error.message = "Your phone number is Required";
  } else if (err.message.includes("address")) {
    error.message = "Your address is Required";
  } else if (err.message.includes("city")) {
    error.message = "The city is Required";
  }
  return { error };
};

// Create Json Web token function
const DAY = 1000 * 60 * 60 * 24;
const createToken = (id, days = 1) => {
  return jwt.sign({ id }, process.env.SECRET, {
    expiresIn: DAY * days,
  });
};

module.exports.checkadmin = (req, res) => {
  const token = req.cookies.adminjwt;
  // Error code 401 Unauthorized
  if (!token) return res.status(406).json({ message: "No login token found" });
  jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
    if (err) {
      res.cookie("adminjwt", "temp", { httpOnly: true, maxAge: 100 });
      // Not Acceptable
      return res.status(401).json({ message: "Not acceptable token" });
    } else {
      // Look for the token on the database
      AdminToken.findById(decodedToken.id)
        .then((result) => {
          // Look if the token refers to a real account or not
          if (!result) {
          } else {
            Admin.findById(result.adminId)
              .then((admin) => {
                if (admin) {
                  res.status(200).json(adminUI(admin));
                } // Need to add banned check here
                // Error code 403 Forbidden
                else res.status(403).json({ message: "Admin is banned" });
              })
              .catch((err) => {
                res.status(403).json({ message: "No Login" });
                res.cookie("adminjwt", "temp", { httpOnly: true, maxAge: 100 });
                console.log(err);
              });
          }
        })
        .catch(() => {
          res.status(403).json({ message: "No Login" });
        });
    }
  });
};

module.exports.login = (req, res) => {
  const { username, password } = req.body;
  Admin.login(username, password)
    .then((admin) => {
      res.cookie("adminjwt", admin.token, { httpOnly: true, maxAge: DAY });
      res.json(admin.admin);
    })
    .catch((err) => {
      res.json(handleErrors(err));
    });
};
module.exports.register = async (req, res) => {
  const admin = new Admin(req.body);
  try {
    const response = await admin.save();
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(handleErrors(error));
  }
};

function adminUI(admin) {
  const { password, createdAt, updatedAt, ...data } = admin._doc;
  return data;
}
