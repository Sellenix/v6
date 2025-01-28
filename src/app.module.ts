import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigModule } from "@nestjs/config"
import { AuthModule } from "./auth/auth.module"
import { UsersModule } from "./users/users.module"
import { SubscriptionsModule } from "./subscriptions/subscriptions.module"
import { WebsiteBuilderModule } from "./website-builder/website-builder.module"
import { SeoToolsModule } from "./seo-tools/seo-tools.module"

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST,
      port: Number.parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    SubscriptionsModule,
    WebsiteBuilderModule,
    SeoToolsModule,
  ],
})
export class AppModule {}

