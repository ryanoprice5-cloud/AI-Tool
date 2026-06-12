import bcrypt from "bcrypt";
// import { prisma } from "@/libs/prismaDB"; // REMOVED - Prisma dependency
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sendEmail } from "@/libs/email";

// Mock user storage for development (temporary)
// In a real app, you'd replace this with a real database query
const mockUsers: any[] = [];

// Helper function to find user by email in mock database
const findUserByEmail = (email: string) => {
  return mockUsers.find(user => user.email === email);
};

// Helper function to update user in mock database
const updateUser = (email: string, data: any) => {
  const userIndex = mockUsers.findIndex(user => user.email === email);
  if (userIndex !== -1) {
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...data };
    return mockUsers[userIndex];
  }
  return null;
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email } = body;

  if (!email) {
    return new NextResponse("Missing Fields", { status: 400 });
  }

  // OPTION 1: Mock implementation for development
  if (process.env.NODE_ENV === "development") {
    // Check if user exists in mock database
    const user = findUserByEmail(email);
    
    if (!user) {
      // For development, create a mock user if doesn't exist
      // This makes testing easier
      console.log("Mock: Creating user for password reset:", email);
      
      // Generate reset token anyway for testing
      const resetToken = crypto.randomBytes(20).toString("hex");
      const passwordResetTokenExp = new Date();
      passwordResetTokenExp.setHours(passwordResetTokenExp.getHours() + 1);
      
      // Store in mock database
      const newUser = {
        id: `mock-${Date.now()}`,
        email,
        passwordResetToken: resetToken,
        passwordResetTokenExp,
        name: email.split("@")[0],
      };
      mockUsers.push(newUser);
      
      const resetURL = `${process.env.SITE_URL}/auth/reset-password/${resetToken}`;
      
      try {
        await sendEmail({
          to: email,
          subject: "Reset your password (MOCK MODE)",
          html: ` 
          <div>
            <h1>You requested a password reset</h1>
            <p>Click the link below to reset your password</p>
            <a href="${resetURL}" target="_blank">Reset Password</a>
            <p><strong>Note:</strong> This is a mock implementation. In production, this would create a real user.</p>
          </div>
          `,
        });
        
        return NextResponse.json("An email has been sent to your email", {
          status: 200,
        });
      } catch (error) {
        console.error("Email error:", error);
        return NextResponse.json("An error has occurred. Please try again!", {
          status: 500,
        });
      }
    }

    // User exists - proceed with reset
    const resetToken = crypto.randomBytes(20).toString("hex");
    const passwordResetTokenExp = new Date();
    passwordResetTokenExp.setHours(passwordResetTokenExp.getHours() + 1);

    // Update mock user
    updateUser(email, {
      passwordResetToken: resetToken,
      passwordResetTokenExp,
    });

    const resetURL = `${process.env.SITE_URL}/auth/reset-password/${resetToken}`;

    try {
      await sendEmail({
        to: email,
        subject: "Reset your password",
        html: ` 
        <div>
          <h1>You requested a password reset</h1>
          <p>Click the link below to reset your password</p>
          <a href="${resetURL}" target="_blank">Reset Password</a>
        </div>
        `,
      });

      return NextResponse.json("An email has been sent to your email", {
        status: 200,
      });
    } catch (error) {
      console.error("Email error:", error);
      return NextResponse.json("An error has occurred. Please try again!", {
        status: 500,
      });
    }
  }

  // OPTION 2: For production - you need to implement a real database
  // Uncomment and modify based on your database choice:
  
  /*
  // Example with PostgreSQL (node-postgres)
  import { Pool } from 'pg';
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  
  if (result.rows.length === 0) {
    return new NextResponse("Email does not exist", { status: 400 });
  }
  
  const resetToken = crypto.randomBytes(20).toString("hex");
  const passwordResetTokenExp = new Date();
  passwordResetTokenExp.setHours(passwordResetTokenExp.getHours() + 1);
  
  await pool.query(
    'UPDATE users SET password_reset_token = $1, password_reset_token_exp = $2 WHERE email = $3',
    [resetToken, passwordResetTokenExp, email]
  );
  
  const resetURL = `${process.env.SITE_URL}/auth/reset-password/${resetToken}`;
  
  try {
    await sendEmail({
      to: email,
      subject: "Reset your password",
      html: `...`,
    });
    return NextResponse.json("An email has been sent to your email", { status: 200 });
  } catch (error) {
    return NextResponse.json("An error has occurred", { status: 500 });
  }
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

  const resetToken = crypto.randomBytes(20).toString("hex");

  const passwordResetTokenExp = new Date();
  passwordResetTokenExp.setHours(passwordResetTokenExp.getHours() + 1);

  await prisma.user.update({
    where: {
      email,
    },
    data: {
      passwordResetToken: resetToken,
      passwordResetTokenExp,
    },
  });

  const resetURL = `${process.env.SITE_URL}/auth/reset-password/${resetToken}`;

  try {
    await sendEmail({
      to: email,
      subject: "Reset your password",
      html: ` 
      <div>
        <h1>You requested a password reset</h1>
        <p>Click the link below to reset your password</p>
        <a href="${resetURL}" target="_blank">Reset Password</a>
      </div>
      `,
    });

    return NextResponse.json("An email has been sent to your email", {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json("An error has occurred. Please try again!", {
      status: 500,
    });
  }
  */
}