import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { User } from "../models/user";

const users: User[] = [];

export const getAllUsers = (req: Request, res: Response) => {
  const { query, email, phoneNumber } = req.query;

  let filteredUsers = [...users];

  if (query) {
    filteredUsers = filteredUsers.filter(
      (user) =>
        user.firstName.includes(query as string) ||
        user.lastName.includes(query as string) ||
        user.email.includes(query as string) ||
        user.phoneNumber.includes(query as string)
    );
  }

  if (email) {
    filteredUsers = filteredUsers.filter((user) => user.email === (email as string));
  }

  if (phoneNumber) {
    filteredUsers = filteredUsers.filter((user) => user.phoneNumber === (phoneNumber as string));
  }

  res.json(filteredUsers);
};

export const getUserById = (req: Request, res: Response) => {
  const { id } = req.params;
  const user = users.find((user) => user._id === id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
};

export const createUser = (req: Request, res: Response) => {
  const { firstName, lastName, email, phoneNumber } = req.body;

  if (!firstName || !lastName || !email || !phoneNumber) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newUser: User = {
    _id: uuidv4(),
    firstName,
    lastName,
    email,
    phoneNumber,
  };

  users.push(newUser);
  res.status(201).json(newUser);
};

export const updateUser = (req: Request, res: Response) => {
  const { id } = req.params;
  const { firstName, lastName, email, phoneNumber } = req.body;

  const userIndex = users.findIndex((user) => user._id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  const updatedUser: User = {
    ...users[userIndex],
    firstName: firstName || users[userIndex].firstName,
    lastName: lastName || users[userIndex].lastName,
    email: email || users[userIndex].email,
    phoneNumber: phoneNumber || users[userIndex].phoneNumber,
  };

  users[userIndex] = updatedUser;
  res.json(updatedUser);
};

export const deleteUser = (req: Request, res: Response) => {
  const { id } = req.params;
  const userIndex = users.findIndex((user) => user._id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  users.splice(userIndex, 1);
  res.json({ success: true });
};
