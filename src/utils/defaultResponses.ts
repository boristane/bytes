import { Response } from "express";

/**
 * Internal server error
 */
export function send500(res: Response, err) {
  const time = new Date();
  console.error(`${time.toUTCString()}: Internal server error: ${err.stack}`);
  return res.status(500).json({
    error: err
  });
}

/**
 * Resource not found
 */
export function send404(res: Response) {
  return res.status(404).json({
    message: "No entry found."
  });
}

/**
 * Authentication failed
 */
export function send401(res: Response) {
  return res.status(401).json({
    message: "Authentication failed."
  });
}

/**
 * Forbidden
 */
export function send403(res: Response) {
  return res.status(403).json({
    message: "Forbidden."
  });
}
