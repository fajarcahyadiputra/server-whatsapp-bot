const router = require('express').Router();
const { store, index, destroy, update, getDetail } = require('../controller/whatsappReplyController');
const { uploadSingle } = require('../midleware/uploadImage');

router.post('/', uploadSingle('media', 'whatsappReply'), store)
router.get('/', index)
router.get('/:id', getDetail)
router.delete('/:id', destroy);
router.patch('/:id', update);

module.exports = router;
