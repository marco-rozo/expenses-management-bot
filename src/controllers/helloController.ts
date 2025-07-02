
import { Request, Response } from 'express';

export const helloWord = async (_: Request, res: Response) => {
  res.status(201).json("hello-word");
};