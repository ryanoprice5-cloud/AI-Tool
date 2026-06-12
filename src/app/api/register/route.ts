// import { prisma } from "@/libs/prismaDB"; // REMOVED - Prisma dependency
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

// Mock user storage for development (temporary - replace with real database)
// This is an in-memory array that will reset on server restart
const mockUsers: any[] = [];

export async function POST(request: any) {
  const body = await request.json();
  const { name, email, password } = body;

  if (!name || !email || !password) {
    return new NextResponse("Missing Fields", { status: 400 });
  }

  // OPTION 1: Mock implementation for development
  // This allows testing without a database
  if (process.env.NODE_ENV === "development") {
    // Check if user already exists in mock database
    const existingUser = mockUsers.find(user => user.email === email);
    
    if (existingUser) {
      return new NextResponse("Email already exists", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create mock user
    const newUser = {
      id: `mock-${Date.now()}`,
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    mockUsers.push(newUser);

    // Return user without password for security
    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword, { status: 201 });
  }

  // OPTION 2: For production - you need to implement a real database
  // Uncomment and modify based on your database choice:
  
  /*
  // Example with PostgreSQL (node-postgres)
  import { Pool } from 'pg';
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (existingUser.rows.length > 0) {
    return new NextResponse("Email already exists", { status: 400 });
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
    [name, email, hashedPassword]
  );
  
  return NextResponse.json(result.rows[0]);
  */

  // If not in development and no database configured
  return new NextResponse(
    "Database not configured. Please set up a database for production.", 
    { status: 500 }
  );

  /* ORIGINAL PRISMA CODE - REMOVED
  const exist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (exist) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return NextResponse.json(user);
  */
}