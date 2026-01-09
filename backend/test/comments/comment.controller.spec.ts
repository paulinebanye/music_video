import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from '../comment.controller';
import { CommentService } from '../comment.service';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { CommentEntity } from '../comment.entity';

describe('CommentController', () => {
  let controller: CommentController;
  let service: jest.Mocked<CommentService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        {
          provide: CommentService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CommentController>(CommentController);
    service = module.get(CommentService) as jest.Mocked<CommentService>;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('create', () => {
    it('should delegate to the service and return the created comment', async () => {
      const dto: CreateCommentDto = {
        message: 'New comment',
        username: 'alice',
        userId: 'user-1',
        imageUrl: 'https://example.com/avatar.png',
        time: Date.now(),
        emojies: [
          {
            name: 'like',
            emoji: '👍',
            count: 1,
          },
        ],
        richUiData: {
          blocks: [
            {
              key: 'block-1',
              text: 'Hello world',
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

      const createdComment = {
        id: 'comment-1',
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      } as CommentEntity;

      service.create.mockResolvedValue(createdComment);

      await expect(controller.create(dto)).resolves.toBe(createdComment);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });
});
