const jwt = require("jsonwebtoken");
const models = require("../models");

function generateAccessToken(data) {
  return jwt.sign(data, process.env.APP_SECRET, { expiresIn: "1800s" });
}

const getUsers = (_, res) => {
  models.user
    .findAll()
    .then(([rows]) => {
      res.send(rows);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const postLogin = (req, res) => {
  models.user.login(req.body).then((user) => {
    if (user) {
      const token = generateAccessToken({ id: user.id });
      res.send({ token });
    } else {
      res.status(401).send({ error: "Identifiant incorrect!!!" });
    }
  });
};

const postUser = (req, res) => {
  models.user
    .create(req.body)
    .then(([rows]) => {
      res.send({
        id: rows.insertId,
        email: req.body.email,
        is_admin: req.body.is_admin,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(422).send({ error: err.message });
    });
  // res.status(418).send(req.body)
};

const getProfile = (req, res) => {
  res.send(req.user);
};

const getUser = async (req, res) => {
  const id = +req.params.id;
  try {
    const [result] = await models.user.find(id);
    if (!result.length) {
      return res.status(404).send({ error: "User not found" });
    }
    return res.send(result[0]);
  } catch (error) {
    return res.status(422).send({ error: error.message });
  }
};

module.exports = {
  getUsers,
  postUser,
  postLogin,
  getProfile,
  getUser,
};
