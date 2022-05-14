import { NextFunction, Request, Response } from 'express';

const asyncWrapper = asyncRouteHandler => {
    return function routeHandler(req: Request, res: Response, next: NextFunction) {
        return asyncRouteHandler(req, res, next)
            .then(result => res.json(result))
            .catch(next);
    };
};

export default asyncWrapper;
