import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentService } from '../../src/comments/comment.service';
import { CommentEntity } from '../../src/comments/comment.entity';
import { CreateCommentDto } from '../../src/comments/dto/create-comment.dto';
import { UpdateCommentDto } from '../../src/comments/dto/update-comment.dto';

const mockComment = {
  id: 'comment-id',
  message: 'Hello world',
  username: 'john_doe',
  userId: 'user-123',
  imageUrl: 'https://example.com/avatar.png',
  time: 1700000000000,
  emojies: [
    {
      name: 'smile',
      emoji: '😄',
      count: 3,
    },
  ],
  richUiData: {
    blocks: [
      {
        key: 'block-1',
        text: 'Sample rich text',
        type: 'paragraph',
        depth: 0,
        data: {},
        entityRanges: [],
        inlineStyleRanges: [],
      },
    ],
    entityMap: {},
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
} as CommentEntity;

describe('CommentService.create', () => {
  let service: CommentService;
  let repository: jest.Mocked<Repository<CommentEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getRepositoryToken(CommentEntity),
          useValue: {
            create: jest.fn().mockReturnValue(mockComment),
            save: jest.fn().mockResolvedValue(mockComment),
          },
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    repository = module.get(getRepositoryToken(CommentEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a comment with all fields populated', async () => {
    const dto: CreateCommentDto = {
      message: 'Hello world',
      username: 'john_doe',
      userId: 'user-123',
      imageUrl: 'https://example.com/avatar.png',
      time: 1700000000000,
      emojies: [
        {
          name: 'smile',
          emoji: '😄',
          count: 3,
        },
      ],
      richUiData: {
        blocks: [
          {
            key: 'block-1',
            text: 'Sample rich text',
            type: 'paragraph',
            depth: 0,
            data: {},
            entityRanges: [],
            inlineStyleRanges: [],
          },
        ],
        entityMap: {},
      },
    };

    const result = await service.create(dto);

    expect(repository.create).toHaveBeenCalledWith({
      message: dto.message,
      username: dto.username,
      userId: dto.userId,
      imageUrl: dto.imageUrl,
      time: dto.time,
      emojies: dto.emojies,
      richUiData: dto.richUiData,
    });

    expect(repository.save).toHaveBeenCalledWith(mockComment);
    expect(result).toBe(mockComment);
  });

  it('should default optional fields when omitted', async () => {
    (repository.create as jest.Mock).mockImplementation((payload) => ({
      ...mockComment,
      ...payload,
    }));

    const dto: CreateCommentDto = {
      message: 'Text only',
    };

    await service.create(dto);

    expect(repository.create).toHaveBeenCalledWith({
      message: dto.message,
      username: null,
      userId: null,
      imageUrl: null,
      time: null,
      emojies: [],
      richUiData: null,
    });
  });

  it('should propagate errors from repository.save', async () => {
    const dto: CreateCommentDto = {
      message: 'This will fail',
    };

    const error = new Error('Database failure');
    repository.save.mockRejectedValue(error);

    await expect(service.create(dto)).rejects.toThrow(error);
  });
});

describe('CommentService.update', () => {
  let service: CommentService;
  let repository: jest.Mocked<Repository<CommentEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getRepositoryToken(CommentEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue({ ...mockComment }),
            save: jest.fn().mockImplementation((entity) => Promise.resolve(entity)),
          },
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    repository = module.get(getRepositoryToken(CommentEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update only provided fields', async () => {
    const dto: UpdateCommentDto = {
      message: 'Updated message',
      emojies: [
        {
          name: 'laugh',
          emoji: '😂',
          count: 5,
        },
      ],
    };

    const result = await service.update(mockComment.id, dto);

    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: mockComment.id } });
    expect(result.message).toBe(dto.message);
    expect(result.emojies).toEqual(dto.emojies);
    expect(result.username).toBe(mockComment.username);
    expect(result.richUiData).toEqual(mockComment.richUiData);
    expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
      id: mockComment.id,
      message: dto.message,
      emojies: dto.emojies,
    }));
  });

  it('should map richUiData when provided', async () => {
    const dto: UpdateCommentDto = {
      richUiData: {
        blocks: [
          {
            key: 'block-2',
            text: 'Changed block',
            type: 'paragraph',
            depth: 0,
            data: {},
            entityRanges: [],
            inlineStyleRanges: [],
          },
        ],
        entityMap: {},
      },
    };

    const result = await service.update(mockComment.id, dto);

    expect(result.richUiData).toEqual(dto.richUiData);
    expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
      richUiData: dto.richUiData,
    }));
  });

  it('should throw NotFoundException when comment does not exist', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(service.update('missing-id', {})).rejects.toThrow('Comment with id "missing-id" not found');
  });

  it('should propagate errors from repository.save', async () => {
    const error = new Error('Update failed');
    repository.save.mockRejectedValue(error);

    await expect(service.update(mockComment.id, { message: 'fail' })).rejects.toThrow(error);
  });
});

describe('CommentService.findAll', () => {
  let service: CommentService;
  let repository: jest.Mocked<Repository<CommentEntity>>;

  const commentA = { ...mockComment };
  const commentB = { ...mockComment, id: 'second', message: 'Second comment' } as CommentEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getRepositoryToken(CommentEntity),
          useValue: {
            findAndCount: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    repository = module.get(getRepositoryToken(CommentEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return paginated comments with metadata', async () => {
    repository.findAndCount.mockResolvedValue([[commentA, commentB], 5]);

    const result = await service.findAll({ page: 1, limit: 2 });

    expect(repository.findAndCount).toHaveBeenCalledWith({
      where: {},
      take: 2,
      skip: 0,
      order: { createdAt: 'DESC' },
    });

    expect(result.data).toEqual([commentA, commentB]);
    expect(result.meta).toEqual({
      page: 1,
      limit: 2,
      totalItems: 5,
      totalPages: 3,
    });
  });

  it('should filter by userId when provided', async () => {
    repository.findAndCount.mockResolvedValue([[commentA], 1]);

    await service.findAll({ page: 1, limit: 20, userId: 'user-123' });

    expect(repository.findAndCount).toHaveBeenCalledWith({
      where: { userId: 'user-123' },
      take: 20,
      skip: 0,
      order: { createdAt: 'DESC' },
    });
  });

  it('should filter by username when provided', async () => {
    repository.findAndCount.mockResolvedValue([[commentA], 1]);

    await service.findAll({ page: 1, limit: 20, username: 'john_doe' });

    expect(repository.findAndCount).toHaveBeenCalledWith({
      where: { username: 'john_doe' },
      take: 20,
      skip: 0,
      order: { createdAt: 'DESC' },
    });
  });

  it('should honour sorting parameters', async () => {
    repository.findAndCount.mockResolvedValue([[commentA], 1]);

    await service.findAll({ page: 1, limit: 20, sortBy: 'createdAt', order: 'ASC' });

    expect(repository.findAndCount).toHaveBeenCalledWith({
      where: {},
      take: 20,
      skip: 0,
      order: { createdAt: 'ASC' },
    });
  });

  it('should handle empty result sets', async () => {
    repository.findAndCount.mockResolvedValue([[], 0]);

    const result = await service.findAll({ page: 1, limit: 20 });

    expect(result.data).toEqual([]);
    expect(result.meta).toEqual({
      page: 1,
      limit: 20,
      totalItems: 0,
      totalPages: 0,
    });
  });

  it('should propagate repository errors', async () => {
    const error = new Error('query failed');
    repository.findAndCount.mockRejectedValue(error);

    await expect(service.findAll({ page: 1, limit: 20 })).rejects.toThrow(error);
  });
});
