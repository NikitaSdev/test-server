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
  @Column()
  wrapperURL: string
  @Column({ default: "" })
  avatarURL: string
  @OneToMany((type) => FriendRequest, (friendRequest) => friendRequest.receiver)
  receivedFriendRequests: FriendRequest[]
  @OneToMany((type) => FriendRequest, (friendRequest) => friendRequest.sender)
  sentFriendRequests: FriendRequest[]
  @ManyToMany((type) => User, (friends) => friends.friends)
  friends: User[]
}
@Entity()
export class FriendRequest {
  @PrimaryGeneratedColumn()
  id: number
  @ManyToOne((type) => User, (sender) => sender.sentFriendRequests)
  sender: User

  @ManyToOne((type) => User, (receiver) => receiver.receivedFriendRequests)
  receiver: User

  @CreateDateColumn()
  createdAt: Date

  @Column()
  status: "pending" | "accepted" | "rejected"
}

@Entity()
export class Friends {
  @PrimaryGeneratedColumn()
  id: number
  @ManyToMany(() => User, (user) => user.friends)
  user: User
  @ManyToMany(() => User, { cascade: true })
  @JoinTable({
    name: "friend_connections",
    joinColumn: { referencedColumnName: "id" },
    inverseJoinColumn: { referencedColumnName: "id" }
  })
  friends: User[]
}
