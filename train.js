const express = require("express");
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Seats in-memory
let seats = {
  A1: { status: "available", lockedBy: null, lockExpires: null },
  A2: { status: "available", lockedBy: null, lockExpires: null },
  A3: { status: "available", lockedBy: null, lockExpires: null },
  A4: { status: "available", lockedBy: null, lockExpires: null },
  A5: { status: "available", lockedBy: null, lockExpires: null },
};

// Lock duration in milliseconds
const LOCK_DURATION = 60 * 1000; // 1 minute

// Utility to clean expired locks
function cleanExpiredLocks() {
  const now = Date.now();
  for (const seatId in seats) {
    if (seats[seatId].status === "locked" && seats[seatId].lockExpires <= now) {
      seats[seatId] = { status: "available", lockedBy: null, lockExpires: null };
      console.log(`Seat ${seatId} lock expired and is now available`);
    }
  }
}

// Run cleanup every 5 seconds
setInterval(cleanExpiredLocks, 5000);

// GET all seats
app.get("/seats", (req, res) => {
  const statusMap = {};
  for (const seatId in seats) {
    statusMap[seatId] = seats[seatId].status;
  }
  res.status(200).json(statusMap);
});

// POST lock a seat
app.post("/seats/:id/lock", (req, res) => {
  const seatId = req.params.id.toUpperCase();
  const user = req.body.user;

  if (!seats[seatId]) return res.status(404).json({ error: `Seat ${seatId} does not exist` });
  if (!user) return res.status(400).json({ error: "User is required to lock a seat" });

  const seat = seats[seatId];

  // Check if seat is booked
  if (seat.status === "booked") return res.status(400).json({ error: `Seat ${seatId} is already booked` });

  // Check if seat is locked
  if (seat.status === "locked") return res.status(400).json({ error: `Seat ${seatId} is already locked by ${seat.lockedBy}` });

  // Lock the seat
  seat.status = "locked";
  seat.lockedBy = user;
  seat.lockExpires = Date.now() + LOCK_DURATION;

  res.status(200).json({
    message: `Seat ${seatId} locked successfully`,
    seat: seatId,
    lockedBy: user,
    expiresIn: LOCK_DURATION / 1000 + " seconds",
  });
});

// POST confirm booking
app.post("/seats/:id/confirm", (req, res) => {
  const seatId = req.params.id.toUpperCase();
  const user = req.body.user;

  if (!seats[seatId]) return res.status(404).json({ error: `Seat ${seatId} does not exist` });
  if (!user) return res.status(400).json({ error: "User is required to confirm a seat" });

  const seat = seats[seatId];

  // Check if seat is booked
  if (seat.status === "booked") return res.status(400).json({ error: `Seat ${seatId} is already booked` });

  // Check if seat is locked by this user
  if (seat.status !== "locked" || seat.lockedBy !== user) {
    return res.status(400).json({ error: `Cannot confirm Seat ${seatId} – it is locked by another user or not locked` });
  }

  // Confirm booking
  seat.status = "booked";
  seat.lockedBy = null;
  seat.lockExpires = null;

  res.status(200).json({
    message: `Seat ${seatId} booked successfully`,
    seat: seatId,
    bookedBy: user,
  });
});

// DELETE /seats/:id – optional: reset seat (for testing)
app.delete("/seats/:id", (req, res) => {
  const seatId = req.params.id.toUpperCase();
  if (!seats[seatId]) return res.status(404).json({ error: `Seat ${seatId} does not exist` });

  seats[seatId] = { status: "available", lockedBy: null, lockExpires: null };
  res.status(200).json({ message: `Seat ${seatId} reset to available` });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
