const mongoose = require("mongoose");
const UserToken = require("./UserToken");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema(
  {
    fName: {
      type: String,
      required: true,
    },
    lName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    deliveryFees: {
      type: String,
    },
  },
  { timestamps: true }
);

// fire a function before doc saved to db
userSchema.pre("save", async function (next) {
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

userSchema.statics.login = function (phone, password) {
  return new Promise((resolve, reject) => {
    this.findOne({ phone })
      .then((user) => {
        if (!user) reject("Phone number is inccorrect");
        else {
          bcrypt.compare(password, user.password, (err, isCorrect) => {
            if (err) reject("Password compiling error");
            if (isCorrect) {
              const userToken = new UserToken({ userId: user._id });
              userToken
                .save()
                .then((userToken) => {
                  const { password, createdAt, updatedAt, ...data } = user._doc;
                  const token = createToken(userToken._id);
                  resolve({ user: data, token });
                })
                .catch(reject);
            } else reject("Password is incorrect");
          });
        }
      })
      .catch();
  });
};

userSchema.statics.forcelogin = function (phone, password) {
  return new Promise((resolve, reject) => {
    this.findOne({ phone })
      .then((user) => {
        if (!user) reject("Phone number is inccorrect");
        else {
          bcrypt.compare(password, user.password, (err, isCorrect) => {
            if (err) reject("Password compiling error");
            if (isCorrect) {
              const userToken = new UserToken({ userId: user._id });
              UserToken.findOneAndDelete({ userId: user._id })
                .then(() => {
                  userToken.save().then((dbToken) => {
                    const { password, createdAt, updatedAt, ...data } =
                      user._doc;
                    const token = createToken(dbToken._id);
                    resolve({ user: data, token });
                  });
                })
                .catch((err) => {
                  reject(err);
                });
            } else reject("Password is incorrect");
          });
        }
      })
      .catch((err) => {});
  });
};

const User = mongoose.model("user", userSchema);

module.exports = User;
