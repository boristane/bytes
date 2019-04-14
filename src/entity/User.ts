import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column({ type: "timestamp", default: new Date() })
  last_updated: Date;

  @Column({
    default: false
  })
  admin: boolean;
}
