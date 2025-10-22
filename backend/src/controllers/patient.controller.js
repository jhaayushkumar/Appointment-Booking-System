const getHello = (req, res) => {
  res.json({ message: "Hello from Controller" });
};

module.exports = { getHello };
