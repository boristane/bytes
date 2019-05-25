import { getRepository, getConnection } from "typeorm";
import { Request, Response } from "express";
import { send500, send404, send401, send403 } from "../utils/defaultResponses";
import { Byte } from "../entity/Byte";
import { auth } from "../auth/checkAuth";
import { getUserBy, getTagBy, getByteBy } from "../utils/utils";
import { Tag } from "../entity/Tag";
import messenger from "../utils/slack";

export async function getMany(req: Request, res: Response): Promise<Response> {
  try {
    let { page } = req.query;
    page = Number(page);
    const numPerPage = 10;
    const byteRepo = getRepository(Byte);

    const result = await byteRepo
      .createQueryBuilder("byte")
      .leftJoinAndSelect("byte.author", "author")
      .select()
      .orderBy("byte.created", "DESC")
      .skip((page - 1) * numPerPage)
      .take(numPerPage)
      .getMany();

    if (result.length === 0) {
      return send404(res);
    }

    const bytes = result.map(byte => {
      return {
        id: byte.id,
        title: byte.title,
        created: byte.created,
        updated: byte.updated,
        image: byte.image,
        body: byte.body,
        tags: byte.tags,
        author: {
          name: byte.author.name
        }
      };
    });

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

    if (!author.activated) {
      return send403(res);
    }

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

    messenger(`✔️ New byte posted: *${title}*`);

    return res.status(200).json(response);
  } catch (err) {
    send500(res, err);
  }
}

export async function del(req: Request, res: Response): Promise<Response> {
  const { title } = req.query;
  const token = req.headers.authorization.split(" ")[1];
  const email = auth(token);
  try {
    const byteToDelete = await getByteBy("title", title);
    if (!byteToDelete) {
      return send404(res);
    }

    const user = await getUserBy("email", email);
    if (!user.admin) {
      return send403(res);
    }

    const byteRepository = getRepository(Byte);
    const result = await byteRepository
      .createQueryBuilder()
      .delete()
      .from(Byte)
      .where("title = :title", { title })
      .execute();

    return res.status(200).json({
      message: "Byte succesfully deleted.",
      count: result.affected,
      byte: {
        title: byteToDelete.title,
        authore: byteToDelete.author
      }
    });
  } catch (err) {
    send500(res, err);
  }
}
