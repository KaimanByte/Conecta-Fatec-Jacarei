import { Request, Response } from 'express';
import { UserService } from '../services/UserService.js';
import { isInvalidId, handleError } from '../utils/controllerHelpers.js';

const userService = new UserService();

export const listUsers = async (
  req: Request,
  res: Response
) => {
  try {
    const search =
      typeof req.query.search === 'string'
        ? req.query.search
        : undefined;

    const users = await userService.listAdminUsers(search);

    res.json(users);
  } catch (err) {
    handleError(err, res);
  }
};

export const createUser = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password, role } = req.body;

    const user = await userService.createUser({
      email,
      password,
      role,
    });

    res.status(201).json(user);
  } catch (err) {
    handleError(err, res);
  }
};

export const updateUser = async (
  req: Request,
  res: Response
) => {
  try {
    const paramId = req.params.id;

    if (isInvalidId(paramId)) {
      res.status(400).json({
        error: 'ID inválido',
      });
      return;
    }

    const result = await userService.updateUser(
      Number(paramId),
      req.body
    );

    res.json(result);
  } catch (err) {
    handleError(err, res);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
) => {
  try {
    const paramId = req.params.id;

    if (isInvalidId(paramId)) {
      res.status(400).json({
        error: 'ID inválido',
      });
      return;
    }

    const result = await userService.deleteUser(
      Number(paramId),
      req.user!.id
    );

    res.json(result);
  } catch (err) {
    handleError(err, res);
  }
};