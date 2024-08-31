import { SetMetadata } from '@nestjs/common';

export const DAPR_SUBSCRIBE = 'DAPR_SUBSCRIBE';
export const Subscribe = (topic: string) => SetMetadata(DAPR_SUBSCRIBE, topic);
