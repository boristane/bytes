import { getRepository, getConnection } from "typeorm";
import { User } from "../entity/User";
import { Request, Response } from "express";
import { send500, send404, send401, send403 } from "../utils/defaultResponses";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { auth } from "../auth/checkAuth";
import { getUserBy } from "../utils/utils";
import { createToken, sendTokenEmail } from "./activationTokens";
import { ActivationToken } from "../entity/ActivationToken";

export async function getAll(req: Request, res: Response): Promise<Response> {
  try {
    const userRepository = getRepository(User);
    const users = await userRepository.createQueryBuilder("user").getMany();

    if (users.length === 0) {
      return send404(res);
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
          url: `${process.env.URL}/user/?email=${doc.email}`
        }
      }))
    };

    return res.status(200).json(response);
  } catch (err) {
    send500(res, err);
  }
}

export async function signup(req: Request, res: Response): Promise<Response> {
  try {
    const { email, name, password, admin } = req.body;
    // Random regex from the internet. Probably worth using a library instead
    const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    if (!email.match(emailRegex)) {
      return res.status(500).json({
        message: "Invalid email address."
      });
    }

    const user = await getUserBy("email", email);
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

    const createdUser = await getUserBy("email", email);

    const { token } = await createToken(createdUser);
    sendTokenEmail(createdUser.email, token.token);

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
        url: `${process.env.URL}/user/?email=${result.raw[0].id}`
      }
    };

    return res.status(201).json(response);
  } catch (err) {
    send500(res, err);
  }
}

export async function login(req: Request, res: Response): Promise<Response> {
  const { email, password } = req.body;
  try {
    const user = await getUserBy("email", email);
    if (!user) {
      return send401(res);
    }

    const passwordCompare = await compare(password, user.password);

    if (!passwordCompare) {
      return send401(res);
    }
    const token = sign(user.email, process.env.JWT_KEY);

    return res.status(200).json({
      token,
      message: "Authentication successful."
    });
  } catch (err) {
    send500(res, err);
  }
}

export async function getOne(req: Request, res: Response): Promise<Response> {
  const { email: userEmail } = req.query;
  try {
    const user = await getUserBy("email", userEmail);
    if (!user) {
      return send404(res);
    }

    const response = {
      message: "User found.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        admin: user.admin,
        created: user.created,
        updated: user.updated
      },
      request: {
        type: "GET",
        url: `${process.env.URL}/user/`
      }
    };

    return res.status(200).json(response);
  } catch (err) {
    return send500(res, err);
  }
}

export async function del(req: Request, res: Response): Promise<Response> {
  const { email: userEmail } = req.query;
  const token = req.headers.authorization.split(" ")[1];
  const email = auth(token);
  try {
    const userToDelete = await getUserBy("email", userEmail);
    if (!userToDelete) {
      return send404(res);
    }

    const user = await getUserBy("email", email);
    if (!user.admin) {
      return send403(res);
    }

    const userRepository = getRepository(User);
    const result = await userRepository
      .createQueryBuilder()
      .delete()
      .from(User)
      .where("email = :email", { email: userEmail })
      .execute();

    return res.status(200).json({
      message: "User succesfully deleted.",
      count: result.affected,
      user: {
        email: userToDelete.email,
        name: userToDelete.name
      }
    });
  } catch (err) {
    send500(res, err);
  }
}

export async function makeAdmin(req, res): Promise<Response> {
  const { email: userEmail } = req.query;
  const token = req.headers.authorization.split(" ")[1];
  const email = auth(token);
  try {
    const userToMakeAdmin = await getUserBy("email", userEmail);
    if (!userToMakeAdmin) {
      return send404(res);
    }

    const user = await getUserBy("email", email);
    if (!user.admin) {
      return send403(res);
    }

    const userRepository = getRepository(User);
    const result = await userRepository
      .createQueryBuilder()
      .update(User)
      .set({ admin: true })
      .where("email = :email", { email: userEmail })
      .execute();

    return res.status(200).json({
      message: "User succesfully updated.",
      user: {
        email: userToMakeAdmin.email,
        name: userToMakeAdmin.name
      },
      request: {
        type: "GET",
        url: `${process.env.URL}/user/?email=${userEmail}`
      }
    });
  } catch (err) {
    send500(res, err);
  }
}

export async function activate(req: Request, res: Response) {
  try {
    const { token } = req.params;
    const t = await getConnection()
      .getRepository(ActivationToken)
      .createQueryBuilder("token")
      .leftJoinAndSelect("token.user", "user")
      .select()
      .where(`token.token = :token`, { token })
      .getOne();

    if (t === undefined) {
      return send404(res);
    }

    if (t.expires < new Date()) {
      return send403(res);
    }

    const userRepository = getRepository(User);
    const result = await userRepository
      .createQueryBuilder()
      .update(User)
      .set({ activated: true })
      .where("email = :email", { email: t.user.email })
      .execute();

    return res.status(200).json({
      message: "User succesfully updated.",
      user: {
        email: t.user.email,
        name: t.user.name
      },
      request: {
        type: "GET",
        url: `${process.env.URL}/user/?email=${t.user.email}`
      }
    });
  } catch (err) {
    send500(res, err);
  }
}
