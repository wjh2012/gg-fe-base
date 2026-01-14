import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";

const ACCESS_TOKEN_SECRET = "your_very_secret_key_here";
const REFRESH_TOKEN_SECRET = "your_very_secret_key_here";
const PORT = 8080;

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Vite 기본 포트 (필요시 수정)
    credentials: true, // 쿠키(Refresh Token)를 주고받기 위해 필수!
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);

app.use(express.json());
app.use(cookieParser());

const users = [
  { id: 1, username: "admin", password: "admin" },
  { id: 2, username: "user", password: "user" },
];

let refreshTokens = [];

const authRouter = express.Router();

// 1. 로그인: Access(Body) & Refresh(Cookie) 발급
authRouter.post("/login", (req, res) => {
  const { username, password } = req.body;

  // 1. 사용자 검증 (Verification)
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );

  if (!user) {
    return res
      .status(401)
      .json({ message: "아이디 또는 비밀번호가 틀렸습니다." });
  }

  const payload = { name: user.username, id: user.id };

  // 토큰 생성
  const accessToken = generateAccessToken(payload);
  const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });

  // Refresh Token 저장
  refreshTokens.push(refreshToken);

  // Refresh Token을 httpOnly 쿠키에
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // HTTPS 여부
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
  });

  // Access Token은 body에
  res.json({
    accessToken,
    user: payload,
  });
});

// 2. Refresh API: 새로운 Access Token 발급
authRouter.post("/refresh", (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.sendStatus(401); // 쿠키에 토큰이 없음
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403); // 서버에 저장되지 않은 토큰

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const payload = { name: user.name, id: user.id };
    const accessToken = generateAccessToken(payload);
    res.json({ accessToken, user: payload });
  });
});

// 3. 로그아웃: 토큰 삭제
authRouter.post("/logout", (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  // DB에서 Refresh Token 제거
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

  // 쿠키 삭제
  res.clearCookie("refreshToken");
  res.sendStatus(204);
});

// 4. 유저 정보 조회: Access Token을 검증하여 유저 정보를 반환
authRouter.get("/me", (req, res) => {
  // Header에서 Authorization: Bearer <token> 추출
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "토큰이 없습니다." });
  }

  // Access Token 검증
  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "유효하지 않은 토큰입니다." });
    }

    // 토큰이 유효하면 페이로드에 담긴 유저 정보 반환
    res.json({
      user: {
        id: (user as any).id,
        username: (user as any).name,
      },
    });
  });
});

app.use("/api/auth", authRouter);

// Access Token 생성 함수
function generateAccessToken(user) {
  return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
