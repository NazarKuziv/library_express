var express = require('express');
var router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));



router.get('', async (req, res) => {
   res.clearCookie("app-auth");
   res.clearCookie("app-auth.sig");
   res.redirect('/borrowing');
})




module.exports = router