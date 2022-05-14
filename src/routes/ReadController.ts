import express, { Request, RequestHandler } from 'express';
import { DocumentEntity } from '@database/entities/DocumentEntity';
import asyncWrapper from '@utils/asyncWrapper';
import s3Service from '@services/cloud-storage/S3Service';
import { onlyAuthenticated } from '@auth/index';
import { UserRole } from '@database/entities/UserEntity';

const router = express.Router();
router.use(onlyAuthenticated(UserRole.CONSUMER));

const listDistinctClassifications: RequestHandler = async req => {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = 100;
    return DocumentEntity.getPaginatedDistinctField<DocumentEntity>('classification', page, limit);
};

const listClassificationsForSubjectId: RequestHandler = async req => {
    const subjectId = req.params.subjectId;
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = 100;
    return DocumentEntity.getPaginatedDistinctField<DocumentEntity>('classification', page, limit, { subjectId });
};

const listSubjects: RequestHandler = async (req: Request) => {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = 100;
    return DocumentEntity.getPaginatedDistinctField<DocumentEntity>('subjectId', page, limit);
};

const getSubject: RequestHandler = (req: Request) => {
    const subjectId = req.params.subjectId;
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = 100;
    return DocumentEntity.findPaginated<DocumentEntity>(page, {
        take: limit,
        where: { subjectId },
    });
};

const downloadDocument: RequestHandler = async (req: Request, res, next) => {
    try {
        const id = req.params.documentId;
        const document = await DocumentEntity.findOneByOrFail({ id });
        const { data: object } = await s3Service.getDocument(document);
        res.attachment(document.fileName);
        res.send(object.Body);
    } catch (error) {
        next(error);
    }
};

router.get('/classifications', asyncWrapper(listDistinctClassifications));
router.get('/classifications/:subjectId', asyncWrapper(listClassificationsForSubjectId));
router.get('/subjects', asyncWrapper(listSubjects));
router.get('/subjects/:subjectId', asyncWrapper(getSubject));
router.get('/download/:documentId', downloadDocument);

export { router as ReadController };
