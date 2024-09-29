export function mockEvent(value) {
  return { preventDefault: jest.fn(), target: { value } };
}

export function mockSignal(value) {
  return { value, peek: () => value };
}
