const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
    bio: String,

    followersVisibility: {
        type: String,
        enum: ["PUBLIC", "FOLLOWERS", "CLOSE_FRIENDS", "ONLY_ME"],
        default: "PUBLIC"
    },

    profileVisibility: {
        type: String,
        enum: ["PUBLIC", "FOLLOWERS", "CLOSE_FRIENDS", "ONLY_ME"],
        default: "PUBLIC"
    }

}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔥 compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model("User", userSchema);