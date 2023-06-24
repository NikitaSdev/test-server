import { IsNumber, IsOptional, IsString } from "class-validator"

export class SendFriendRequestDto {
  @IsNumber()
  senderId: number
  @IsNumber()
  receiverId: number
}
export class UpdateProfileDto {
  @IsNumber()
  id: number
  @IsOptional()
  @IsString()
  wrapperURL: string
  @IsOptional()
  @IsString()
  avatarURL: string
  @IsOptional()
  @IsString()
  name: string
}
