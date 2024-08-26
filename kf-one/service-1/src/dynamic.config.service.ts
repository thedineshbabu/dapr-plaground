import { Injectable } from '@nestjs/common';

@Injectable()
export class DynamicConfigService {
  private configStore: Record<string, any> = {}; // A simple key-value store

  // Method to update configuration
  updateConfig(key: string, value: any) {
    this.configStore[key] = value;
  }

  // Method to retrieve configuration dynamically
  getConfig(key: string): any {
    return this.configStore[key];
  }
}
