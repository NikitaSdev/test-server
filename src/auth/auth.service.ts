import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from "@nestjs/common"
import { User } from "src/user/user.entity"
import { AuthDto, LoginDto } from "./dto/auth.dto"
import { compare, genSalt, hash } from "bcryptjs"
import { JwtService } from "@nestjs/jwt"
import { RefreshTokenDto } from "./dto/refreshToken.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto)
    const tokens = await this.issueTokenPair(String(user))
    return {
      user,
      ...tokens
    }
  }
  async register(dto: AuthDto) {
    const sameUser = await this.usersRepository
        .createQueryBuilder("user")
        .where("user.email = :email OR user.login = :login", {
          email: dto.email, login:dto.login
        })
        .getOne()
    if(sameUser) throw new BadRequestException("Пользователь уже существует")
    const salt = await genSalt()
    const newUser = new User()
    newUser.login = dto.login
    newUser.email = dto.email
    newUser.name = dto.name
    newUser.password = await hash(dto.password,salt)
    await this.usersRepository.save(newUser)
    const tokens = await this.issueTokenPair(String(newUser.id))
    return {
      user: this.returnUserFields(newUser),
      ...tokens
    }
  }

  async validateUser(dto: LoginDto) {
    const user = await this.usersRepository
      .createQueryBuilder("user")
      .where("user.email = :emailOrLogin OR user.login = :emailOrLogin", {
        emailOrLogin: dto.emailOrLogin
      })
      .getOne()
    if (!user) {
      throw new UnauthorizedException("Пользователь не найден")
    }
    const isValidPassword = await compare(dto.password, user.password)
    if (!isValidPassword) {
      throw new UnauthorizedException("Неверный пароль")
    }
    return user
  }
  async issueTokenPair(userId: string) {
    const data = { _id: userId }
    const refreshToken = await this.jwtService.signAsync(data, {
      expiresIn: "15d"
    })

    const accessToken = await this.jwtService.signAsync(data, {
      expiresIn: "1h"
    })
    return { refreshToken, accessToken }
  }
  returnUserFields(user: User) {
    return {
      id: user.id,
      login: user.login,
      email: user.email,
      friends:user.friends,
      receivedFriendRequests:user.receivedFriendRequests,
      sentFriendRequests:user.sentFriendRequests
    }
  }
  async getNewTokens({ refreshToken }: RefreshTokenDto) {
    if (!refreshToken) {
      throw new UnauthorizedException("Sign in")
    }
    const result = await this.jwtService.verifyAsync(refreshToken)
    if (!result) {
      throw new UnauthorizedException("Invalid token or expired")
    }
    const user = await this.usersRepository.findOne({
      where: { id: result.id }
    })
    const tokens = await this.issueTokenPair(String(user.id))
    return {
      user: this.returnUserFields(user),
      ...tokens
    }
  }
}
