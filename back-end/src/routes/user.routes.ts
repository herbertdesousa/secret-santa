import { Router } from 'express';

import CreateUserService from '../services/CreateUserService';

const instructorRouter = Router();

instructorRouter.post('/', async (request, response) => {
  const { name } = request.body;

  const createInstructorService = new CreateUserService();

  const newInstructor = await createInstructorService.execute({
    name,
  });

  return response.json(newInstructor);
});

export default instructorRouter;
