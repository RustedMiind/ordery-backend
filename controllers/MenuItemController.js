const MenuItem = require("../models/MenuItem");

module.exports.getMenu = function (req, res) {
  const menuItem = MenuItem.find({})
    .then((result) => {
      if (menuItem) {
        res.status(200).json(result);
      } else {
        res.status(404).json({});
      }
    })
    .catch((err) => res.status(404).json(err));
};
module.exports.getMenuItem = function (req, res) {
  const menuItem = MenuItem.findById(req.params.id)
    .then((result) => {
      if (menuItem) {
        res.status(200).json(result);
      } else {
        res.status(404).json({});
      }
    })
    .catch((err) => res.status(404).json(err));
};

module.exports.addMenuItem = function (req, res) {
  const menuItem = new MenuItem(req.body);
  menuItem
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};
