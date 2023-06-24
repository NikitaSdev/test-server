import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Redirect,
  Res,
  UsePipes,
  ValidationPipe
} from "@nestjs/common"

import { AuthService } from "./auth.service"
import { AuthDto, LoginDto } from "./dto/auth.dto"
import { RefreshTokenDto } from "./dto/refreshToken.dto"


@Controller("auth")
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}




  @Post("register")
  async register(@Body() dto: AuthDto) {
    return this.AuthService.register(dto)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("login")
  async login(@Body() dto: LoginDto) {
    return this.AuthService.login(dto)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("login/access-token")
  async getNewTokens(@Body() dto: RefreshTokenDto) {
    return this.AuthService.getNewTokens(dto)
  }
}
