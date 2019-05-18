import { getRepository, getConnection } from "typeorm";
import { User } from "../entity/User";
import { Request, Response } from "express";
import send500 from "../utils/send500";
import { hash } from "bcrypt";

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
        id: doc.id,
        username: doc.name,
        email: doc.email,
        createdAt: doc.created,
        updatedAt: doc.updated,
        request: {
          type: "GET",
          url: `${process.env.URL}/user/${doc.id}`
        }
      }))
    };

    return res.status(200).json(response);
  } catch (err) {
    send500(res, err);
  }
}

export async function signup(req: Request, res: Response) {
  try {
    const { email, name, password, admin } = req.body;
    const userRepository = getRepository(User);
    const user = await userRepository
      .createQueryBuilder()
      .select("user")
      .from(User, "user")
      .where("user.email = :email", { email })
      .getOne();

    if (user) {
      return res.status(409).json({
        message: "User already created."
      });
    }

    const saltRounds = 10;
    const hashedPassword = await hash(password, saltRounds);
    const newUser = {
      name,
      email,
      password: hashedPassword,
      created: new Date(),
      updated: new Date(),
      admin
    };

    const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .orIgnore()
      .into(User)
      .values(newUser)
      .execute();

    const response = {
      message: "User created successfully.",
      user: {
        id: result.raw[0].id,
        name,
        email,
        created: result.raw[0].created
      },
      request: {
        type: "GET",
        url: `${process.env.URL}/user/${result.raw[0].id}`
      }
    };

    return res.status(201).json(response);
  } catch (err) {
    send500(res, err);
  }
}

export default {
  getAll,
  signup
};
