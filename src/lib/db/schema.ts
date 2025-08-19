import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { InferSelectModel } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  role: text('role', { enum: ['Admin', 'Power User', 'Standard User', 'Read-Only'] }).notNull(),
  avatar: varchar('avatar', { length: 256 }),
});

export const contacts = pgTable('contacts', {
    id: serial('id').primaryKey(),
    firstName: varchar('first_name', { length: 256 }).notNull(),
    lastName: varchar('last_name', { length: 256 }).notNull(),
    email: varchar('email', { length: 256 }).notNull().unique(),
    phone: varchar('phone', { length: 50 }),
    mobile: varchar('mobile', { length: 50 }),
    address: text('address'),
    organization: varchar('organization', { length: 256 }),
    designation: varchar('designation', { length: 256 }),
    notes: text('notes'),
    avatar: varchar('avatar', { length: 256 }),
});

export type UserSchema = InferSelectModel<typeof users>;
export type ContactSchema = InferSelectModel<typeof contacts>;
