import FootballPlayer from "../entity/FootballPlayer";
import Spell from "../entity/Spell";

export interface CoachWithSpell {
  idCoach: number
  idSpell: number
  name: string
  nameSpell: string
  country: string
  picture: string
  description: string
  effect: string
}

export interface UnplayedCards {
  footballPlayers: FootballPlayer[]
  spells: Spell[]
  coaches: CoachWithSpell[]
}

export interface UserGameState {
  id: string
  nick: string
  unplayedCards: UnplayedCards
  playedCards: FootballPlayer[]
  score: number
  isPlaying: boolean
}

export interface GameState {
  user1: UserGameState
  user2: UserGameState
  roundNo: number
}