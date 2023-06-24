import { Module } from "@nestjs/common"
import { UserService } from "./user.service"
import { UserController } from "./user.controller"
import { ConfigModule } from "@nestjs/config"

import { TypeOrmModule } from "@nestjs/typeorm"
import { Deed, FriendRequest, Friends, User } from "./user.entity"

@Module({
  imports: [
    TypeOrmModule.forFeature([User, FriendRequest, Friends, Deed]),
    ConfigModule
  ],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
