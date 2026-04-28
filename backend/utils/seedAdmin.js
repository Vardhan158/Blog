const User = require("../models/User");

const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL || "admin@blogpage.com";
  const password = process.env.ADMIN_PASSWORD || "Admin@123";
  const username = process.env.ADMIN_USERNAME || "admin";

  const existingAdmin = await User.findOne({ email });
  if (existingAdmin) {
    if (existingAdmin.role !== "admin") {
      existingAdmin.role = "admin";
      await existingAdmin.save();
    }
    return;
  }

  await User.create({
    username,
    name: "Admin",
    email,
    password,
    role: "admin",
  });

  console.log(`Seeded admin account: ${email}`);
};

module.exports = seedAdmin;
