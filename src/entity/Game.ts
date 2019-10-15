import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Game {
  @PrimaryColumn()
  public id: string;

  @Column({
    type: "mediumtext"
  })
  public game: string;
}

export default Game;