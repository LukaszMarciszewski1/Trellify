import jwt from "jsonwebtoken";
import {config } from '../config/config'

const generateToken = (id:  string) => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: "30d",
  });
};

export default generateToken;