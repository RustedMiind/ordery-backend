const mongoose = require("mongoose");
const AdminToken = require("./AdminToken");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

// fire a function before doc saved to db
adminSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const DAY = 1000 * 60 * 60 * 24;
const createToken = (id, days = 1) => {
  return jwt.sign({ id }, process.env.SECRET, {
    expiresIn: DAY * days,
  });
};

adminSchema.statics.login = function (username, password) {
  return new Promise((resolve, reject) => {
    this.findOne({ username })
      .then((admin) => {
        if (!admin) reject("Username number is inccorrect");
        else {
          bcrypt.compare(password, admin.password, (err, isCorrect) => {
            if (err) reject("Password compiling error");
            if (isCorrect) {
              const adminToken = new AdminToken({ adminId: admin._id });
              AdminToken.findOneAndDelete({ adminId: admin._id })
                .then(() => {
                  adminToken.save().then((dbToken) => {
                    const { password, createdAt, updatedAt, ...data } =
                      admin._doc;
                    const token = createToken(dbToken._id);
                    resolve({ admin: data, token });
                  });
                })
                .catch(reject);
            } else reject("Password is incorrect");
          });
        }
      })
      .catch();
  });
};

const Admin = mongoose.model("admin", adminSchema);

module.exports = Admin;
