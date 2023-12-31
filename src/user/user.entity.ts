import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique
} from "typeorm"

@Entity()
@Unique(["email", "login"])
export class User {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  login: string
  @Column()
  name: string
  @Column()
  email: string
  @Column()
  password: string
  @Column({ default: "О Вас" })
  description: string
  @Column({ default: "/uploads/wrappers/default.jpg" })
  wrapperURL: string
  @Column({ default: "/uploads/avatars/default.jpg" })
  avatarURL: string
  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.receiver)
  receivedFriendRequests: FriendRequest[]

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.sender)
  sentFriendRequests: FriendRequest[]

  @ManyToMany(() => User, (user) => user.friends)
  @JoinTable()
  friends: User[]

  @OneToMany(() => Deed, (deed) => deed.user)
  deeds: Deed[]
}

@Entity()
export class FriendRequest {
  @PrimaryGeneratedColumn()
  id: number
  @ManyToOne(() => User, (user) => user.sentFriendRequests)
  sender: User

  @ManyToOne(() => User, (user) => user.receivedFriendRequests)
  receiver: User

  @CreateDateColumn()
  createdAt: Date

  @Column()
  status: "pending" | "accepted" | "declined"
}

@Entity()
export class Deed {
  @PrimaryGeneratedColumn()
  id: number
  @ManyToOne(() => User, (user) => user.deeds)
  user: User
  @Column({ default: "" })
  title: string
  @Column({ default: "" })
  description: string
  @CreateDateColumn()
  createdAt: Date
}
