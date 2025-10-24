const express = require("express");
const app = express();
app.use(express.json());

// In-memory cards collection
let cards = [
  { id: 1, suit: "Hearts", value: "Ace" },
  { id: 2, suit: "Diamonds", value: "King" },
  { id: 3, suit: "Spades", value: "Queen" },
  { id: 4, suit: "Clubs", value: "Jack" }
];

// GET all cards
app.get("/cards", (req, res) => {
  res.status(200).json(cards);
});

// GET card by ID
app.get("/cards/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const card = cards.find(c => c.id === id);
  if (!card) return res.status(404).json({ message: "Card not found" });
  res.status(200).json(card);
});

// POST add a new card
app.post("/cards", (req, res) => {
  const { suit, value } = req.body;
  if (!suit || !value) {
    return res.status(400).json({ message: "Suit and value are required" });
  }
  // generate new id (simple approach)
  const newId = cards.length ? Math.max(...cards.map(c => c.id)) + 1 : 1;
  const newCard = { id: newId, suit, value };
  cards.push(newCard);
  res.status(201).json(newCard);
});

// DELETE card by ID
app.delete("/cards/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = cards.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ message: "Card not found" });
  const removed = cards.splice(index, 1)[0];
  res.status(200).json({ message: `Card with ID ${id} removed`, card: removed });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
