import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateUserUseCase } from './CreateUserUseCase';

export class CreateUserController {
  async execute(request: Request, response: Response) {
    const { name, email, password } = request.body;

    const createUser = container.resolve(CreateUserUseCase);

   const createdUser =  await createUser.execute({
      name,
      email,
      password
    });

    delete(createdUser.password);

    return response.status(201).json(createdUser);
  }
}
