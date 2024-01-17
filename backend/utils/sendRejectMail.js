const sendMail = require("./sendMail");

const sendRejectMail = async (user) => {
  try {
    const option = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject:
        "Action Required: Account Rejection Notice - Please Resubmit Your Signup",
      text: "Dont share the mail to anyone",
      html: `<p><b>Dear ${user.fullname},</b></p> <p>We hope this message finds you well. We regret to inform you that your recent account signup has been rejected. To ensure a smooth and secure user experience, we kindly request you to <b>resubmit your signup</b>.</p><p><b>Sincerly Admin</b></p>`,
    };

    await sendMail(option);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  sendRejectMail,
};
