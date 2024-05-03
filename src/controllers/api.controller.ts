import { Router } from 'express';
import Paths from '../constants/paths';
import dataVerificationRouter from './dataVerification.controller';
import authRouter from './auth.controller';

const apiRouter = Router();

apiRouter.use(Paths.Verify.Base, dataVerificationRouter);

apiRouter.use(Paths.Auth.Base, authRouter);

export default apiRouter;
