import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query
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

  @Post("user")
  async byId(@Body("id") id: number) {
    return this.userService.byId(id)
  }
  @Get("friend-requests")
  async getFriendRequests(@Body("id") id: number) {
    return this.userService.getFriendRequests(id)
  }
  @Post("sendFriendRequest")
  async sendFriendRequest(@Body() dto: SendFriendRequestDto) {
    return this.userService.sendFriendRequest(dto)
  }
  @Post("getSentFriendRequests")
  async getSentFriendRequests(@Body("id") id: number) {
    return this.userService.getSentFriendRequests(id)
  }
  @Post("acceptFriendRequest")
  async acceptFriendRequest(
    @Body("userId") userId: number,
    @Body("senderId") senderId: number
  ) {
    return this.userService.acceptFriendRequest(userId, senderId)
  }
  @Post("declineFriendRequest")
  async declineFriendRequest(@Body("requestId") requestId: number) {
    return this.userService.declineFriendRequest(requestId)
  }
  @Delete()
  async deleteUser(@Body("id") id: number) {
    return this.userService.delete(id)
  }
  @Delete("friend")
  async deleteFriend(
    @Body("userId") userId: number,
    @Body("friendId") friendId: number
  ) {
    return this.userService.deleteFriend(userId, friendId)
  }

  @Get("findUser")
  async getUser(@Query("name") name: string) {
    return this.userService.byName(name)
  }
  @Get("users-count")
  async getUsersCount() {
    return this.userService.getUsersCount()
  }
  @Post("anotherUser")
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
