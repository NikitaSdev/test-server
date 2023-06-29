import {
  BadRequestException,
  Injectable,
  NotFoundException
} from "@nestjs/common"
import { Deed, FriendRequest, User } from "./user.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import {
  DeedDto,
  SendFriendRequestDto,
  UpdateDeedDto,
  UpdateProfileDto
} from "./dto/user.dto"

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: Repository<FriendRequest>,
    @InjectRepository(Deed)
    private readonly deedRepository: Repository<Deed>
  ) {}

  async byName(name: string) {
    const user = await this.usersRepository.find({
      where: { name: name }
    })
    if (!user) {
      throw new NotFoundException("Пользователь не найден")
    }
    return user
  }
  async byId(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      relations: ["friends"]
    })
    if (!user) {
      throw new NotFoundException("Пользователь не найден")
    }
    return user
  }
  async getAnotherUserProfile(yourId: number, anotherUserId: number) {
    const you = await this.usersRepository.findOne({
      where: { id: yourId },
      relations: ["friends"]
    })
    const anotherUser = await this.usersRepository.findOne({
      where: { id: anotherUserId },
      relations: ["friends"]
    })

    const friendIds = you.friends.map((friend) => friend.id)

    if (friendIds.includes(anotherUserId)) {
      const deeds = await this.deedRepository.find({
        where: { user: anotherUser }
      })
      console.log(deeds)
      return {
        name: anotherUser.name,
        description: anotherUser.description,
        avatarURL: anotherUser.avatarURL,
        wrapperURL: anotherUser.wrapperURL,
        deeds
      }
    } else {
      return { name: anotherUser.name, description: anotherUser.description }
    }
  }
  async getUsersCount() {
    return await this.usersRepository.count()
  }
  async getSentFriendRequests(id: number) {
    const sender = await this.usersRepository.findOne({ where: { id: id } })
    return await this.friendRequestRepository.find({
      where: {
        sender: sender
      },
      relations: ["receiver"]
    })
  }
  async getFriendRequests(id: number) {
    const receiver = await this.usersRepository.findOne({ where: { id: id } })
    return await this.friendRequestRepository.find({
      where: {
        receiver: receiver
      },
      relations: ["sender"]
    })
  }
  async sendFriendRequest(dto: SendFriendRequestDto) {
    const sender = await this.usersRepository.findOne({
      where: { id: dto.senderId }
    })
    const receiver = await this.usersRepository.findOne({
      where: { id: dto.receiverId }
    })
    if (!sender) throw new BadRequestException("Ты похоже перепутал")
    if (!receiver) throw new BadRequestException("Получатель не найден")
    await this.friendRequestRepository.delete({
      sender,
      receiver
    })

    const friendRequest = new FriendRequest()
    friendRequest.createdAt = new Date()
    friendRequest.sender = sender
    friendRequest.receiver = receiver
    friendRequest.status = "pending"
    return await this.friendRequestRepository.save(friendRequest)
  }

  async acceptFriendRequest(userId: number, senderId: number) {
    const [user, friend] = await Promise.all([
      this.usersRepository.findOne({
        where: { id: userId },
        relations: ["friends"]
      }),
      this.usersRepository.findOne({
        where: { id: senderId },
        relations: ["friends"]
      })
    ])

    if (!user) {
      throw new BadRequestException("Пользователь не найден")
    }

    if (!friend) {
      throw new BadRequestException("Друг не найден")
    }

    if (user.friends.some((fr) => fr.id === friend.id)) {
      await this.friendRequestRepository.delete({
        sender: friend,
        receiver: user
      })
      return
    }

    user.friends.push(friend)
    friend.friends.push(user)

    await this.friendRequestRepository.delete({
      sender: friend,
      receiver: user
    })
    await this.usersRepository.save([user, friend])
  }

  async declineFriendRequest(requestId: number) {
    return await this.friendRequestRepository.delete({
      id: requestId
    })
  }

  async deleteFriend(userId: number, friendId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ["friends"]
    })
    const friend = await this.usersRepository.findOne({
      where: { id: friendId }
    })
    user.friends = user.friends.filter((f) => f.id !== friend.id)
    await this.usersRepository.save(user)
  }

  async createDeed(dto: DeedDto) {
    const user = await this.usersRepository.findOne({
      where: { id: dto.userId }
    })
    const deed = new Deed()
    deed.createdAt = new Date()
    deed.title = dto.title
    deed.description = dto.description
    deed.user = user
    return await this.deedRepository.save(deed)
  }
  async updateDeed(dto: UpdateDeedDto) {
    const deed = await this.deedRepository.findOne({
      where: {
        id: dto.deedId
      }
    })
    if (!deed) throw new BadRequestException("Доброе дело не найдено")
    return await this.deedRepository.update(deed, {
      description: dto.description || deed.description,
      title: dto.title || deed.title
    })
  }
  async getDeed(userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } })
    if (!user) throw new BadRequestException("Пользователь не найден")
    return await this.deedRepository.find({
      where: { user: user },
      order: {
        createdAt: "DESC"
      }
    })
  }
  async getDeedsCount() {
    return await this.deedRepository.count()
  }
  async deleteDeed(deedId: number) {
    return await this.deedRepository.delete({ id: deedId })
  }
  async updateProfile(dto: UpdateProfileDto) {
    const { id, wrapperURL, avatarURL, name, description } = dto

    const user = await this.usersRepository.findOne({ where: { id } })
    if (!user) {
      throw new BadRequestException("Пользователь не найден")
    }

    user.wrapperURL = wrapperURL || user.wrapperURL
    user.avatarURL = avatarURL || user.avatarURL
    user.name = name || user.name
    user.description = description || user.description

    return await this.usersRepository.save(user)
  }

  async delete(id: number) {
    return {
      user: await this.usersRepository.findOne({ where: { id: id } }),
      message: "Удаление прошло успешно",
      delete: await this.usersRepository.delete({ id: id })
    }
  }
}
