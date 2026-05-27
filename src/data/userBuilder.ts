import { NewUserInput } from '../pages/admin/AddUserPage';
import { uniqueSuffix } from './identifiers';

export function aNewUser(overrides: Partial<NewUserInput> = {}): NewUserInput {
  const suffix = uniqueSuffix();
  return {
    userRole: 'ESS',
    employeeName: 'a',
    status: 'Enabled',
    username: `qa_user_${suffix}`,
    password: 'P@ssword123!',
    ...overrides,
  };
}
