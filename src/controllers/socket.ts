import { Server, Socket } from "socket.io";
import { getRepository } from "typeorm";
import Game from "../entity/Game";
import spellCard from "./spells";
import playerCard from "./players";
import { GameState, UserGameState } from "./interfaces";
import coachSpellCard from "./coach-spells";

let roomno = 1

async function saveGame(roomId: string, game: any) {
  let newGame = new Game()
  newGame.id = roomId
  newGame.game = JSON.stringify(game)
  getRepository('Game').save(newGame)
}

async function getGame(roomId: string) {
  let game: any = await getRepository('Game').findOne(roomId)
  return JSON.parse(game.game)
}

async function chooseRandomCards() {
  let playersQuery = []
  let spellsQuery = []
  let coachesQuery = []
  let coachSpellsQuery = []
  let players
  let spells
  let coaches: any[]
  let coachSpells: any[]
  let coachesWithSpells = []
  let r
  for (let i = 0; i < 24; i++) {
    r = Math.floor(Math.random() * 690) + 1
    while (playersQuery.indexOf(r) !== -1)
      r = Math.floor(Math.random() * 690) + 1
    playersQuery.push(r)
  }
  for (let i = 2; i <= 9; i++)
    spellsQuery.push(i)
  for (let i = 1; i <= 32; i++)
    coachesQuery.push(i)
  for (let i = 1; i <= 8; i++)
    coachSpellsQuery.push(i)

  players = await getRepository('FootballPlayer').findByIds(playersQuery)
  spells = await getRepository('Spell').findByIds(spellsQuery)
  coaches = await getRepository('Coach').findByIds(coachesQuery)
  coachSpells = await getRepository('CoachSpell').findByIds(coachSpellsQuery)

  for (let i = 0; i < 32; i++) {
    const randCoach = Math.floor(Math.random() * 32)
    const randCoachSpell = Math.floor(Math.random() * 8)
    coachesWithSpells.push({
      idCoach: coaches[randCoach].id,
      idSpell: coachSpells[randCoachSpell].id,
      ...coaches[randCoach],
      ...coachSpells[randCoachSpell],
    })
  }

  return {
    footballPlayers: players,
    spells,
    coaches: coachesWithSpells
  }
}

async function createGame(roomId: string, sockets: string[], nick: string) {
  const game = {
    user1: {
      id: sockets[0],
      nick,
      unplayedCards: {
        footballPlayers: new Array(),
        spells: new Array(),
        coaches: new Array()
      },
      playedCards: new Array(),
      score: 0,
      isPlaying: true
    },
    user2: {
      id: '',
      nick: '',
      unplayedCards: {
        footballPlayers: new Array(),
        spells: new Array(),
        coaches: new Array()
      },
      playedCards: new Array(),
      score: 0,
      isPlaying: true
    },
    roundNo: 1
  }

  await saveGame(roomId, game)
}

async function updateGame(roomId: string, sockets: string[], nick: string) {
  let game: any = await getGame(roomId)
  game.user2.id = sockets[1]
  game.user2.nick = nick
  await saveGame(roomId, game)

  return [
    await chooseRandomCards(),
    await chooseRandomCards()
  ]
}

async function requestGame(io: Server, socket: Socket, nick: string) {
  const roomId = "room-" + roomno
  let room, sockets
  socket.join(roomId);
  room = io.nsps['/'].adapter.rooms[roomId]
  sockets = Object.keys(room.sockets)

  if (room.length == 1) {
    createGame(roomId, sockets, nick)
  } else {
    const cardsToChooseFrom = await updateGame(roomId, sockets, nick)
    io.sockets.in(roomId).sockets[sockets[0]].emit(
      'game-start',
      { roomId, cardsToChooseFrom: cardsToChooseFrom[0] }
    )
    io.sockets.in(roomId).sockets[sockets[1]].emit(
      'game-start',
      { roomId, cardsToChooseFrom: cardsToChooseFrom[1] }
    )
    roomno++;
  }
}

async function chooseCards(io: Server, socket: Socket, data: { roomId: string, cards: any }) {
  let room, sockets, userNo = 'user1', game: any
  room = io.nsps['/'].adapter.rooms[data.roomId]
  sockets = Object.keys(room.sockets)
  if (sockets[1] === socket.id)
    userNo = 'user2'

  // add cards to game state
  game = await getGame(data.roomId)
  game[userNo].unplayedCards = data.cards
  await saveGame(data.roomId, game)

  if (
    game.user1.unplayedCards.footballPlayers.length > 0 &&
    game.user2.unplayedCards.footballPlayers.length > 0
  ) {
    io.sockets.in(data.roomId).emit('round-start');
    io.sockets.in(data.roomId).emit('update-game', game);
    socket.emit('can-move')
  }
}

