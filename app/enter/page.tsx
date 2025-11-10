import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { isAllowedEmail } from "@/lib/accessControl";
import Dashboard from "@/components/Dashboard";

export default async function EnterPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email ?? null;

  // 로그인 안 된 경우
  if (!session) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>워크샵 입장</h1>
        <p>Google 계정으로 로그인 해주세요.</p>
        <a
          href="/api/auth/signin"
          style={{
            display: "inline-block",
            marginTop: "1rem",
            padding: "0.8rem 1.5rem",
            border: "1px solid #555",
            borderRadius: "10px",
          }}
        >
          Google로 로그인
        </a>
      </div>
    );
  }

  // 로그인은 했지만 화이트리스트에 없음
  if (!isAllowedEmail(email)) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>접근 권한이 없습니다</h1>
        <p>이 워크샵은 사전 등록된 교사만 접근 가능합니다.</p>
        <p style={{ marginTop: "1rem", color: "#888" }}>
          현재 로그인된 이메일: <strong>{email}</strong>
        </p>
        <a
          href="/api/auth/signout"
          style={{
            display: "inline-block",
            marginTop: "1rem",
            padding: "0.6rem 1.2rem",
            border: "1px solid #999",
            borderRadius: "8px",
            fontSize: "0.9rem",
          }}
        >
          로그아웃
        </a>
      </div>
    );
  }

  // 로그인 + 권한 OK → 교사용 대시보드 표시
  return <Dashboard user={session.user} />;
}
