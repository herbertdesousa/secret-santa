import { Router } from 'express';

import StartGameService from '../services/StartGameService';

const gameRouter = Router();

gameRouter.post('/', async (request, response) => {
  const { name } = request.body;

  const startGameService = new StartGameService();

  const newGame = await startGameService.execute({
    name,
  });

  return response.json(newGame);
});

export default gameRouter;
