import {
  BadRequestException,
  Injectable,
  NotFoundException
} from "@nestjs/common"
import { Deed, Deeds, FriendRequest, Friends, User } from "./user.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { SendFriendRequestDto, UpdateProfileDto } from "./dto/user.dto"

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: Repository<FriendRequest>,
    @InjectRepository(Friends)
    private readonly friendsRepository: Repository<Friends>,
    @InjectRepository(Deeds)
    private readonly DeedsRepository: Repository<Deeds>,
    @InjectRepository(Deed)
    private readonly DeedRepository: Repository<Deed>
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

  async acceptFriendRequest(requestId: number) {
    const friendRequest = await this.friendRequestRepository.findOne({
      where: { id: requestId }
    })

    await this.friendRequestRepository.update(requestId, {
      status: "accepted"
    })

    const friendsEntity = new Friends()
    friendsEntity.user = friendRequest.sender
    friendsEntity.friends = [friendRequest.receiver]
    await this.friendsRepository.save(friendsEntity)
  }

  async declineFriendRequest(requestId: number) {
    await this.friendRequestRepository.update(requestId, {
      status: "declined"
    })
  }

  async createDeed() {}

  async updateProfile(dto: UpdateProfileDto) {
    const user = await this.usersRepository.findOne({ where: { id: dto.id } })
    if (!user) throw new BadRequestException("Пользователь не найден")

    await this.usersRepository.update(user, {
      wrapperURL: dto.wrapperURL || user.wrapperURL,
      avatarURL: dto.avatarURL || user.avatarURL,
      name: dto.name || user.name
    })
  }

  async delete(id: number) {
    return {
      user: await this.usersRepository.findOne({ where: { id: id } }),
      message: "Удаление прошло успешно",
      delete: await this.usersRepository.delete({ id: id })
    }
  }
}
