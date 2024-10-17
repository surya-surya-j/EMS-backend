import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";

const addLeave = async (req, res) => {
  try {
    const { userId, leaveType, startDate, endDate, reason } = req.body;
    const employee = await Employee.findOne({ userId });
    console.log(userId);

    const newLeave = await new Leave({
      employeeId: employee._id,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    await newLeave.save();

    return res.status(200).json({
      success: true,
      error: false,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Leave and Server Error",
      success: false,
    });
  }
};

const getLeave = async (req, res) => {
  try {
    const { id, role } = req.params;
    console.log(role, "role");
     
    let leaves;

    if (role === "admin") {
      leaves = await Leave.find({ employeeId: id });
    } else {
      const employee = await Employee.findOne({ userId: id });
      leaves = await Leave.find({ employeeId: employee._id });
      console.log(leaves, "leaves");
    }

    return res.status(200).json({
      success: true,
      leaves,
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      error: "Leave and Server Error",
      success: false,
    });
  }
};

const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate({
      path: "employeeId",
      populate: [
        {
          path: "department",
          select: "dep_name",
        },
        {
          path: "userId",
          select: "name",
        },
      ],
    });

    return res.status(200).json({
      success: true,
      leaves,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Leave and Server Error",
      success: false,
    });
  }
};

const getLeaveDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const leave = await Leave.findById({ _id: id }).populate({
      path: "employeeId",
      populate: [
        {
          path: "department",
          select: "dep_name",
        },
        {
          path: "userId",
          select: "name profileImage",
        },
      ],
    });

    return res.status(200).json({
      success: true,
      leave,
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      error: "Leave and Server Error",
      success: false,
    });
  }
};

const updateLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const leave = await Leave.findByIdAndUpdate(
      { _id: id },
      { status: req.body.status }
    );
    console.log(leave, "leave");

    if (!leave) {
      return res.status(404).json({
        success: false,
        error: "leave not found",
      });
    }
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Leave and Server Error",
      success: false,
    });
  }
};
export { addLeave, getLeaves, getLeave, getLeaveDetail, updateLeave };
