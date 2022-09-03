const router = require('express').Router();
const { store, index, destroy, update, getDetail } = require('../controller/userController');
const { uploadSingle } = require('../midleware/uploadImage');

router.post('/', uploadSingle('picture', 'users'), store)
router.get('/', index)
router.get('/:id', getDetail)
router.delete('/:id', destroy);
router.patch('/:id', uploadSingle('picture', 'users'), update);

module.exports = router;
