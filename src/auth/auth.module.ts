import { Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { AuthController } from "./auth.controller"
import { JwtModule } from "@nestjs/jwt"
import { JwtStrategy } from "./strategies/jwt.strategy"
import { getJWTConfig } from "../jwt.config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from "../user/user.entity"

@Module({
  controllers: [AuthController],
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJWTConfig
    })
  ],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
