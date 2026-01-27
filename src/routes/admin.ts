import express from 'express';
import { getDB } from '../database';
import { verifyToken, checkRole } from '../middleware';

const router = express.Router();

// Статистика (сколько денег заработано, сколько порций продано)
router.get('/stats', verifyToken, checkRole(['admin']), async (req, res) => {
  const db = getDB();
  
  const totalSales = await db.get(`
    SELECT COUNT(*) as total_orders, SUM(m.price) as total_revenue 
    FROM orders o 
    JOIN menu m ON o.menu_item_id = m.id
  `);
  
  res.json(totalSales);
});

// Просмотр заявок на закупку
router.get('/requests', verifyToken, checkRole(['admin']), async (req, res) => {
  const db = getDB();
  const requests = await db.all('SELECT * FROM procurement_requests WHERE status = "pending"');
  res.json(requests);
});

// Одобрение заявки
router.put('/requests/:id/approve', verifyToken, checkRole(['admin']), async (req, res) => {
  const db = getDB();
  await db.run('UPDATE procurement_requests SET status = "approved" WHERE id = ?', [req.params.id]);
  res.json({ message: 'Request approved' });
});

// --- НОВАЯ ФУНКЦИЯ: ОТЧЕТ О БЛЮДАХ ---

// Детальный отчет: какое блюдо сколько раз купили и сколько оно принесло денег
router.get('/dishes-report', verifyToken, checkRole(['admin']), async (req, res) => {
  const db = getDB();
  const report = await db.all(`
    SELECT 
      m.name AS dish_name, 
      COUNT(o.id) AS quantity_sold, 
      SUM(m.price) AS total_revenue
    FROM orders o
    JOIN menu m ON o.menu_item_id = m.id
    GROUP BY m.id
    ORDER BY quantity_sold DESC
  `);
  res.json(report);
});

export default router;