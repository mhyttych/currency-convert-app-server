const express = require('express');
const { convert, getInitialData } = require("../controllers/convert");

const router = express.Router();

router.post("/", convert )
router.post("/initial", getInitialData )

module.exports = router;