import {
  BadRequestException,
  Injectable,
  NotFoundException
} from "@nestjs/common"
import { FriendRequest, User } from "./user.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { getRepository, Repository } from "typeorm"
import { SendFriendRequestDto, UpdateProfileDto } from "./dto/user.dto"
import { populateDependencyGraph } from "ts-loader/dist/utils"

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: Repository<FriendRequest>
  ) {}

  async byName(name: string) {
    const user = await this.usersRepository.findOne({
      where: { name: name }
    })
    if (!user) {
      throw new NotFoundException("Пользователь не найден")
    }
    return user
  }

  async getAll() {
    return this.usersRepository.find()
  }

  async getReceivers(id: number) {
    const sender = await this.usersRepository.findOne({ where: { id: id } })
    return await this.friendRequestRepository.find({
      where: {
        sender: sender
      },
      relations: ["receiver"]
    })
  }
  async sendFriendRequest(dto: SendFriendRequestDto) {
    const sender = await this.usersRepository.findOne({
      where: { id: dto.senderId }
    })
    const receiver = await this.usersRepository.findOne({
      where: { id: dto.receiverId }
    })

    await this.friendRequestRepository.delete({
      sender,
      receiver
    })

    const friendRequest = new FriendRequest()
    friendRequest.createdAt = new Date()
    friendRequest.sender = sender
    friendRequest.receiver = receiver
    friendRequest.status = "pending"
    console.log(await this.friendRequestRepository.save(friendRequest))
    return await this.friendRequestRepository.save(friendRequest)
  }

  async acceptFriendRequest(receiverId: number) {}

  async declineFriendRequest(requestId: number) {}

  async updateProfile(dto: UpdateProfileDto) {
    const user = await this.usersRepository.findOne({ where: { id: dto.id } })
    if (!user) throw new BadRequestException("Пользователь не найден")
    dto.wrapperURL && (user.wrapperURL = dto.wrapperURL)
    dto.avatarURL && (user.avatarURL = dto.avatarURL)
    dto.name && (user.name = dto.name)
  }
  async delete(id: number) {
    return {
      user: await this.usersRepository.findOne({ where: { id: id } }),
      message: "Удаление прошло успешно",
      delete: await this.usersRepository.delete({ id: id })
    }
  }
}
