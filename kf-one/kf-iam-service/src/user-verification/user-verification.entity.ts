import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('user_verification')
export class UserVerification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  otp: string;

  @Column({ type: 'timestamp', nullable: true })
  otp_expires_at: Date;

  @Column({ default: false })
  is_verified: boolean;

  @Column({ nullable: false })
  password: string;  // New field for storing hashed password

  @Column({ default: 0 })
  failed_attempts: number;  // Tracks incorrect login attempts

  @Column({ default: false })
  is_locked: boolean;  // Locks account after 3 failed attempts

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
