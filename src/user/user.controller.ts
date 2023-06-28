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
import {
  DeedDto,
  SendFriendRequestDto,
  UpdateDeedDto,
  UpdateProfileDto
} from "./dto/user.dto"

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
  async acceptFriendRequest(
    @Body("userId") userId: number,
    @Body("friendId") friendId: number
  ) {
    return this.userService.acceptFriendRequest(userId, friendId)
  }
  @Post("declineFriendRequest")
  async declineFriendRequest(@Body("requestId") requestId: number) {
    return this.userService.declineFriendRequest(requestId)
  }
  @Delete()
  async deleteUser(@Body("id") id: number) {
    return this.userService.delete(id)
  }

  @Get("findUser/:name")
  async getUser(@Param("name") name: string) {
    return this.userService.byName(name)
  }
  @Get("users-count")
  async getUsersCount() {
    return this.userService.getUsersCount()
  }
  @Get("anotherUser")
  async getAnotherUserProfile(
    @Body("yourId") yourId: number,
    @Body("anotherUserId") anotherUserId: number
  ) {
    return this.userService.getAnotherUserProfile(yourId, anotherUserId)
  }
  @Patch("profile")
  async updateProfile(@Body() dto: UpdateProfileDto) {
    return this.userService.updateProfile(dto)
  }
  @Post("deed")
  async createDeed(@Body() dto: DeedDto) {
    return this.userService.createDeed(dto)
  }
  @Get("deed")
  async getDeeds(@Body("userId") userId: number) {
    return this.userService.getDeed(userId)
  }
  @Get("deed-count")
  async getDeedCount() {
    return this.userService.getDeedsCount()
  }
  @Patch("deed")
  async updateDeed(@Body() dto: UpdateDeedDto) {
    return this.userService.updateDeed(dto)
  }
  @Delete("deed")
  async deleteDeed(@Body("deedId") deedId: number) {
    return this.userService.deleteDeed(deedId)
  }
}
