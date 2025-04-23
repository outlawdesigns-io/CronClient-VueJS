import MessageRepository from './MessageRepository';

const repositories = {
  message:MessageRepository
};

export const RepositoryFactory = {
  get: name => repositories[name]
}
