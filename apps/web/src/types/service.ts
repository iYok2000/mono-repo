import type { ReactNode } from 'react';

export type PropType = 'string' | 'number' | 'boolean' | 'array' | 'object';

export interface PropSchema {
  key: string;
  type: PropType;
  required: boolean;
  validate?: (value: unknown) => boolean;
}

export interface Dependency {
  name: string;
  version: string;
  type: 'runtime' | 'dev';
}

export type ServiceProps = Record<string, unknown>;

export interface CodePanel {
  id: string;
  label: string;
  language: 'typescript' | 'tsx' | 'json';
  generate: (props: ServiceProps) => string;
}

export abstract class BaseService<TProps extends ServiceProps = ServiceProps> {
  abstract readonly id: string;
  abstract readonly slug: string;
  abstract readonly name: string;
  abstract readonly description: string;

  abstract readonly defaultProps: TProps;
  abstract readonly propsSchema: PropSchema[];

  abstract renderPreview(props: TProps): ReactNode;

  abstract getCodePanels(): CodePanel[];

  abstract renderControls(
    props: TProps,
    onChange: (newProps: TProps) => void
  ): ReactNode;

  abstract getHowToUse(): string;

  abstract readonly dependencies: Dependency[];
  abstract readonly lastUpdated: string;

  validateProps(props: ServiceProps): TProps {
    const validated: Record<string, unknown> = {};

    for (const field of this.propsSchema) {
      const value = props[field.key];

      if (field.required && (value === undefined || value === null)) {
        console.warn(`Missing required field: ${field.key}`);
        validated[field.key] = (this.defaultProps as ServiceProps)[field.key];
        continue;
      }

      if (field.validate && value !== undefined && !field.validate(value)) {
        console.warn(`Validation failed for field: ${field.key}`);
        validated[field.key] = (this.defaultProps as ServiceProps)[field.key];
        continue;
      }

      validated[field.key] = value ?? (this.defaultProps as ServiceProps)[field.key];
    }

    return validated as TProps;
  }
}
