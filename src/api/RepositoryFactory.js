import ExecutionRepository from './ExecutionRepository';
import JobRepository from './JobRepository';
import AuthorizationRepository from './AuthRepository';

const repositories = {
  executions: ExecutionRepository,
  jobs: JobRepository,
  authorization:AuthorizationRepository
};

export const RepositoryFactory = {
  get: name => repositories[name]
}
