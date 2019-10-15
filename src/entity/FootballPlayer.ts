import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class FootballPlayer {
  @PrimaryColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public country: string;

  @Column({
    type: "varchar",
    length: 2000
  })
  public picture: string;

  @Column()
  public position: string;

  @Column()
  public attack: number;

  @Column()
  public defence: number;
}

export default FootballPlayer;