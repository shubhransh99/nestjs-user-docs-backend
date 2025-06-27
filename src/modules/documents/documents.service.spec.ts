import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service';
import { getModelToken } from '@nestjs/sequelize';
import { Document } from 'src/entities/document.entity';
import { User } from 'src/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('DocumentsService', () => {
  let service: DocumentsService;

  const mockDocumentModel = {
    create: jest.fn(),
    findOne: jest.fn(),
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
  };

  const mockUserModel = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        { provide: getModelToken(Document), useValue: mockDocumentModel },
        { provide: getModelToken(User), useValue: mockUserModel },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create and save a document', async () => {
    const mockFile = {
      filename: 'file.pdf',
      mimetype: 'application/pdf',
    } as Express.Multer.File;
    const dto = { title: 'Doc1', description: 'Sample' };
    const saveMock = jest.fn().mockResolvedValue('saved-doc');
    mockDocumentModel.create.mockImplementation(() => new mockDocumentModel());
    const newDocInstance = {
      save: saveMock,
      title: '',
      description: '',
      file_url: '',
      file_type: '',
      created_by: null,
    };
    jest.spyOn(mockDocumentModel, 'create').mockReturnValue(newDocInstance);

    const result = await service.createDocument(mockFile, dto, 1);

    expect(result).toBe('saved-doc');
    expect(saveMock).toHaveBeenCalled();
  });

  it('should return document by ID', async () => {
    const doc = { document_id: 1, title: 'Test' };
    mockDocumentModel.findOne.mockResolvedValue(doc);

    const result = await service.findById(1);
    expect(result).toBe(doc);
    expect(mockDocumentModel.findOne).toHaveBeenCalledWith({
      where: { document_id: 1 },
    });
  });

  it('should return paginated documents', async () => {
    mockDocumentModel.findAndCountAll.mockResolvedValue({
      rows: ['doc1', 'doc2'],
      count: 2,
    });

    const result = await service.findAll({ page: 1, limit: 1 });
    expect(result.data).toEqual(['doc1', 'doc2']);
    expect(result.total).toBe(2);
  });

  it('should update a document', async () => {
    const updateMock = jest.fn().mockResolvedValue('updated');
    const doc = { update: updateMock };
    mockDocumentModel.findByPk.mockResolvedValue(doc);

    const result = await service.updateDocument(1, { title: 'Updated' });
    expect(result).toBe('updated');
  });

  it('should throw if updating missing doc', async () => {
    mockDocumentModel.findByPk.mockResolvedValue(null);
    await expect(
      service.updateDocument(1, { title: 'Updated' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should soft delete a document', async () => {
    const destroyMock = jest.fn();
    const doc = { destroy: destroyMock };
    mockDocumentModel.findByPk.mockResolvedValue(doc);

    const result = await service.softDelete(1);
    expect(result).toEqual({ message: 'Document deleted successfully' });
    expect(destroyMock).toHaveBeenCalled();
  });

  it('should throw if deleting missing doc', async () => {
    mockDocumentModel.findByPk.mockResolvedValue(null);
    await expect(service.softDelete(1)).rejects.toThrow(NotFoundException);
  });
});
