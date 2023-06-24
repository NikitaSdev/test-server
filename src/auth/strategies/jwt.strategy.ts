import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { ConfigService } from "@nestjs/config"
import { User } from "../../user/user.entity"

import { Injectable } from "@nestjs/common"
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get("JWT_SECRET")
    })
  }
  async validate({ id }: Pick<User, "id">) {
    return await this.usersRepository.findOne({where:{id:id}} )
  }
}
