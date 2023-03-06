const express = require('express')
const router = express.Router()
const {getContact,getContacts,createContact,updateContact,deleteContact,bulkCreateContacts} = require("../controllers/contactController")
const validateToken = require('../middleware/validateTokenHandler')


router.use(validateToken)
router.route("/").get(getContacts).post(createContact)

router.route("/bulkCreate").post(bulkCreateContacts)

router.route("/:id").get(getContact).put(updateContact).delete(deleteContact)

module.exports = router