const categoryModel = require("../../models/categoryModel");
const { imageUpload } = require("../../utils/uploadImage");

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.files.image;

    const existedCategory = await categoryModel.findOne({
      name: { $regex: new RegExp(`^${name}`, "i") },
    });

    if (existedCategory) {
      res.status(409).json({ message: "Category already existed" });
      return;
    }

    const uploadedImage = await imageUpload(image);

    const newCategory = new categoryModel({
      name,
      image: uploadedImage,
    });

    await newCategory.save();
    res.status(200).json({ message: `${name} category created` });
  } catch (error) {
    console.log(error);
  }
};

const changeCategoryImage = async (req, res) => {
  try {
    const { id } = req.body;
    const image = req.files?.image;

    if (!image) {
      res.status(400).json({ error: true });
      return;
    }

    const profileImage = await imageUpload(image);
    await categoryModel.findByIdAndUpdate(id, { image: profileImage });
    res.status(200).json({ message: "image uploaded" });
  } catch (error) {
    console.log(error);
  }
};

const editCategoryName = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const existedCategory = await categoryModel.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (existedCategory) {
      res.status(409).json({ message: "Category already existed" });
      return;
    }

    await categoryModel.findByIdAndUpdate(id, { name });
    res.status(200).json({ message: "category name updated" });
  } catch (error) {
    console.log(error);
  }
};

const getAllCategory = async (req, res) => {
  try {
    let search = req.query.search || "";
    const query = {
      $or: [{ name: { $regex: new RegExp(`^${search}`, "i") } }],
    };

    const categories = await categoryModel.find(query);
    res.status(200).json({ categories });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createCategory,
  getAllCategory,
  changeCategoryImage,
  editCategoryName,
};
