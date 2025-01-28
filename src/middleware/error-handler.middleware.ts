import { Injectable, type NestMiddleware, HttpException, HttpStatus } from "@nestjs/common"
import type { Request, Response, NextFunction } from "express"
import * as winston from "winston"

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "sellenix-api" },
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
})

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  )
}

@Injectable()
export class ErrorHandlerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.on("finish", () => {
      const { method, originalUrl, ip } = req
      const { statusCode, statusMessage } = res

      if (statusCode >= 400) {
        logger.error(`${method} ${originalUrl} ${statusCode} ${statusMessage} - ${ip}`)
      }
    })

    next()
  }
}

export function globalErrorHandler(err, req, res, next) {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`)

  if (err instanceof HttpException) {
    return res.status(err.getStatus()).json({
      statusCode: err.getStatus(),
      message: err.message,
    })
  }

  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: "Internal server error",
  })
}

