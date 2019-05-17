import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable
} from "typeorm";
import { User } from "./User";
import { Tag } from "./Tag";

@Entity()
export class Byte {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  title: string;

  @Column()
  image: string;

  @Column()
  body: string;

  @ManyToMany(type => Tag)
  @JoinTable()
  categories: Tag[];

  // @OneToOne(type => User)
  // @JoinColumn()
  // author: User;

  @Column({ type: "timestamp", default: new Date() })
  created: Date;

  @Column({ type: "timestamp", default: new Date() })
  updated: Date;
}
