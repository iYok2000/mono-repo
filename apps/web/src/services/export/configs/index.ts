import { ExportType } from '../types';
import type { ExportConfig, ExportTypeDataMap } from '../types';
import { vocDetailsConfig } from './vocDetailsConfig';

class ExportConfigRegistry {
  private configs: Map<ExportType, ExportConfig> = new Map();

  constructor() {
    this.register(vocDetailsConfig);
  }

  register(config: ExportConfig<any>): void {
    this.configs.set(config.type, config);
  }

  get<T extends ExportType>(type: T): ExportConfig<ExportTypeDataMap[T]> {
    const config = this.configs.get(type);
    if (!config) {
      throw new Error(`Export configuration not found for type: ${type}`);
    }
    return config as ExportConfig<ExportTypeDataMap[T]>;
  }
}

export const exportConfigRegistry = new ExportConfigRegistry();
export { vocDetailsConfig } from './vocDetailsConfig';
