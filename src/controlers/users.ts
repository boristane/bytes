import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { Request, Response } from "express";
import send500 from "../utils/send500";

export async function getAll(req: Request, res: Response) {
  try {
    const userRepository = getRepository(User);
    const users = await userRepository.createQueryBuilder("user").getMany();

    if (users.length === 0) {
      return res.status(404).json({
        message: "No entry found."
      });
    }

    const response = {
      count: users.length,
      users: users.map(doc => ({
        _id: doc.id,
        username: doc.name,
        email: doc.email,
        createdAt: doc.created,
        updatedAt: doc.updated,
        request: {
          type: "GET",
          url: `${process.env.URL}/users/${doc.id}`
        }
      }))
    };

    return res.status(200).json(response);
  } catch (err) {
    send500(res, err);
  }
}

export async function signup(req, res) {}

export default {
  getAll,
  signup
};
