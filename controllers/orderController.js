const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");
const UserToken = require("../models/UserToken");
const User = require("../models/User");
const AdminToken = require("../models/AdminToken");
const jwt = require("jsonwebtoken");

module.exports.createNewOrder = (req, res) => {
  let orderData = {
    items: req.body.items, // {_id,amount},
    total: 0,
  };
  const idsArr = orderData.items.map((item) => item._id);
  MenuItem.find({ _id: { $in: idsArr } })
    .then((result) => {
      console.log("result ", result);
      return new Promise((resolve, reject) => {
        const withAmount = result.map((item) => {
          let itemAmount = 0;
          orderData.items.forEach((orderItem) => {
            if (orderItem._id === item.id) {
              itemAmount = orderItem.amount;
            }
          });
          return {
            totalPrice: itemAmount * item.price,
            amount: itemAmount,
            _id: item._id,
          };
        });
        orderData.items = withAmount;
        let totalPrice = 0;
        orderData.items.forEach((item) => {
          totalPrice += item.totalPrice;
        });

        orderData.total = totalPrice;

        // if (result.length !== orderData.items.length) {
        //   reject({ message: "Error on collecting one menu item or more" });
        // } else {
        //   resolve();
        // }

        // console.log(result.length !== orderData.items.length);
        // let totalPrice = 0;
        // result.forEach((item) => {
        //   totalPrice += item.price;
        // });
        // orderData.total = totalPrice;
        if (result.length !== orderData.items.length) {
          reject({ message: "Error on collecting one menu item or more" });
        } else {
          resolve();
        }
      });
    })
    .then(() => {
      return new Promise((resolve, reject) => {
        const token = req.cookies.jwt;
        if (!token) reject({ message: "Login Token not found" });
        jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
          if (err) {
            // Not Acceptable
            reject({ message: "Not acceptable token" });
          } else {
            // Look for the token on the database
            UserToken.findById(decodedToken.id)
              .then((result) => {
                orderData.requestedBy = result.userId;
                resolve();
              })
              .catch((err) => {
                reject(err);
              });
          }
        });
      });
    })
    .then(() => {
      new Order(orderData)
        .save()
        .then((result) => {
          res.status(200).json(result);
        })
        .catch((err) => {
          res.status(404).json(err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
};

module.exports.getAll = function (req, res) {
  Order.find({})
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};
module.exports.getUserOrders = function (req, res) {
  Order.find({ requestedBy: req.params.id })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};
module.exports.getUserOrdersbyNumber = function (req, res) {
  User.findOne({ phone: req.params.phone }).then((result) => {
    Order.find({ requestedBy: result._id })
      .then((response) => {
        res.status(200).json(response);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  });
};
module.exports.getNewOrders = function (req, res) {
  Order.find({ submited: false })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};
module.exports.confirmOrder = function (req, res) {
  let update = { submitedBy: "", submited: "true" };

  const token = req.cookies.adminjwt;
  if (!token) reject({ message: "Admin Token not found" });
  jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
    return new Promise((resolve, reject) => {
      if (err) {
        // Not Acceptable
        reject({ message: "Not acceptable token" });
      } else {
        // Look for the token on the database
        AdminToken.findById(decodedToken.id)
          .then((result) => {
            update.submitedBy = result.adminId;
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      }
    })
      .then(() => {
        return new Promise((resolve, reject) => {
          Order.findByIdAndUpdate(req.params.id, update, {
            returnOriginal: false,
          })
            .then(() => {
              Order.find({ submited: false }).then(resolve);
            })
            .catch(reject);
        });
      })
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
