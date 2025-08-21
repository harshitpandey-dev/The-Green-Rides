const Fine = require("../models/Fine");
const User = require("../models/User");
const Rental = require("../models/Rental");

exports.getAllFines = async () => {
  try {
    const fines = await Fine.find()
      .populate("student", "name rollNumber email")
      .populate("cycle", "cycleId")
      .populate("rental", "startTime endTime")
      .sort({ createdAt: -1 });

    return fines.map((fine) => ({
      id: fine._id,
      roll_no: fine.student?.rollNumber,
      student_name: fine.student?.name,
      fine_amount: fine.amount,
      reason: fine.reason,
      fine_date: fine.createdAt,
      due_date: fine.dueDate,
      status: fine.status,
      rental_id: fine.rental?._id,
      cycle_id: fine.cycle?.cycleId,
      fine_type: fine.fineType,
      days_overdue: fine.daysOverdue,
      payment_date: fine.paymentDate,
      payment_method: fine.paymentMethod,
      damage_description: fine.description,
    }));
  } catch (error) {
    throw new Error(`Error fetching fines: ${error.message}`);
  }
};

exports.getFineById = async (fineId) => {
  try {
    const fine = await Fine.findById(fineId)
      .populate("student", "name rollNumber email")
      .populate("cycle", "cycleId")
      .populate("rental", "startTime endTime");

    if (!fine) {
      throw new Error("Fine not found");
    }

    return {
      id: fine._id,
      roll_no: fine.student?.rollNumber,
      student_name: fine.student?.name,
      fine_amount: fine.amount,
      reason: fine.reason,
      fine_date: fine.createdAt,
      due_date: fine.dueDate,
      status: fine.status,
      rental_id: fine.rental?._id,
      cycle_id: fine.cycle?.cycleId,
      fine_type: fine.fineType,
      days_overdue: fine.daysOverdue,
      payment_date: fine.paymentDate,
      payment_method: fine.paymentMethod,
      damage_description: fine.description,
    };
  } catch (error) {
    throw new Error(`Error fetching fine: ${error.message}`);
  }
};

exports.createFine = async (fineData) => {
  try {
    const fine = new Fine({
      student: fineData.studentId,
      rental: fineData.rentalId,
      cycle: fineData.cycleId,
      amount: fineData.amount,
      reason: fineData.reason,
      fineType: fineData.fineType,
      dueDate: fineData.dueDate,
      description: fineData.description,
      daysOverdue: fineData.daysOverdue,
      issuedBy: fineData.issuedBy,
    });

    await fine.save();
    return await this.getFineById(fine._id);
  } catch (error) {
    throw new Error(`Error creating fine: ${error.message}`);
  }
};

exports.updateFine = async (fineId, updateData) => {
  try {
    const fine = await Fine.findByIdAndUpdate(fineId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!fine) {
      throw new Error("Fine not found");
    }

    return await this.getFineById(fine._id);
  } catch (error) {
    throw new Error(`Error updating fine: ${error.message}`);
  }
};

exports.collectFine = async (fineId, paymentData) => {
  try {
    const fine = await Fine.findByIdAndUpdate(
      fineId,
      {
        status: "paid",
        paymentDate: new Date(),
        paymentMethod: paymentData.paymentMethod || "cash",
        collectedBy: paymentData.collectedBy,
      },
      { new: true }
    );

    if (!fine) {
      throw new Error("Fine not found");
    }

    return await this.getFineById(fine._id);
  } catch (error) {
    throw new Error(`Error collecting fine: ${error.message}`);
  }
};

