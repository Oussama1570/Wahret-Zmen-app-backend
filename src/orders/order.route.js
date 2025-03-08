const express = require("express");
const router = express.Router();
const Order = require("./order.model");

// Define the route for getting all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find(); // Fetch all orders from the database
    res.status(200).json(orders); // Send the list of orders
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// Define the route for getting orders by email
router.get("/email/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const orders = await Order.find({ email }); // Find orders by email
    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this email" });
    }
    res.status(200).json(orders); // Send the found orders
  } catch (err) {
    console.error("Error fetching orders by email:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// Define the route for creating an order
router.post("/", async (req, res) => {
  const newOrder = req.body;
  try {
    const order = new Order(newOrder); // Create a new order
    await order.save(); // Save the order to the database
    res.status(201).json(order); // Return the created order
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(400).json({ message: "Bad request", error: err });
  }
});

// Define the route for updating an order
router.patch("/:id", async (req, res) => {
  const { isPaid, isDelivered, completionPercentage } = req.body;

  try {
    // Find the order by ID and update the relevant fields
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { isPaid, isDelivered, completionPercentage } },
      { new: true } // Return the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Return the updated order after successfully updating it
    res.status(200).json(updatedOrder);
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ message: "Failed to update order", error: err.message });
  }
});

// Define the route for deleting an order
router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id); // Delete the order by ID
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({ message: "Failed to delete order", error: err.message });
  }
});

module.exports = router;