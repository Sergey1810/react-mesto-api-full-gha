const bcrypt = require('bcrypt');
const User = require('../models/users');
const { generateToken } = require('../utils/token');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const ConflictError = require('../errors/conflict-error');
const InternalServerError = require('../errors/internal-server-error');
const UnauthorizedError = require('../errors/unauthorized-error');

const userBadRequestError = (e, res, next) => {
  if (e.name === 'ValidationError') {
    next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
  } if (e.name === 'CastError') {
    next(new NotFoundError('Пользователь по указанному id не найден.'));
  }
  return next(new InternalServerError('errors'));
};

const getUserMe = (req, res, next) => {
  const { id } = req.user;
  return User.findById(id)
    .then((user) => {
      if (!user) {
        next(new ForbiddenError('Такого пользователя не существует'));
      }
      return res.status(200).send(user);
    })
    .catch((e) => {
      userBadRequestError(e, res, id);
    });
};

const getUsers = (req, res, next) => User.find({})
  .then((users) => res.status(200).send(users))
  .catch((e) => userBadRequestError(e, res, next));

const getUserById = (req, res, next) => {
  const { id } = req.params;
  return User.findById(id, { new: true })
    .then((user) => res.status(200).send(user))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Не передан email или пароль');
  }
  return User.findOne({ email }).select('+password')
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (user) {
        throw new ConflictError('Пользователь уже существует');
      }
      bcrypt.hash(password, 10)
        .then((hash) => User.create({
          email,
          password: hash,
          name,
          about,
          avatar,
        }))
        .then((users) => res.status(201).send(users))
        .catch(next);
    })
    .catch(next);
};

const updateUserById = (req, res, next) => {
  const { id } = req.user;
  const updateUser = req.body;
  return User.findByIdAndUpdate(id, updateUser, { new: true })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

const updateAvatarUserById = (req, res, next) => {
  const { id } = req.user;
  const { avatar } = req.body;
  return User.findByIdAndUpdate(id, { avatar }, { new: true })
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

// eslint-disable-next-line consistent-return
const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new BadRequestError('Не передан email или пароль'));
  }
  User.findOne({ email }).select('+password')
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return next(new ForbiddenError('Такого пользователя не существует'));
      }
      bcrypt.compare(password, user.password, (err, isPasswordMatch) => {
        if (!isPasswordMatch) {
          return next(new UnauthorizedError('Неправильный логин или пароль'));
        }
        const token = generateToken(user._id);
        return res.status(200).send({ token });
      });
    })
    .catch((e) => {
      userBadRequestError(e, res);
      next(e);
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserById,
  updateAvatarUserById,
  login,
  getUserMe,
};
