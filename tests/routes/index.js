var express = require('express');
var ex01 = require('../controllers/ex01');
var ex02 = require('../controllers/ex02');

var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

/* POST Ex-01 */
router.post('/ex01', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(
    JSON.stringify(ex01(req.body.input))
  );
});

/* POST Ex-02 */
router.post('/ex02', async (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(
    JSON.stringify(await ex02())
  );
});

module.exports = router;
