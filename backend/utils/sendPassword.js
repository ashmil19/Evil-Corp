const sendMail = require("./sendMail");
const hash = require("./toHash");

const generatePassword = async () => {
  try {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";

    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset.charAt(randomIndex);
    }

    const hashPassword = await hash(password);

    return {
      password,
      hashPassword,
    };
  } catch (error) {
    console.log(error);
  }
};

const sendPassword = async (user) => {
  try {
    const result = await generatePassword();

    const option = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Your Temporary password",
      text: "Don't share the password",
      html: `<p>Your Password  is <b>${result.password}</b></p>`,
    };

    console.log("before", result.password);
    await sendMail(option)
    return result.hashPassword;
  } catch (error) {
    console.log(error);
  }
};


module.exports = {
  sendPassword
}