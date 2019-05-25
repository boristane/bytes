import { User } from "../entity/User";
import { ActivationToken } from "../entity/ActivationToken";
import { getConnection } from "typeorm";
import mailgun from "mailgun-js";

export async function createToken(user: User) {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let t = "";
  for (var i = 16; i > 0; --i) {
    t += chars[Math.round(Math.random() * (chars.length - 1))];
  }
  const validForHours = 2;
  const expires = new Date();
  expires.setHours(expires.getHours() + validForHours);

  const token: ActivationToken = {
    user,
    expires,
    token: t
  };

  const result = await getConnection()
    .createQueryBuilder()
    .insert()
    .orIgnore()
    .into(ActivationToken)
    .values(token)
    .execute();

  return { result, token };
}

export function sendTokenEmail(email: string, token: string) {
  const DOMAIN = process.env.DOMAIN;
  const mg = mailgun({ apiKey: process.env.MAILGUN_KEY, domain: DOMAIN });
  const url = `${process.env.URL}/activate/${token}`;
  const data = {
    from: "Derek Dirk <boris@mail.boristane.com>",
    to: `${email}, boris@mail.boristane.com`,
    subject: "Validate your account",
    html: `<html><body>Click here to validate your account <a href=${url}>${url}</a> </body></html>`
  };
  mg.messages().send(data, function(error, body) {
    console.log(error);
  });
}
