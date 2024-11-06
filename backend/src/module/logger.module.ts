// src/common/logger/logger.module.ts

import { Module, Global } from '@nestjs/common';
import { CustomLogger } from 'src/service/logger.service';

@Global()
@Module({
  providers: [CustomLogger],
  exports: [CustomLogger],
})
export class LoggerModule {}