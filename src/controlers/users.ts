import { getRepository } from "typeorm";
import { User } from "../entity/User";

export async function getAll(req, res) {
  const userRepository = getRepository(User);
  const users = await userRepository.createQueryBuilder("user").getMany();

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
}
