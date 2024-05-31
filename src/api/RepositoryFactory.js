import ExecutionRepository from './ExecutionRepository';
import JobRepository from './JobRepository';
import AuthorizationRepository from './AuthRepository';
import MessageRepository from './MessageRepository';

const repositories = {
  executions: ExecutionRepository,
  jobs: JobRepository,
  authorization:AuthorizationRepository,
  message:MessageRepository
};

export const RepositoryFactory = {
  get: name => repositories[name]
}
