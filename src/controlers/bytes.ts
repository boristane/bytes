import { getRepository, getConnection } from "typeorm";
import { Request, Response } from "express";
import { send500, send404, send401, send403 } from "../utils/defaultResponses";
import { Byte } from "../entity/Byte";

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
