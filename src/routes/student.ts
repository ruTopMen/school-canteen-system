import express from 'express';
import { getDB } from '../database';
import { verifyToken, checkRole, AuthRequest } from '../middleware';

const router = express.Router();

// Получить меню
router.get('/menu', verifyToken, async (req, res) => {
  const db = getDB();
  const menu = await db.all('SELECT * FROM menu WHERE available_qty > 0');
  res.json(menu);
});

// Купить еду (Разово или Абонемент)
router.post('/buy', verifyToken, checkRole(['student']), async (req: AuthRequest, res) => {
  const { menu_item_id, type } = req.body; // type: 'single' or 'subscription'
  const user_id = req.user?.id;
  const db = getDB();

  // Простая транзакция: уменьшить количество еды, создать заказ
  try {
    const item = await db.get('SELECT * FROM menu WHERE id = ?', [menu_item_id]);
    if (!item || item.available_qty < 1) {
      return res.status(400).json({ message: 'Item not available' });
    }

    await db.run('UPDATE menu SET available_qty = available_qty - 1 WHERE id = ?', [menu_item_id]);
    
    await db.run(
      `INSERT INTO orders (user_id, menu_item_id, type, date) VALUES (?, ?, ?, datetime('now'))`,
      [user_id, menu_item_id, type]
    );

    res.json({ message: 'Purchase successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing order' });
  }
});

// Отметка о получении питания (Студент нажимает "Я получил еду" или показывает QR код повару)
router.post('/redeem/:orderId', verifyToken, checkRole(['student']), async (req: AuthRequest, res) => {
  const db = getDB();
  const { orderId } = req.params;
  
  const order = await db.get('SELECT * FROM orders WHERE id = ? AND user_id = ?', [orderId, req.user?.id]);
  
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.status === 'received') return res.status(400).json({ message: 'Already received' });

  await db.run('UPDATE orders SET status = "received" WHERE id = ?', [orderId]);
  res.json({ message: 'Bon appetit!' });
});

// ... (предыдущий код файла) ...

// Оставить отзыв о блюде
router.post('/reviews', verifyToken, checkRole(['student']), async (req: AuthRequest, res) => {
  const { menu_item_id, rating, comment } = req.body;
  const user_id = req.user?.id;
  const db = getDB();

  // Проверка, что оценка от 1 до 5
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    await db.run(
      `INSERT INTO reviews (user_id, menu_item_id, rating, comment, date) VALUES (?, ?, ?, ?, datetime('now'))`,
      [user_id, menu_item_id, rating, comment]
    );
    res.json({ message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding review' });
  }
});

// Посмотреть отзывы конкретного блюда
router.get('/reviews/:menuId', verifyToken, async (req, res) => {
  const { menuId } = req.params;
  const db = getDB();

  const reviews = await db.all(`
    SELECT r.id, r.rating, r.comment, r.date, u.username 
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.menu_item_id = ?
    ORDER BY r.date DESC
  `, [menuId]);

  res.json(reviews);
});

export default router;

