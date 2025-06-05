import prisma from '../../lib/prisma';
import { getAuth } from '@clerk/nextjs/server';

export default async function handler(req, res) {
  const { userId } = getAuth(req);
  
  if (req.method === 'GET') {
    const { remote, search } = req.query;
    let filters = {};

    if (remote) filters.remote = remote === 'true';
    if (search) {
      filters.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ];
    }

    const jobs = await prisma.job.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json(jobs);
  }

  if (req.method === 'POST') {
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const { title, description, company, location, remote, salary, isPaid } = req.body;

    const job = await prisma.job.create({
      data: {
        title,
        description,
        company,
        location,
        remote,
        salary,
        isPaid,
        postedById: userId,
      },
    });

    return res.status(201).json(job);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
