import { Document } from 'mongoose';

export class MockModel<T> {
  constructor(private mockData: T) {}
  save = jest.fn().mockResolvedValue(this.mockData);
  remove = jest.fn().mockResolvedValue(this.mockData);

  static create = jest
    .fn()
    .mockImplementation((doc: Document) => new MockModel(doc));
  static findOne = jest.fn().mockImplementation((doc: Document) => {
    if (doc) {
      return new MockModel(doc);
    } else {
      return null;
    }
  });
  static find = jest.fn().mockImplementation((doc: Document) => {
    if (doc) {
      return new MockModel(doc);
    } else {
      return null;
    }
  });
}
