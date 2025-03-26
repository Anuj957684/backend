const express = require("express");
const router = express.Router();
const {
  createResearch,
  getAllResearch,
  getResearchById,
  updateResearch,
  deleteResearch,
} = require("../controllers/research");

router.post("/research", createResearch);          
router.get("/getresearch", getAllResearch);          
router.get("/getresearchid/:id", getResearchById);       
router.put("/updateresearch/:id", updateResearch);        
router.delete("/deleteresearch/:id", deleteResearch);     

module.exports = router;
