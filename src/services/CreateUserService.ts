import { getRepository } from 'typeorm';
import User from '../models/User';

import AppError from '../errors/AppError';

interface Request {
  name: string;
}

class CreateUserService {
  public async execute({ name }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const userDuplicated = await usersRepository.findOne({
      where: { name },
    });

    if (userDuplicated != null) {
      throw new AppError('name already exists', 401);
    }

    if (name === '' || name === undefined) {
      throw new AppError('name required', 401);
    }

    const newUser = usersRepository.create({
      name,
    });

    await usersRepository.save(newUser);

    return newUser;
  }
}

export default CreateUserService;
