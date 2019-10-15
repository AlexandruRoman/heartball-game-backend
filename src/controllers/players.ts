import FootballPlayer from "../entity/FootballPlayer";
import { GameState, UserGameState } from "./interfaces";

export default function playerCard(game: GameState, card: FootballPlayer, userNo: string): GameState {
  console.log('football player card played')
  let userData: UserGameState
  if (userNo === 'user1')
    userData = game.user1
  if (userNo === 'user2')
    userData = game.user2

  userData.playedCards.push(card)
  userData.unplayedCards.footballPlayers = userData.unplayedCards.footballPlayers.filter(x => x.id != card.id)

  if (userNo === 'user1')
    game.user1 = userData
  if (userNo === 'user2')
    game.user2 = userData
  return game
}