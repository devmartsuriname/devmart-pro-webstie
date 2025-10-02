import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password must be less than 128 characters'),
  remember: z.boolean().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password must be less than 128 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
