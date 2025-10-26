const greet = (req, res) => {
  res.json({ message: "Hello from Admin" });
};

module.exports = {greet};
