import { getRepository } from 'typeorm';
import User from '../models/User';
import Game from '../models/Game';

import AppError from '../errors/AppError';

interface Request {
  name: string;
}

class StartGameService {
  public async execute({ name }: Request) {
    const usersRepository = getRepository(User);
    const gameRepository = getRepository(Game);

    const allUsers = await usersRepository.find();

    if (allUsers.length <= 2) {
      throw new AppError('no users enough', 401);
    }

    const allGameUsers = await gameRepository.find();

    const existingGameUser = allGameUsers.find(
      gameUser => gameUser.name === name,
    );

    if (existingGameUser) {
      return existingGameUser;
    }

    const allUsersSuported = allUsers.filter(user => user.name !== name);

    if (allGameUsers.length === 0) {
      const randomPosition = Math.floor(
        Math.random() * allUsersSuported.length,
      );

      const newUser = gameRepository.create({
        name,
        giftTo: allUsersSuported[randomPosition].name,
      });

      await gameRepository.save(newUser);

      return newUser;
    }

    const allSuported = allUsersSuported
      .map(user => {
        const [result] = allGameUsers.map(gameUser => {
          return gameUser.giftTo !== user.name && user;
        });

        return result;
      })
      .filter(val => val !== false);

    const randomPosition = Math.floor(Math.random() * allSuported.length);

    const newUser = gameRepository.create({
      name,
      giftTo: allSuported[randomPosition].name,
    });

    await gameRepository.save(newUser);

    return newUser;
  }
}

export default StartGameService;
