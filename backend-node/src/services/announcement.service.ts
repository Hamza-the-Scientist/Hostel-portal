import { AppDataSource } from '../config/database';
import { Announcement } from '../entities/Announcement';
import { LessThanOrEqual, MoreThan, IsNull } from 'typeorm';

export class AnnouncementService {
  private announcementRepo = AppDataSource.getRepository(Announcement);

  async getPublicAnnouncements() {
    const announcements = await this.announcementRepo.find({
      where: {
        isPublished: true,
      },
      order: { publishedAt: 'DESC' },
    });

    const now = new Date();
    return announcements
      .filter((a) => !a.expiresAt || a.expiresAt > now)
      .map((a) => ({
        announcementId: a.announcementId,
        title: a.title,
        content: a.content,
        publishedAt: a.publishedAt ? a.publishedAt.toISOString() : a.createdAt.toISOString(),
      }));
  }

  async getAllAnnouncements() {
    const announcements = await this.announcementRepo.find({
      order: { createdAt: 'DESC' },
    });

    return announcements.map((a) => ({
      announcementId: a.announcementId,
      adminId: a.adminId,
      title: a.title,
      content: a.content,
      isPublished: a.isPublished,
      publishedAt: a.publishedAt,
      expiresAt: a.expiresAt,
      targetAudience: a.targetAudience,
      createdAt: a.createdAt,
    }));
  }

  async createAnnouncement(adminId: number, body: { title: string; content: string; isPublished?: boolean }) {
    const isPublished = body.isPublished !== undefined ? body.isPublished : true;
    const announcement = this.announcementRepo.create({
      adminId,
      title: body.title,
      content: body.content,
      isPublished: isPublished,
      publishedAt: isPublished ? new Date() : undefined,
    });

    await this.announcementRepo.save(announcement);
    return announcement;
  }

  async updateAnnouncement(id: number, body: { title?: string; content?: string; isPublished?: boolean }) {
    const announcement = await this.announcementRepo.findOne({ where: { announcementId: id } });
    if (!announcement) {
      throw { status: 404, message: 'Announcement not found' };
    }

    if (body.title !== undefined) announcement.title = body.title;
    if (body.content !== undefined) announcement.content = body.content;
    if (body.isPublished !== undefined) announcement.isPublished = body.isPublished;

    await this.announcementRepo.save(announcement);
    return announcement;
  }

  async deleteAnnouncement(id: number) {
    const announcement = await this.announcementRepo.findOne({ where: { announcementId: id } });
    if (!announcement) {
      throw { status: 404, message: 'Announcement not found' };
    }

    await this.announcementRepo.remove(announcement);
    return { message: 'Announcement deleted successfully' };
  }
}
