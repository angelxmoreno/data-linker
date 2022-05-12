import express, { Request, Response } from 'express';
import passport from 'passport';

const router = express.Router();

const health = (req: Request, res: Response) => {
    return res.json({
        site: 'up',
    });
};

const identify = (req: Request, res: Response) => {
    return res.json({
        identified: !!req.user,
        user: req.user,
    });
};

router.get('/', health);
router.get('/me', identify);
router.get('/app', passport.authenticate('headerapikey', { session: false }), identify);

export { router as IndexRouter };
