import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MessageService } from './message.service';
// import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('message')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @ApiOperation({ summary: 'Create message' })
  async create() {
    return await this.messageService.create();
  }

  @Get()
  @ApiOperation({ summary: 'Get message' })
  findAll() {
    return this.messageService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get message by Id' })
  findOne(@Param('id') id: string) {
    return this.messageService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update message by Id' })
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(+id, updateMessageDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete message by Id' })
  remove(@Param('id') id: string) {
    return this.messageService.remove(+id);
  }
}
