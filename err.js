module.exports = res => (code, error, log) => {
  res.status(code).json({ error });
  if (log) console.log(`[ERROR]\n${log}\n[/ERROR]`);
};
