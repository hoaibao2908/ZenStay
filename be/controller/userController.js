const validator = require("validator");
const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

class UserController {
  //đăng nhập
  //[POST]
  validateCredentials(email, password) {
    const errors = {};

    // 1. Kiểm tra Email
    if (!email) {
      errors.email = "Email không được để trống.";
    } else if (!validator.isEmail(email)) {
      errors.email = "Email không đúng định dạng.";
    }

    // 2. Kiểm tra Mật khẩu
    if (!password) {
      errors.password = "Mật khẩu không được để trống.";
    } else if (password.length < 6) {
      // Ví dụ: mật khẩu tối thiểu 6 ký tự
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/.test(
        password
      )
    ) {
      errors.passwordStrength =
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.";
    }

    return errors;
  }
  login = async (req, res) => {
    //kiểm tra method
    if (req.method === "POST") {
      try {
        //lấy thông tin đăng nhập từ body
        const { email, password } = req.body;

        //kiểm tra thông tin gửi lên
        const errors = this.validateCredentials(email, password);
        if (Object.keys(errors).length > 0) {
          return res.status(400).json({ errors: validationErrors });
        }

        //kiểm tra thông tin với db
        const user = await User.findOne({ where: { email: email } });
        if (!user)
          return res.status(200).json({ message: "Tài khoản không tồn tại" });
        if (user.is_locked == 1)
          return res.status(200).json({ message: "Tài khoản đã bị khóa" });
        //so sánh password và email với db
        const bcrypt = require("bcryptjs");
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch)
          return res
            .status(200)
            .json({ status: 2, message: "Mật khẩu không đúng" });

        //tạo token
        const jwt = require("node-jsonwebtoken");
        const token = jwt.sign({ id: user.id, email: user.email }, "zenstay", {
          expiresIn: "1h",
        });
        return res.json({
          status: 1,
          message: "Đăng nhập thành công",
          token,
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            image: user.image,
            phone_number: user.phone_number,
            user_type_id: user.user_type_id,
          },
        });
        //trả về dữ liệu
      } catch (error) {
        console.error("Error fetching user login:", error);
        res.status(500).json({ message: "Lỗi khi lấy dữ liệu" });
      }
    } else {
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  };
  //xác thực tài khoảng
  verify = async (req, res) => {
    if (req.method === "GET") {
      try {
        const { email, token } = req.body;
        const user = await User.findOne({ where: { email, token } });
        if (!user)
          return res
            .status(404)
            .json({ message: "Thông tin xác thực không hợp lệ" });

        user.email_verify_at = new Date();
        //xóa token vì token này để xác thực tài khoảng để người dùng khi đăng nhập tạo token mới
        user.token = null;
        await user.save();
        res.status(200).json({ message: "Xác thực tài khoản thành công" });
      } catch (error) {
        console.error("Error fetching user verify:", error);
        res.status(500).json({ message: "Lỗi khi lấy dữ liệu" });
      }
    } else {
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  };
  //đăng ký người dùng thường
  register = async (req, res) => {
    if (req.method === "POST") {
      try {
        //lấy dữ liệu đầu vào
        const { email, password, username, phone_number, reEnterPassword } =
          req.body;
        //kiểm tra dữ liệu đầu vào
        if (
          !email ||
          !password ||
          !username ||
          !phone_number ||
          !reEnterPassword
        )
          return res.status(400).json({ message: "Thiếu các trường bắt buộc" });
        const error = this.validateCredentials(email, password);
        if (Object.keys(error).length > 0) {
          return res.status(400).json({ errors: error });
        }
        if (password !== reEnterPassword) {
          return res.status(400).json({ message: "Mật khẩu không khớp" });
        }
        //kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
          return res.status(400).json({ message: "Email đã tồn tại" });
        }

        // hash mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        //tạo token
        const token = Math.random().toString(36);
        //tạo id
        const lastUser = await User.findOne({
          order: [["id", "DESC"]],
        });

        const id_max = lastUser.id + 1;
        //tạo user
        const user = await User.create({
          id: id_max,
          username: username,
          email: email,
          phone_number: phone_number,
          password_hash: hashedPassword,
          user_type_id: 3,
          token: token,
        });
        //gửi mail xác thực
        const verifyLink = `http://localhost:3000/api/users/verify?email=${email}&token=${token}`;

        //gửi mail bằng nodemailer
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "vohoaibao2908@gmail.com",
            pass: "jpfx sepp kdrm qcca",
            tls: {
              rejectUnauthorized: false,
            },
          },
        });
        const mailContet = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #f0f8f8; padding: 25px; text-align: center;">
                <h2 style="color: #336666; margin: 0; font-size: 28px;">Chào mừng đến với ZenStay!</h2>
            </div>
            <div style="padding: 30px; text-align: center; color: #555555; font-size: 16px; line-height: 1.6;">
                <p>Kính gửi Quý khách,</p>
                <p>Cảm ơn Quý khách đã đăng ký tài khoản với ZenStay. Để hoàn tất việc thiết lập tài khoản và mở khóa các ưu đãi độc quyền, vui lòng xác thực địa chỉ email của Quý khách bằng cách nhấp vào liên kết bên dưới:</p>
                <p style="margin: 30px 0;">
                    <a href="${verifyLink}" style="display: inline-block; padding: 15px 30px; background-color: #669999; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 18px; font-weight: bold;">
                        Xác thực tài khoản của bạn
                    </a>
                </p>
                <p>Chúng tôi mong đợi được chào đón Quý khách đến với một kỳ nghỉ yên bình và thư giãn.</p>
                <p style="font-size: 14px; color: #888888;">Trân trọng,<br>Đội ngũ ZenStay</p>
            </div>
            <div style="background-color: #f0f8f8; padding: 15px; text-align: center; font-size: 12px; color: #999999;">
                <p>&copy; 2025 ZenStay. Bảo lưu mọi quyền.</p>
            </div>
        </div>
        `;
        const mailOptions = {
          from: "vohoaibao2908@gmail.com",
          to: email,
          subject: "Xác thực tài khoản ZenStay",
          html: mailContet,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) console.log(error);
          console.log("Email sent: " + info.response);
        });
        res.status(201).json({
          message: "Đăng ký thành công",
        });
      } catch (error) {
        console.error("Error fetching user register:", error);
        res.status(500).json({ message: "Lỗi khi lấy dữ liệu" });
      }
    } else {
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  };
  //đăng ký chủ khách sạn chờ admin duyệt
}

module.exports = new UserController();
