const express = require("express");
const router = express.Router();
const requestController = require("../controllers/sampleRequestController");
const authenticateToken = require("../middleware/authmiddleware"); // Adjust the path


router.post("/", requestController.createRequest);
router.get("/", requestController.getAllRequests);
router.get("/:id", requestController.getRequestById);
router.put("/:id", requestController.updateRequest);
router.delete("/:id", requestController.deleteRequest);
router.put('/:id/accept', authenticateToken, requestController.acceptRequestById);


module.exports = router;
