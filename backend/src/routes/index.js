const router = require('express').Router();

const baseApi = '/api';

router.use(baseApi, require('./todos'));

module.exports = router;
