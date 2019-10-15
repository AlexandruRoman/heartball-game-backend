import Spell from "../entity/Spell";
import { GameState, UserGameState } from "./interfaces";
import FootballPlayer from "../entity/FootballPlayer";

export default function spellCard(game: GameState, card: Spell, userNo: string): GameState {
  console.log('spell card played')
  let userData: UserGameState
  let otherUserData: UserGameState
  let newPlayedCards: FootballPlayer[]
  let newOtherPlayedCards: FootballPlayer[]
  if (userNo === 'user1') {
    userData = game.user1
    otherUserData = game.user2
  }
  if (userNo === 'user2') {
    userData = game.user2
    otherUserData = game.user1
  }

  switch (card.id) {
    case 2:
      [newPlayedCards, newOtherPlayedCards] = spell_2(userData.playedCards, otherUserData.playedCards)
      break;
    case 3:
      [newPlayedCards, newOtherPlayedCards] = spell_3(userData.playedCards, otherUserData.playedCards)
      break;
    case 4:
      [newPlayedCards, newOtherPlayedCards] = spell_4(userData.playedCards, otherUserData.playedCards)
      break;
    case 5:
      [newPlayedCards, newOtherPlayedCards] = spell_5(userData.playedCards, otherUserData.playedCards)
      break;
    case 6:
      [newPlayedCards, newOtherPlayedCards] = spell_6(userData.playedCards, otherUserData.playedCards)
      break;
    case 7:
      [newPlayedCards, newOtherPlayedCards] = spell_7(userData.playedCards, otherUserData.playedCards)
      break;
    case 8:
      [newPlayedCards, newOtherPlayedCards] = spell_8(userData.playedCards, otherUserData.playedCards)
      break;
    case 9:
      [newPlayedCards, newOtherPlayedCards] = spell_9(userData.playedCards, otherUserData.playedCards)
      break;

    default:
      break;
  }

  userData.playedCards = newPlayedCards
  otherUserData.playedCards = newOtherPlayedCards
  userData.unplayedCards.spells = userData.unplayedCards.spells.filter(x => x.id != card.id)
  if (userNo === 'user1') {
    game.user1 = userData
    game.user2 = otherUserData
  }
  if (userNo === 'user2') {
    game.user2 = userData
    game.user1 = otherUserData
  }

  return game
}

function spell_2(playedCards: FootballPlayer[], otherPlayedCards: FootballPlayer[]) {
  if (otherPlayedCards.length > 0)
    otherPlayedCards.pop()
  return [playedCards, otherPlayedCards]
}
function spell_3(playedCards: FootballPlayer[], otherPlayedCards: FootballPlayer[]) {
  if (otherPlayedCards.length === 0)
    return [playedCards, otherPlayedCards]
  const rand = getRandomIndex(otherPlayedCards)
  otherPlayedCards[rand].attack -= 1
  otherPlayedCards[rand].defence -= 2
  return [playedCards, otherPlayedCards]
}
function spell_4(playedCards: FootballPlayer[], otherPlayedCards: FootballPlayer[]) {
  if (playedCards.length === 0)
    return [playedCards, otherPlayedCards]
  const rand = getRandomIndex(playedCards)
  playedCards[rand].attack += 2
  playedCards[rand].defence += 2
  return [playedCards, otherPlayedCards]
}
function spell_5(playedCards: FootballPlayer[], otherPlayedCards: FootballPlayer[]) {
  for (let i = 0; i < otherPlayedCards.length; i++)
    otherPlayedCards[i].attack--
  return [playedCards, otherPlayedCards]
}
function spell_6(playedCards: FootballPlayer[], otherPlayedCards: FootballPlayer[]) {
  if (playedCards.length === 0)
    return [playedCards, otherPlayedCards]
  const rand = getRandomIndex(playedCards)
  playedCards[rand].attack += 1
  return [playedCards, otherPlayedCards]
}
function spell_7(playedCards: FootballPlayer[], otherPlayedCards: FootballPlayer[]) {
  for (let i = 0; i < playedCards.length; i++)
    playedCards[i].attack += 2
  for (let i = 0; i < otherPlayedCards.length; i++)
    otherPlayedCards[i].defence -= 2
  return [playedCards, otherPlayedCards]
}
function spell_8(playedCards: FootballPlayer[], otherPlayedCards: FootballPlayer[]) {
  if (playedCards.length === 0)
    return [playedCards, otherPlayedCards]
  if (otherPlayedCards.length === 0)
    return [playedCards, otherPlayedCards]
  let rand

  rand = getRandomIndex(playedCards)
  playedCards[rand].attack -= 1
  playedCards[rand].defence += 2
  rand = getRandomIndex(playedCards)
  playedCards[rand].attack -= 1
  playedCards[rand].defence += 2

  rand = getRandomIndex(otherPlayedCards)
  otherPlayedCards[rand].attack -= 1
  otherPlayedCards[rand].defence += 2
  rand = getRandomIndex(otherPlayedCards)
  otherPlayedCards[rand].attack -= 1
  otherPlayedCards[rand].defence += 2

  return [playedCards, otherPlayedCards]
}
function spell_9(playedCards: FootballPlayer[], otherPlayedCards: FootballPlayer[]) {
  for (let i = 0; i < playedCards.length; i++)
    playedCards[i].attack += 3
  for (let i = 0; i < otherPlayedCards.length; i++)
    otherPlayedCards[i].attack -= 3
  return [playedCards, otherPlayedCards]
}

function getRandomIndex(array: any[]) {
  return Math.floor(Math.random() * array.length)
}