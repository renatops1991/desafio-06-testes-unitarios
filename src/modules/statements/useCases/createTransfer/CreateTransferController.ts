import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTransferUseCase } from "./CreateTransferUseCase";

enum OperationType {
  TRANSFER = "transfer",
}

export class CreateTransferController {
  async execute(request: Request, response: Response) {
    const { id: user_id } = request.user;
    const { sender_id } = request.params;
    const { amount, description } = request.body;

    const type = OperationType.TRANSFER;

    const createTransfer = container.resolve(CreateTransferUseCase);
    const transfer = await createTransfer.execute({
      user_id,
      sender_id,
      type,
      amount,
      description,
    });

    return response.status(201).json(transfer);
  }
}
