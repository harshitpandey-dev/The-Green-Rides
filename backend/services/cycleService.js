const Cycle = require("../models/Cycle");

exports.getAllCycles = async () => {
  return await Cycle.find();
};

exports.createCycle = async (data) => {
  const cycle = new Cycle(data);
  await cycle.save();
  return cycle;
};

exports.updateCycle = async (id, data) => {
  const cycle = await Cycle.findByIdAndUpdate(id, data, { new: true });
  if (!cycle) throw new Error("Cycle not found");
  return cycle;
};

exports.deleteCycle = async (id) => {
  const cycle = await Cycle.findByIdAndDelete(id);
  if (!cycle) throw new Error("Cycle not found");
  return { message: "Cycle deleted" };
};
