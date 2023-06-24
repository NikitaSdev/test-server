import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put
} from "@nestjs/common"
import { UserService } from "./user.service"
import { SendFriendRequestDto, UpdateProfileDto } from "./dto/user.dto"

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll() {
    return this.userService.getAll()
  }
  @Get("receivers")
  async getFriendRequests(@Body("id") id: number) {
    return this.userService.getReceivers(id)
  }
  @Post("sendFriendRequest")
  async sendFriendRequest(@Body() dto: SendFriendRequestDto) {
    return this.userService.sendFriendRequest(dto)
  }
  @Post("acceptFriendRequest")
  async acceptFriendRequest(@Body("requestId") requestId: number) {
    return this.userService.acceptFriendRequest(requestId)
  }
  @Post("declineFriendRequest")
  async declineFriendRequest(@Body("requestId") requestId: number) {
    return this.userService.declineFriendRequest(requestId)
  }
  @Delete()
  async deleteUser(@Body("id") id: number) {
    return this.userService.delete(id)
  }

  @Get(":name")
  async getUser(@Param("name") name: string) {
    return this.userService.byName(name)
  }
  @Patch("Profile")
  async updateProfile(@Body() dto: UpdateProfileDto) {
    return this.userService.updateProfile(dto)
  }
}
