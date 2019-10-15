import { CoachWithSpell, GameState, UserGameState } from "./interfaces";
import FootballPlayer from "../entity/FootballPlayer";
export default function coachSpellCard(game: GameState, card: CoachWithSpell, userNo: string): GameState {
  console.log('coach spell card played')
  let userData: UserGameState
  let newPlayedCards: FootballPlayer[]
  if (userNo === 'user1') {
    userData = game.user1
  }
  if (userNo === 'user2') {
    userData = game.user2
  }

  switch (card.idSpell) {
    case 1:
      newPlayedCards = coachSpell_1(userData.playedCards, card.country)
      break;
    case 2:
      newPlayedCards = coachSpell_2(userData.playedCards, card.country)
      break;
    case 3:
      newPlayedCards = coachSpell_3(userData.playedCards, card.country)
      break;
    case 4:
      newPlayedCards = coachSpell_4(userData.playedCards, card.country)
      break;
    case 5:
      newPlayedCards = coachSpell_5(userData.playedCards, card.country)
      break;
    case 6:
      newPlayedCards = coachSpell_6(userData.playedCards, card.country)
      break;
    case 7:
      newPlayedCards = coachSpell_7(userData.playedCards, card.country)
      break;
    case 8:
      newPlayedCards = coachSpell_8(userData.playedCards, card.country)
      break;

    default:
      break;
  }

  userData.playedCards = newPlayedCards
  userData.unplayedCards.coaches = userData.unplayedCards.coaches.filter(x => x.idCoach != card.idCoach || x.idCoach != card.idCoach)
  if (userNo === 'user1') {
    game.user1 = userData
  }
  if (userNo === 'user2') {
    game.user2 = userData
  }

  return game
}

function coachSpell_1(playedCards: FootballPlayer[], country: string) {
  for (let i = 0; i < playedCards.length; i++)
    if (playedCards[i].country === country)
      playedCards[i].attack += 2
  return playedCards
}
function coachSpell_2(playedCards: FootballPlayer[], country: string) {
  for (let i = 0; i < playedCards.length; i++)
    if (playedCards[i].country === country)
      playedCards[i].defence += 2
  return playedCards
}
function coachSpell_3(playedCards: FootballPlayer[], country: string) {
  for (let i = 0; i < playedCards.length; i++) {
    playedCards[i].attack--
    playedCards[i].defence += 2
  }
  return playedCards
}
function coachSpell_4(playedCards: FootballPlayer[], country: string) {
  for (let i = 0; i < playedCards.length; i++)
    playedCards[i].attack++
  return playedCards
}
function coachSpell_5(playedCards: FootballPlayer[], country: string) {
  for (let i = 0; i < playedCards.length; i++) {
    playedCards[i].defence--
    playedCards[i].attack += 2
  }
  return playedCards
}
function coachSpell_6(playedCards: FootballPlayer[], country: string) {
  for (let i = 0; i < playedCards.length; i++)
    playedCards[i].attack += 2
  return playedCards
}
function coachSpell_7(playedCards: FootballPlayer[], country: string) {
  for (let i = 0; i < playedCards.length; i++)
    playedCards[i].defence++
  return playedCards
}
function coachSpell_8(playedCards: FootballPlayer[], country: string) {
  for (let i = 0; i < playedCards.length; i++)
    playedCards[i].attack += Math.floor(Math.random() * 3)
  return playedCards
}