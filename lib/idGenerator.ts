import { v4 } from 'uuid';

export function idGenerator(): string {
  return v4();
}
