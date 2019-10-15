import { Router, Request, Response } from 'express';
import { getRepository } from "typeorm";

const router: Router = Router();


router.get('/', (req: Request, res: Response) => {
  const { nick } = req.body
  res.send('Hello, World!');
});

router.get('/:id', async (req: Request, res: Response) => {
  let { id } = req.params
  const footballPlayerRepository = getRepository('FootballPlayer')
  const player = await footballPlayerRepository.findOne(id)
  res.send(player)
});

export default router;