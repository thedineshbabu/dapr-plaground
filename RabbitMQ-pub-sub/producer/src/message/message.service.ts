import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import axios from 'axios';

@Injectable()
export class MessageService {
  DAPR_HOST = process.env.DAPR_HOST || 'http://localhost';
  DAPR_HTTP_PORT = process.env.DAPR_HTTP_PORT || '3500';
  PUBSUB_NAME = 'orderpubsub';
  PUBSUB_TOPIC = 'orders';

  randomNum() {
    return Math.floor(Math.random() * 1000);
  }

  async create() {
    const message = {
      data: 'this is a message' + this.randomNum(),
      metadata: {
        source: 'message-service',
        type: 'message',
      },
    };
    await axios.post(
      `${this.DAPR_HOST}:${this.DAPR_HTTP_PORT}/v1.0/publish/${this.PUBSUB_NAME}/${this.PUBSUB_TOPIC}`,
      message,
    );
    return message;
  }

  findAll() {
    return `This action returns all message`;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
