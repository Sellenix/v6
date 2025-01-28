import type { NextApiRequest, NextApiResponse } from "next"
import * as Sentry from "@sentry/node"
import logger from "./logger"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
})

export function errorHandler(err: Error, req: NextApiRequest, res: NextApiResponse) {
  logger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    query: req.query,
    body: req.body,
  })

  Sentry.captureException(err, {
    extra: {
      method: req.method,
      url: req.url,
      query: req.query,
      body: req.body,
    },
  })

  if (err.name === "ValidationError") {
    return res.status(400).json({ error: "Validation Error", details: err.message })
  }

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ error: "Unauthorized" })
  }

  if (process.env.NODE_ENV === "production") {
    return res.status(500).json({ error: "Internal Server Error" })
  } else {
    return res.status(500).json({ error: "Internal Server Error", details: err.message, stack: err.stack })
  }
}

