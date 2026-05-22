import { Op, WhereOptions } from 'sequelize';
import { Inquiry, InteractionLog } from '../models/index.js';
import { sendAnswerEmail } from '../utils/mailer.js';
import { AppError } from '../errors/AppError.js';

type CreateInquiryPayload = {
  requesterName: string;
  requesterEmail: string;
  question: string;
  sessionId?: string;
  attachment?: Express.Multer.File;
};

type ListInquiryFilters = {
  status?: string;
  search?: string;
};

type AnswerInquiryPayload = {
  inquiryId: number;
  answerText: string;
  answeredBy?: number;
};

export class InquiryService {
  async createInquiry(payload: CreateInquiryPayload) {
    const inquiry = await Inquiry.create({
      requesterName: payload.requesterName,
      requesterEmail: payload.requesterEmail,
      question: payload.question,
      attachmentName: payload.attachment?.originalname,
      attachmentMime: payload.attachment?.mimetype,
      attachmentData: payload.attachment?.buffer,
    });

    if (payload.sessionId) {
      await InteractionLog.update(
        { inquiryId: inquiry.id },
        { where: { sessionId: payload.sessionId } }
      );
    }

    return {
      id: inquiry.id,
      message: 'Dúvida enviada! Aguarde o retorno da secretaria.',
    };
  }

  async listInquiries(filters: ListInquiryFilters) {
    const where: WhereOptions = {};

    if (filters.status && filters.status !== 'TODAS') {
      Object.assign(where, { status: filters.status });
    }

    if (filters.search) {
      Object.assign(where, {
        [Op.or]: [
          { requesterName: { [Op.iLike]: `%${filters.search}%` } },
          { requesterEmail: { [Op.iLike]: `%${filters.search}%` } },
          { question: { [Op.iLike]: `%${filters.search}%` } },
        ],
      });
    }

    return Inquiry.findAll({
      where,
      attributes: { exclude: ['attachmentData'] },
      order: [['createdAt', 'DESC']],
    });
  }

  async getAttachment(id: number) {
    const inquiry = await Inquiry.findByPk(id);

    if (!inquiry || !inquiry.attachmentData) {
      throw new AppError('Anexo não encontrado', 404);
    }

    return {
      data: inquiry.attachmentData,
      mime: inquiry.attachmentMime || 'application/octet-stream',
      name: inquiry.attachmentName || 'anexo',
    };
  }

  async answerInquiry(payload: AnswerInquiryPayload) {
    const [count] = await Inquiry.update(
      {
        answerText: payload.answerText,
        status: 'RESPONDIDA',
        answeredBy: payload.answeredBy,
      },
      { where: { id: payload.inquiryId } }
    );

    if (count === 0) {
      throw new AppError('Dúvida não encontrada', 404);
    }

    const inquiry = await Inquiry.findByPk(payload.inquiryId);

    if (inquiry) {
      sendAnswerEmail(
        inquiry.requesterEmail,
        inquiry.requesterName,
        inquiry.question,
        payload.answerText
      ).catch(err => {
        console.error('Falha não-crítica ao enviar email.', err);
      });
    }

    return { message: 'Dúvida respondida e e-mail enviado' };
  }
}
