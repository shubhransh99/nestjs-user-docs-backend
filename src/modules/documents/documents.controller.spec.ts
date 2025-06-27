import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { NotFoundException } from '@nestjs/common';

describe('DocumentsController', () => {
  let controller: DocumentsController;
  const mockDocumentsService = {
    createDocument: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    updateDocument: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [
        { provide: DocumentsService, useValue: mockDocumentsService },
      ],
    }).compile();

    controller = module.get<DocumentsController>(DocumentsController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should upload document', async () => {
    const file = {
      filename: 'abc.pdf',
      mimetype: 'application/pdf',
    } as Express.Multer.File;
    const body = { title: 'Doc1', description: 'desc' };
    const req = { user: { user_id: 1 } };
    const mockResult = { id: 1 };
    mockDocumentsService.createDocument.mockResolvedValue(mockResult);

    const result = await controller.uploadDocument(file, body, req);
    expect(result).toEqual(mockResult);
  });

  it('should get all documents', async () => {
    const mockData = [{ title: 'doc' }];
    mockDocumentsService.findAll.mockResolvedValue(mockData);

    const result = await controller.getAll({});
    expect(result).toEqual(mockData);
  });

  it('should get one document', async () => {
    const doc = { document_id: 1 };
    mockDocumentsService.findById.mockResolvedValue(doc);

    const result = await controller.getOne(1);
    expect(result).toEqual(doc);
  });

  it('should throw if document not found in getOne', async () => {
    mockDocumentsService.findById.mockResolvedValue(null);
    await expect(controller.getOne(1)).rejects.toThrow(NotFoundException);
  });

  it('should update a document', async () => {
    mockDocumentsService.updateDocument.mockResolvedValue('updated');

    const result = await controller.update(1, { title: 'new' });
    expect(result).toBe('updated');
  });

  it('should delete a document', async () => {
    mockDocumentsService.softDelete.mockResolvedValue({ message: 'ok' });

    const result = await controller.remove(1);
    expect(result).toEqual({ message: 'ok' });
  });
});
