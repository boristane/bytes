import Slack from "node-slack";
require("dotenv").config();

const hookURL = process.env.SLACK_HOOK_URL;
const slack = new Slack(hookURL);
export default function messenger(text: string) {
  if (process.env.ENV !== "prod") {
    return;
  }
  slack.send({
    text,
    channel: "#bytes",
    username: "Bytes"
  });
}
