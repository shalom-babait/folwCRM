const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 4200;

app.use(express.static(path.join(__dirname, 'dist/ssd')));

// תיקון לנתיב catch-all ב־Express חדש
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/ssd/index.html'));
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
