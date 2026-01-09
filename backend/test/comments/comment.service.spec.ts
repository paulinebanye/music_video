import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentService } from '../../src/comments/comment.service';
import { CommentEntity } from '../../src/comments/comment.entity';
import { CreateCommentDto } from '../../src/comments/dto/create-comment.dto';

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
