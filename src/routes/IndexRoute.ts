import express, { Request, Response } from 'express';

const router = express.Router();

const health = (req: Request, res: Response) => {
    return res.json({
        site: 'up',
    });
};

router.get('/', health);

export { router as IndexRouter };
