import Department from "../models/DepartmentModel.js";

const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    return res.status(200).json({
      success: true,
      departments,
    });
  } catch (error) {
    return error.status(500).json({
      success: false,
      error: "get department server error",
    });
  }
};

const addDepartment = async (req, res) => {
  try {
    const { dep_name, description } = req.body;
    const newDep = new Department({
      dep_name,
      description,
    });
    await newDep.save();

    return res.status(200).json({
      success: true,
      department: newDep,
    });
  } catch (error) {
    return error.status(500).json({
      success: false,
      error: "add department server error",
    });
  }
};

const getDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById({ _id: id });
    return res.status(200).json({
      success: true,
      department: department,
    });
  } catch (error) {
    return error.status(500).json({
      success: false,
      error: "get department server error",
    });
  }
};

const editDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { dep_name, description } = req.body;

    const updateDep = await Department.findByIdAndUpdate(
      { _id: id },
      {
        dep_name,
        description,
      }
    );
    return res.status(200).json({
      success: true,
      department: updateDep,
    });
  } catch (error) {
    return json({
      success: false,
      error: "edit department server error",
    });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteDep = await Department.findById({ _id: id });
       await deleteDep.deleteOne()
    return res.status(200).json({
      success: true,
      department: deleteDep,
    });
  } catch (error) {
    return json({
      success: false,
      error: "delete department server error",
    });
  }
};
export {
  addDepartment,
  getDepartments,
  getDepartment,
  editDepartment,
  deleteDepartment,
};
