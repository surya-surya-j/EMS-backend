import User from "../models/User.js";
import Employee from "../models/Employee.js";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import Department from "../models/DepartmentModel.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
const addEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      employeeId,
      dob,
      gender,
      maritalstatus,
      designation,
      department,
      salary,
      password,
      role,
    } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      return res.json({
        success: false,
        error: "User Already Registered",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await new User({
      name,
      email,
      password: hashPassword,
      role,
      profileImage: req.file ? req.file.filename : "",
    });
    console.log(newUser, "newuser");
    const saveUser = await newUser.save();

    const departmentId = await Department.findOne({ dep_name: department });

    if (!departmentId) {
      return res.json({
        success: false,
        error: "Department not Exusts",
      });
    }

    const { _id } = departmentId;

    const newEmployee = await new Employee({
      userId: saveUser._id,
      employeeId,
      dob,
      gender,
      maritalstatus,
      designation,
      department: _id,
      salary,
    });

    await newEmployee.save();
    console.log(newEmployee, "new");

    return res.status(200).json({
      success: true,
      message: "employee created",
    });
  } catch (error) {
    console.log(error);
    return error.status(500).json({
      success: false,
      error: "server error in adding employee",
    });
  }
};

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("userId", { password: 0 })
      .populate("department");
    return res.status(200).json({
      success: true,
      employees,
    });
  } catch (error) {
    return error.status(500).json({
      success: false,
      error: "get employees server error",
    });
  }
};

const getEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    let employee;
    employee = await Employee.findById({ _id: id })
      .populate("userId", { password: 0 })
      .populate("department");
    if (!employee) {
      employee = await Employee.findOne({ userId: id })
        .populate("userId", { password: 0 })
        .populate("department");
    }

    return res.status(200).json({
      success: true,
      employee,
    });
  } catch (error) {
    return error.status(500).json({
      success: false,
      error: "get employee server error",
    });
  }
};

//   try {
//     const { id } = req.params;
//     const { name, maritalstatus, designation, department, salary } = req.body;

//     const employee = await Employee.findById({ _id: id });
//     if (!employee) {
//       return error.status(404).json({
//         success: false,
//         error: "Employee Not found",
//       });
//     }
//     const user = await User.findById({ _id: employee.userId });
//     if (!user) {
//       return error.status(404).json({
//         success: false,
//         error: "user Not found",
//       });
//     }
//     const updatUser = await User.findByIdAndUpdate(
//       { _id: employee.userId },
//       { name }
//     );
//     console.log(updatUser);

//     const updateEmployee = await Employee.findByIdAndUpdate(
//       { _id: id },
//       { maritalstatus, designation, salary,department }
//     );
//     console.log(updateEmployee);
//     if (!updatUser && !updateEmployee) {
//       return error.status(500).json({
//         success: false,
//         error: "Document Not Found",
//       });
//     }
//     return res.status(200).json({
//       success: true,
//       message: "Employee Updated",
//     });
//   } catch (error) {
//     return error.status(500).json({
//       success: false,
//       error: "Employee Not updated",
//     });
//   }
// };

const editEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, maritalstatus, designation, department, salary } = req.body;

    // Find the employee by ID
    const employee = await Employee.findById({ _id: id });
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee not found",
      });
    }

    // Find the user by userId associated with the employee
    const user = await User.findById({ _id: employee.userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // If department is a name (like 'IT'), find its ObjectId
    const departmentObj = await Department.findOne({ dep_name: department });
    if (!departmentObj) {
      return res.status(404).json({
        success: false,
        error: "Department not found",
      });
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      { _id: employee.userId },
      { name },
      { new: true } // This option ensures the updated document is returned
    );
    console.log(updatedUser);

    // Update the employee with the ObjectId of the department
    const updatedEmployee = await Employee.findByIdAndUpdate(
      { _id: id },
      { maritalstatus, designation, salary, department: departmentObj._id },
      { new: true } // This option ensures the updated document is returned
    );
    console.log(updatedEmployee);

    if (!updatedUser || !updatedEmployee) {
      return res.status(500).json({
        success: false,
        error: "Failed to update the user or employee",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: {
        user: updatedUser,
        employee: updatedEmployee,
      },
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({
      success: false,
      error: "An error occurred while updating the employee",
      details: error.message, // Optionally include more error details
    });
  }
};

const fetchEmployeesByDepId = async (req, res) => {
  const { id } = req.params; // Here, 'id' is the department name (like "IT")
  console.log(id);

  try {
    // Step 1: Find the department by its name (like "IT")
    const department = await Department.findOne({ dep_name: id });
    if (!department) {
      return res.status(404).json({
        success: false,
        error: "Department not found",
      });
    }

    // Step 2: Use the department's ObjectId to find employees
    const employees = await Employee.find({ department: department._id });

    return res.status(200).json({
      success: true,
      employees,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({
      success: false,
      error: "Server error while fetching employees by department",
    });
  }
};

export {
  addEmployee,
  upload,
  getEmployees,
  getEmployee,
  editEmployee,
  fetchEmployeesByDepId,
};
