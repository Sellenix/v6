import { Injectable, type NestMiddleware } from "@nestjs/common"
import type { Request, Response, NextFunction } from "express"
import rateLimit from "express-rate-limit"

@Injectable()
export class RateLimitingMiddleware implements NestMiddleware {
  private limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
  })

  use(req: Request, res: Response, next: NextFunction) {
    this.limiter(req, res, next)
  }
}

