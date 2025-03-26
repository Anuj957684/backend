const { Research, createResearch: createResearchModel } = require("../models/ReserchPaper");


const createResearch = async (req, res) => {
  try {
    const newResearch = await createResearchModel(req.body); 
    res.status(201).json({ success: 201, data: newResearch });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


const getAllResearch = async (req, res) => {
  try {
    const all = await Research.find();
    res.status(200).json({ success: 200, data: all });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


const getResearchById = async (req, res) => {
  try {
    const research = await Research.findById(req.params.id);
    if (!research) {
      return res.status(404).json({ success: false, message: "Research not found" });
    }
    res.status(200).json({ success: 200, data: research });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


const updateResearch = async (req, res) => {
  try {
    const updated = await Research.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Research not found" });
    }
    res.status(200).json({ success: 200, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


const deleteResearch = async (req, res) => {
  try {
    const deleted = await Research.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Research not found" });
    }
    res.status(200).json({ success: 200, message: "Research deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createResearch,
  getAllResearch,
  getResearchById,
  updateResearch,
  deleteResearch,
};
