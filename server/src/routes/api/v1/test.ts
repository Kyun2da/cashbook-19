import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => res.json({ test: 'ok' }));

export default router;
