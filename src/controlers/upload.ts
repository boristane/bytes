import aws from "aws-sdk";
import multerS3 from "multer-s3";
import * as os from "os";
import multer from "multer";
import { RequestHandler } from "express";
require("dotenv").config();

const s3 = new aws.S3();

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID
});

let storage: multer.StorageEngine;
if (process.env.ENV === "prod") {
  storage = multerS3({
    s3,
    bucket: process.env.BUCKET,
    key: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });
} else {
  storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, os.tmpdir());
    },
    filename: function(req, file, cb) {
      cb(null, file.originalname);
    }
  });
}

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "text/markdown"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const limits = {
  fileSize: 1024 * 1024 * 5
};

const upload: RequestHandler = multer({ storage, limits, fileFilter }).fields([
  { name: "body", maxCount: 1 },
  { name: "image", maxCount: 1 }
]);

export default upload;
