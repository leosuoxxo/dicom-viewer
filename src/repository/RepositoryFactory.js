import { OrganizationRepository } from './OrganizationRepository';

export const RepositoryName = {
  Organization: 'Organization',
};

export const RepositoryFactory = {
  [RepositoryName.Organization]: OrganizationRepository,
};
