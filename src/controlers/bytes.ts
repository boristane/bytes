import { getRepository, getConnection } from "typeorm";
import { Request, Response } from "express";
import { send500, send404, send401, send403 } from "../utils/defaultResponses";
import { Byte } from "../entity/Byte";
import { auth } from "../auth/checkAuth";
import { getUserBy, getTagBy } from "../utils/utils";
import { Tag } from "../entity/Tag";

export async function getMany(req: Request, res: Response): Promise<Response> {
  try {
    let { page } = req.query;
    page = Number(page);
    const numPerPage = 10;
    const byteRepo = getRepository(Byte);

    const bytes = await byteRepo
      .createQueryBuilder("byte")
      .select()
      .orderBy("byte.created", "ASC")
      .skip((page - 1) * numPerPage)
      .take(numPerPage)
      .getMany();

    if (bytes.length === 0) {
      return send404(res);
    }

    return res.status(200).send({ bytes, page, count: bytes.length });
  } catch (err) {
    send500(res, err);
  }
}

async function saveTags(tags: Tag[]) {
  const promises = tags.map(tag => {
    const result = getConnection()
      .createQueryBuilder()
      .insert()
      .into(Tag)
      .values(tag)
      .execute();
    return result;
  });

  return Promise.all(promises);
}

export async function post(req: Request, res: Response): Promise<Response> {
  try {
    const { title } = req.body;
    const body = req.files["body"][0].location;
    const image = req.files["image"][0].location;
    const tagsStrings = req.body["tags"].split(",").map(tag => tag.trim());
    const token = req.headers.authorization.split(" ")[1];
    const authorEmail = auth(token);
    const author = await getUserBy("email", authorEmail);
    const tags = tagsStrings.map(tag => {
      const obj: Tag = {
        name: tag,
        created: new Date()
      };
      return obj;
    });

    await saveTags(tags);

    const created = new Date();
    const updated = created;

    const byte: Byte = {
      title,
      image,
      body,
      tags,
      created,
      updated,
      author
    };

    const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Byte)
      .values(byte)
      .execute();

    const response = {
      message: "Byte succesfully created.",
      request: {
        type: "GET",
        url: `${process.env.URL}/byte/${result.raw[0].id}`
      }
    };

    return res.status(200).json(response);
  } catch (err) {
    send500(res, err);
  }
}
