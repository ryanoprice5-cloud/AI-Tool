import bcrypt from "bcrypt";
// import { prisma } from "@/libs/prismaDB"; // REMOVED - Prisma dependency
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/libs/email";

// Mock user storage for development (shared across routes)
// In a real app, you'd have a proper database
declare global {
  var mockUsers: any[];
}

// Initialize global mock users if not exists
global.mockUsers = global.mockUsers || [];

// Helper functions for mock database operations
const findUserByEmail = (email: string) => {
  return global.mockUsers.find((user: any) => user.email === email);
};

const updateUser = (email: string, data: any) => {
  const userIndex = global.mockUsers.findIndex((user: any) => user.email === email);
  if (userIndex !== -1) {
    global.mockUsers[userIndex] = { ...global.mockUsers[userIndex], ...data };
    return global.mockUsers[userIndex];
  }
  return null;
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password, resetToken } = body; // Added resetToken for verification

  if (!email || !password) {
    return new NextResponse("Missing Fields", { status: 400 });
  }

  // OPTION 1: Mock implementation for development
  if (process.env.NODE_ENV === "development") {
    // Find user in mock database
    const user = findUserByEmail(email);
    
    if (!user) {
      // For development, create a mock user if doesn't exist
      console.log("Mock: Creating user for password update:", email);
      
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const newUser = {
        id: `mock-${Date.now()}`,
        email,
        password: hashedPassword,
        name: email.split("@")[0],
        createdAt: new Date(),
        passwordResetToken: null,
        passwordResetTokenExp: null,
      };
      
      global.mockUsers.push(newUser);
      
      // Optionally send confirmation email
      await sendEmail({
        to: email,
        subject: "Password Updated (Mock Mode)",
        html: `
        <div>
          <h1>Your password has been updated</h1>
          <p>This is a mock implementation. In production, this would be a real password update.</p>
        </div>
        `,
      }).catch(console.error);
      
      return NextResponse.json("Password Updated (Mock Mode)", { status: 200 });
    }

    // Check if reset token is valid (if provided)
    if (resetToken) {
      const tokenExpired = user.passwordResetTokenExp && new Date() > new Date(user.passwordResetTokenExp);
      const tokenValid = user.passwordResetToken === resetToken && !tokenExpired;
      
      if (!tokenValid) {
        return new NextResponse("Invalid or expired reset token", { status: 400 });
      }
    }

    // Update password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    updateUser(email, {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetTokenExp: null,
    });

    // Send confirmation email
    await sendEmail({
      to: email,
      subject: "Your password has been updated",
      html: `
      <div>
        <h1>Password Updated Successfully</h1>
        <p>Your password has been updated. If you didn't make this change, please contact support.</p>
      </div>
      `,
    }).catch(console.error);

    return NextResponse.json("Password Updated", { status: 200 });
  }

  // OPTION 2: For production - you need to implement a real database
  // Uncomment and modify based on your database choice:
  
  /*
  // Example with PostgreSQL (node-postgres)
  import { Pool } from 'pg';
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  // Check if user exists
  const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  
  if (userResult.rows.length === 0) {
    return new NextResponse("Email does not exist", { status: 400 });
  }
  
  // Check reset token if provided
  if (resetToken) {
    const user = userResult.rows[0];
    const tokenExpired = user.password_reset_token_exp && new Date() > new Date(user.password_reset_token_exp);
    
    if (user.password_reset_token !== resetToken || tokenExpired) {
      return new NextResponse("Invalid or expired reset token", { status: 400 });
    }
  }
  
  // Update password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  await pool.query(
    'UPDATE users SET password = $1, password_reset_token = NULL, password_reset_token_exp = NULL WHERE email = $2',
    [hashedPassword, email]
  );
  
  return NextResponse.json("Password Updated", { status: 200 });
  */

  // If not in development and no database configured
  return new NextResponse(
    "Database not configured. Please set up a database for production.", 
    { status: 500 }
  );

  /* ORIGINAL PRISMA CODE - REMOVED
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Email does not exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetTokenExp: null,
      },
    });

    return NextResponse.json("Password Updated", { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
  */
}