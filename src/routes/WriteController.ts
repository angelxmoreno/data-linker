import express, { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import multer from 'multer';
import { ValidationException } from '@exceptions/ValidationException';
import DocumentData from '@validation/DocumentData';
import DocumentDataWithContents from '@validation/DocumentDataWithContents';
import DocumentDataWithFile from '@validation/DocumentDataWithFiles';
import s3Service from '@services/cloud-storage/S3Service';
import { DocumentEntity } from '@database/entities/DocumentEntity';

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

const process = async (data: DocumentData, res: Response, next: NextFunction) => {
    try {
        await data.validateOrReject();
        const document = data.toDocumentEntity();
        await s3Service.uploadDocument(document as DocumentEntity);
        await document.save();

        return res.json(document);
    } catch (error) {
        if (Array.isArray(error)) {
            next(new ValidationException(error));
        } else {
            next(error);
        }
    }
};

const writeContents = async (req: Request, res: Response, next: NextFunction) => {
    const data = DocumentDataWithContents.fromRequest(req);
    await process(data, res, next);
};

const writeFile = async (req: Request, res: Response, next: NextFunction) => {
    const data = DocumentDataWithFile.fromRequest(req);
    await process(data, res, next);
};

router.post('/write/contents', passport.authenticate('headerapikey', { session: false }), writeContents);

router.post('/write/file', passport.authenticate('headerapikey', { session: false }), upload.single('file'), writeFile);

export { router as WriteController };
