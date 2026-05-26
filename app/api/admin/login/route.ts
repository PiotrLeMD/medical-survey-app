import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const adminLogin = process.env.ADMIN_LOGIN
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminLogin || !adminPassword) {
    return NextResponse.json(
      { error: "Brak konfiguracji logowania administratora (ADMIN_LOGIN / ADMIN_PASSWORD)." },
      { status: 500 }
    )
  }

  let body: { login?: string; password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Nieprawidłowe dane logowania." }, { status: 400 })
  }

  const login = body.login?.trim() ?? ""
  const password = body.password ?? ""

  if (login !== adminLogin || password !== adminPassword) {
    return NextResponse.json({ error: "Nieprawidłowy login lub hasło." }, { status: 401 })
  }

  return NextResponse.json({ success: true })
}
