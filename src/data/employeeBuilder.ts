import { NewEmployeeInput } from '../pages/pim/AddEmployeePage';
import { uniqueSuffix } from './identifiers';

export function aNewEmployee(overrides: Partial<NewEmployeeInput> = {}): NewEmployeeInput {
  const suffix = uniqueSuffix();
  return {
    firstName: 'QA',
    lastName: `Auto_${suffix}`,
    ...overrides,
  };
}
