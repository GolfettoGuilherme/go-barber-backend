import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import User from '../models/User';
import uploadConfig from '../config/upload';

interface Request {
  userId: string;
  avatarFileName: string;
}
class UpdateUserAvatarService {
  public async execute({ userId, avatarFileName }: Request): Promise<User> {
    const userRepo = getRepository(User);

    const user = await userRepo.findOne(userId);

    if (!user) throw new Error('User not exists');

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExist = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExist) await fs.promises.unlink(userAvatarFilePath);
    }
    user.avatar = avatarFileName;

    await userRepo.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
