import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { User } from "./User";
import { Tag } from "./Tag";

@Entity()
export class Byte {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true })
  title: string;

  @Column()
  image: string;

  @Column()
  body: string;

  @ManyToMany(type => Tag, { onDelete: "CASCADE" })
  @JoinTable()
  tags: Tag[];

  @ManyToOne(type => User, author => author.bytes, { onDelete: "CASCADE" })
  author: User;

  @CreateDateColumn()
  created?: Date;

  @UpdateDateColumn()
  updated?: Date;
}
