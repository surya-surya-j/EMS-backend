import Salary from "../models/Salary.js";
import Employee from "../models/Employee.js";

const addSalary = async (req, res) => {
  try {
    const { employeeId, basicSalary, allowances, deductions, payDate } =
      req.body;

    const totalSalary =
      parseInt(basicSalary) + parseInt(allowances) - parseInt(deductions);

    const newSalary = await new Salary({
      employeeId,
      basicSalary,
      allowances,
      deductions,
      netSalary: totalSalary,
      payDate,
    });

    await newSalary.save();

    return res.status(200).json({
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
    });
  }
};

const getSalary = async (req, res) => {
  try {
    const { id, role } = req.params;
    let salary;

    if (role === "admin") {
      salary = await Salary.find({ employeeId: id }).populate(
        "employeeId",
        "employeeId"
      );
    } else {
      const employee = await Employee.findOne({ userId: id });
      salary = await Salary.find({ employeeId: employee._id }).populate(
        "employeeId",
        "employeeId"
      );
    }
    console.log(salary, "salary");
    return res.status(200).json({
      success: true,
      salary,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
    });
  }
};

// const getSalary = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Find the employee by userId first
//     const employee = await Employee.findOne({ userId: id });

//     if (!employee) {
//       return res.status(404).json({
//         success: false,
//         message: "Employee not found",
//       });
//     }

//     // Find the salary based on the employee's _id
//     const salary = await Salary.findOne({ employeeId: employee._id });
//     console.log(salary, "salary");
//     if (!salary) {
//       return res.status(404).json({
//         success: false,
//         message: "Salary not found for this employee",
//       });
//     }

//     // Merging the employee data with the salary data
//     const salarydata = {
//       ...employee._doc, // Use _doc to extract the employee object without extra mongoose metadata
//       salary: {
//         basicSalary: salary.basicSalary,
//         allowances: salary.allowances,
//         deductions: salary.deductions,
//         netSalary: salary.netSalary,
//         payDate: salary.payDate,
//       },
//     };

//     // Return the merged response
//     return res.status(200).json({
//       success: true,
//       salarydata,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       error: error.message,
//       success: false,
//     });
//   }
// };

export { addSalary, getSalary };
