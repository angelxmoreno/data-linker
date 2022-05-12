import express, { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { DocumentEntity } from '@database/entities/DocumentEntity';
import { validateOrReject, ValidationError } from 'class-validator';
import { ValidationException } from '../exceptions/ValidationException';
import multer from 'multer';
import { MissingSubjectData } from '../exceptions/MissingSubjectDataException';

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

const write = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const file = req.file;
        const content = req.body.content;
        if (!file && !content) {
            throw new MissingSubjectData();
        }
        const body = req.body;
        (' v');
        const document = DocumentEntity.build<DocumentEntity>({
            ...body,
            publisherId: req.user.id,
        });
        await validateOrReject(document);
        return res.json({
            identified: !!req.user,
            user: req.user,
            file: req.file,
            body,
            document,
        });
    } catch (error) {
        if (Array.isArray(error)) {
            next(new ValidationException(error));
        } else {
            next(error);
        }
    }
};

router.post('/write', passport.authenticate('headerapikey', { session: false }), upload.single('file'), write);

export { router as WriteController };
