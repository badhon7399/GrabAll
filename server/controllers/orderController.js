const Order = require('../models/Order');
const { sendMail } = require('../utils/email');

// Create new order
exports.addOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    const createdOrder = await order.save();
    // Compose products list for email
    const productLines = createdOrder.orderItems.map(item =>
      `<li>${item.name} (Qty: ${item.qty})</li>`
    ).join('');
    // Send email to admin after order creation
    await sendMail({
      to: process.env.ADMIN_EMAIL,
      subject: `New Order: ${createdOrder._id}`,
      html: `<h2>New Order Placed</h2>
        <p><b>Order ID:</b> ${createdOrder._id}</p>
        <p><b>Mobile Number:</b> ${createdOrder.paymentMobile || '-'}</p>
        <p><b>TrxID:</b> ${createdOrder.paymentTrxId || '-'}</p>
        <p><b>Products:</b></p>
        <ul>${productLines}</ul>
        <p><b>Total Price:</b> ${createdOrder.totalPrice}</p>
        <a href="${process.env.ADMIN_ORDERS_URL || 'http://localhost:3000/admin/orders'}">View Orders</a>`
    });
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get orders for a user
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status and notify user if needed
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await Order.findById(orderId).populate('user', 'email name');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = status;
    await order.save();
    // Send shipment/cancel email to user (fix: populate user if not already)
    const populatedOrder = order.user && order.user.email ? order : await order.populate('user', 'email name');
    // Compose product names for email
    const productNames = (populatedOrder.orderItems || []).map(item => item.name).join(', ');
    if (status === 'Shipped') {
      console.log('Sending shipped email to:', populatedOrder.user.email);
      await sendMail({
        to: populatedOrder.user.email,
        subject: `Your order has shipped!`,
        html: `<p>Hi ${populatedOrder.user.name || ''},</p>
<p>Great news! Your order for <b>${productNames}</b> has been shipped and is on its way to you.</p>
<p><i>Estimated delivery date: [Please check your account for updates]</i></p>
<p>If you have any questions or need assistance, please reply to this email or contact our support team.</p>
<p>Thank you for shopping with us! We hope you enjoy your purchase.</p>`
      }).catch(err => {
        console.error('Error sending shipped email:', err);
      });
    } else if (status === 'Cancelled' || status === 'Canceled') {
      console.log('Sending cancelled email to:', populatedOrder.user.email);
      await sendMail({
        to: populatedOrder.user.email,
        subject: `Order Cancelled`,
        html: `<p>Hi ${populatedOrder.user.name || ''},</p>
<p>We regret to inform you that your order for <b>${productNames}</b> has been cancelled.</p>
<p>A full refund will be processed to your original payment method within 3-5 business days.</p>
<p>We apologize for any inconvenience this may have caused. If you have any questions or need further assistance, please let us know.</p>
<p>Thank you for choosing our store. We hope to serve you again in the future.</p>`
      }).catch(err => {
        console.error('Error sending cancelled email:', err);
      });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
