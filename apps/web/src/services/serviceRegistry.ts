import type { BaseService } from '@/types/service';

class ServiceRegistry {
  private services: Map<string, BaseService> = new Map();

  initialize(services: BaseService[]): void {
    this.services.clear();

    for (const service of services) {
      if (!this.isValidSlug(service.slug)) {
        console.error(`Invalid slug for service: ${service.slug}`);
        continue;
      }

      if (this.services.has(service.slug)) {
        console.warn(`Duplicate service slug: ${service.slug}`);
        continue;
      }

      this.services.set(service.slug, service);
    }
  }

  getServiceBySlug(slug: string): BaseService | null {
    if (!this.isValidSlug(slug)) {
      return null;
    }

    return this.services.get(slug) ?? null;
  }

  getAllServices(): BaseService[] {
    return Array.from(this.services.values());
  }

  private isValidSlug(slug: string): boolean {
    if (typeof slug !== 'string' || slug.length === 0 || slug.length > 50) {
      return false;
    }

    return /^[a-z0-9-]+$/.test(slug);
  }
}

export const serviceRegistry = new ServiceRegistry();

export const initializeServices = (services: BaseService[]): void => {
  serviceRegistry.initialize(services);
};

export const getServiceBySlug = (slug: string): BaseService | null => {
  return serviceRegistry.getServiceBySlug(slug);
};

export const getAllServices = (): BaseService[] => {
  return serviceRegistry.getAllServices();
};