exports.getFinesByRollNumber = async (rollNumber) => {
  try {
    const student = await User.findOne({
      rollNumber: rollNumber.toUpperCase(),
    });

    if (!student) {
      throw new Error("Student not found");
    }

    const fines = await Fine.find({ student: student._id })
      .populate("cycle", "cycleId")
      .populate("rental", "startTime endTime")
      .sort({ createdAt: -1 });

    const fineData = fines.map((fine) => ({
      id: fine._id,
      roll_no: rollNumber.toUpperCase(),
      student_name: student.name,
      fine_amount: fine.amount,
      reason: fine.reason,
      fine_date: fine.createdAt,
      due_date: fine.dueDate,
      status: fine.status,
      rental_id: fine.rental?._id,
      cycle_id: fine.cycle?.cycleId,
      fine_type: fine.fineType,
      days_overdue: fine.daysOverdue,
      payment_date: fine.paymentDate,
      payment_method: fine.paymentMethod,
      damage_description: fine.description,
    }));

    const totalFine = fines.reduce((sum, fine) => sum + fine.amount, 0);
    const pendingAmount = fines
      .filter((fine) => fine.status !== "paid")
      .reduce((sum, fine) => sum + fine.amount, 0);
    const paidAmount = fines
      .filter((fine) => fine.status === "paid")
      .reduce((sum, fine) => sum + fine.amount, 0);

    return {
      student: {
        roll_no: rollNumber.toUpperCase(),
        name: student.name,
        email: student.email,
      },
      summary: {
        total_fines: fines.length,
        total_amount: totalFine,
        pending_amount: pendingAmount,
        paid_amount: paidAmount,
      },
      fines: fineData,
    };
  } catch (error) {
    throw new Error(`Error fetching student fines: ${error.message}`);
  }
};

exports.getFinanceDashboard = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalFines, pendingFines, paidFines, overdueFines, todayCollection] =
      await Promise.all([
        Fine.countDocuments(),
        Fine.aggregate([
          { $match: { status: "pending" } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        Fine.aggregate([
          { $match: { status: "paid" } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        Fine.countDocuments({ status: "overdue" }),
        Fine.aggregate([
          {
            $match: {
              status: "paid",
              paymentDate: { $gte: today, $lt: tomorrow },
            },
          },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
      ]);

    return {
      totalFines,
      pendingAmount: pendingFines[0]?.total || 0,
      collectedAmount: paidFines[0]?.total || 0,
      overdueCount: overdueFines,
      todayCollection: todayCollection[0]?.total || 0,
    };
  } catch (error) {
    throw new Error(`Error fetching finance dashboard: ${error.message}`);
  }
};

exports.getFinancialSummary = async () => {
  try {
    const fines = await Fine.find().populate("student", "name rollNumber");

    const summary = {
      totalFines: fines.length,
      totalAmount: fines.reduce((sum, fine) => sum + fine.amount, 0),
      paidAmount: fines
        .filter((f) => f.status === "paid")
        .reduce((sum, fine) => sum + fine.amount, 0),
      pendingAmount: fines
        .filter((f) => f.status === "pending")
        .reduce((sum, fine) => sum + fine.amount, 0),
      overdueAmount: fines
        .filter((f) => f.status === "overdue")
        .reduce((sum, fine) => sum + fine.amount, 0),
    };

    return summary;
  } catch (error) {
    throw new Error(`Error fetching financial summary: ${error.message}`);
  }
};

exports.markFinePaid = async (fineId) => {
  try {
    const fine = await Fine.findByIdAndUpdate(
      fineId,
      { status: "paid", paidDate: new Date() },
      { new: true, runValidators: true }
    ).populate("student", "name rollNumber");

    if (!fine) {
      throw new Error("Fine not found");
    }

    return fine;
  } catch (error) {
    throw new Error(`Error marking fine as paid: ${error.message}`);
  }
};

exports.getStudentFines = async (rollNumber) => {
  try {
    const student = await User.findOne({ rollNumber });
    if (!student) {
      throw new Error("Student not found");
    }

    const fines = await Fine.find({ student: student._id }).populate(
      "student",
      "name rollNumber"
    );

    const summary = {
      totalFines: fines.reduce((sum, fine) => sum + fine.amount, 0),
      pendingFines: fines
        .filter((f) => f.status === "pending")
        .reduce((sum, fine) => sum + fine.amount, 0),
      fines: fines,
    };

    return summary;
  } catch (error) {
    throw new Error(`Error fetching student fines: ${error.message}`);
  }
};
