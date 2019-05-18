import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Byte } from "./Byte";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ type: "timestamp", default: new Date() })
  updated: Date;

  @Column({ type: "timestamp", default: new Date() })
  created: Date;

  @Column({
    default: false
  })
  admin: boolean;

  @OneToMany(type => Byte, byte => byte.author)
  bytes: Byte[];
}
