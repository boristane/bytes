import { getRepository, getConnection } from "typeorm";
import { Request, Response } from "express";
import { send500, send404, send401, send403 } from "../utils/defaultResponses";
import { Byte } from "../entity/Byte";
import { auth } from "../auth/checkAuth";
import { getUserBy, getTagBy, getByteBy } from "../utils/utils";
import { Tag } from "../entity/Tag";
import messenger from "../utils/slack";
import { MulterFile } from "../types";

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

export async function post(
  req: Request & { files: MulterFile[] },
  res: Response
): Promise<Response> {
  try {
    const { title } = req.body;
    const filesFieldname = process.env.ENV === "prod" ? "location" : "path";
    const body = req.files["body"][0][filesFieldname];
    const image = req.files["image"][0][filesFieldname];
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
  const { id } = req.params;
  const token = req.headers.authorization.split(" ")[1];
  const email = auth(token);
  try {
    const byteToDelete = await getByteBy("id", id);
    if (!byteToDelete) {
      return send404(res);
    }

    const user = await getUserBy("email", email);
    if (!user.admin || !user.activated) {
      return send403(res);
    }

    const byteRepository = getRepository(Byte);
    const result = await byteRepository
      .createQueryBuilder()
      .delete()
      .from(Byte)
      .where("id = :id", { id })
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

export async function getOne(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const byteRepo = getRepository(Byte);
    const result = await byteRepo
      .createQueryBuilder("byte")
      .leftJoinAndSelect("byte.author", "author")
      .select()
      .where(`byte.id = :id`, { id })
      .getOne();
    if (result === undefined) {
      return send404(res);
    }

    const byte = {
      id: result.id,
      title: result.title,
      created: result.created,
      updated: result.updated,
      image: result.image,
      body: result.body,
      tags: result.tags,
      author: {
        name: result.author.name
      }
    };

    const response = {
      message: "Byte found.",
      byte,
      request: {
        type: "GET",
        url: `${process.env.URL}/byte/list`
      }
    };

    return res.status(200).json(response);
  } catch (err) {
    send500(res, err);
  }
}

export async function count(req: Request, res: Response) {
  try {
    const byteRepo = getRepository(Byte);

    const { sum } = await byteRepo
      .createQueryBuilder("byte")
      .select("count(id)", "sum")
      .getRawOne();

    const response = {
      message: "Byte count",
      count: sum,
      request: {
        type: "GET",
        url: `${process.env.URL}/byte/list`
      }
    };

    return res.status(200).json(response);
  } catch (err) {
    send500(res, err);
  }
}