async function playCard(io: Server, socket: Socket, data: { roomId: string, card: any, cardType: string }) {
  // update the game state
  // emit update-game to both
  // emit can-move to the one who can move
  let room, sockets, userNo = 'user1'
  let game: GameState, newGame: GameState
  let nextSocket: Socket
  room = io.nsps['/'].adapter.rooms[data.roomId]
  sockets = Object.keys(room.sockets)
  if (sockets[1] === socket.id)
    userNo = 'user2'
  game = await getGame(data.roomId)

  if (data.cardType === 'player') {
    newGame = playerCard(game, data.card, userNo)
  } else if (data.cardType === 'spell') {
    newGame = spellCard(game, data.card, userNo)
  } else if (data.cardType === 'coach-spell') {
    newGame = coachSpellCard(game, data.card, userNo)
  }
  await saveGame(data.roomId, newGame)
  io.sockets.in(data.roomId).emit('update-game', newGame);

  // decide who moves next
  if (userNo === 'user1') {
    if (newGame.user2.isPlaying)
      nextSocket = io.sockets.in(data.roomId).sockets[sockets[1]]
    else
      nextSocket = io.sockets.in(data.roomId).sockets[sockets[0]]
  } else {
    if (newGame.user1.isPlaying)
      nextSocket = io.sockets.in(data.roomId).sockets[sockets[0]]
    else
      nextSocket = io.sockets.in(data.roomId).sockets[sockets[1]]
  }

  nextSocket.emit('can-move')
}

function resetGameState(game: GameState) {
  game.user1.isPlaying = true
  game.user2.isPlaying = true

  game.user1.playedCards = []
  game.user2.playedCards = []
  return game
}

function computeScore(user: UserGameState) {
  let score = 0
  for (let card of user.playedCards)
    score += (card.attack + card.defence)
  return score
}

async function stopPlaying(io: Server, socket: Socket, roomId: string) {
  // if it is the first player to stop
  //   emit stop-playing to the other player
  //   emit can-move
  // else
  //   emit round-end
  //   if last round
  //     emit game-end
  //   else
  //     emit round-start
  //     reset game-state
  //     emit update-state
  //     emit can-move randomly

  let room, sockets, userNo = 0
  let game: GameState, newGame: GameState
  room = io.nsps['/'].adapter.rooms[roomId]
  sockets = Object.keys(room.sockets)
  if (sockets[1] === socket.id)
    userNo = 1
  game = await getGame(roomId)
  function endGame() {
    // update score and round number
    const points1 = computeScore(game.user1)
    const points2 = computeScore(game.user2)
    let winner
    if (points1 > points2) {
      winner = game.user1.nick
      game.user1.score++
    } else if (points1 < points2) {
      winner = game.user2.nick
      game.user2.score++
    } else {
      winner = 'no winner'
    }
    io.sockets.in(roomId).emit('round-end', winner)
    game.roundNo++
    if (game.roundNo === 4) {
      const points1 = game.user1.score
      const points2 = game.user2.score
      let winner = game.user1.nick
      if (points1 > points2)
        winner = game.user1.nick
      else if (points1 < points2)
        winner = game.user2.nick

      io.sockets.in(roomId).emit('game-end', winner)
    } else {
      //reset game state
      game = resetGameState(game)
      io.sockets.in(roomId).emit('round-start')
      io.sockets.in(roomId).emit('update-game', game)
      socket.emit('can-move')
    }
  }
  if (userNo === 0) {
    game.user1.isPlaying = false
    if (game.user2.isPlaying === false)
      endGame()
    else {
      io.sockets.in(roomId).sockets[sockets[1]].emit('stop-playing')
      io.sockets.in(roomId).sockets[sockets[1]].emit('can-move')
    }
  } else {
    game.user2.isPlaying = false
    if (game.user1.isPlaying === false)
      endGame()
    else {
      io.sockets.in(roomId).sockets[sockets[0]].emit('stop-playing')
      io.sockets.in(roomId).sockets[sockets[0]].emit('can-move')
    }
  }

  await saveGame(roomId, game)

}

export default function startSocket(io: Server) {
  io.on('connection', function (socket: Socket) {
    socket.on('wanna-play', function (nick: string) { requestGame(io, socket, nick) })
    socket.on('choose-cards', function (data: any) { chooseCards(io, socket, data) })
    socket.on('play-card', function (data: any) { playCard(io, socket, data) })
    socket.on('stop-playing', function (roomId: string) { stopPlaying(io, socket, roomId) })

    socket.on('disconnect', function () {
      console.log('A user disconnected');
    });
  });
}