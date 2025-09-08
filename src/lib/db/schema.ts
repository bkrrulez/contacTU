
import { pgTable, serial, text, varchar, date, integer, pgEnum, timestamp, jsonb, boolean } from 'drizzle-orm/pg-core';
import { InferSelectModel, relations } from 'drizzle-orm';

export const userRoleEnum = pgEnum('user_role', ['Admin', 'Power User', 'Standard User', 'Read-Only']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  password: varchar('password', { length: 256 }),
  role: userRoleEnum('role').notNull(),
  avatar: varchar('avatar', { length: 256 }),
  resetToken: varchar('reset_token', { length: 256 }),
  resetTokenExpiry: timestamp('reset_token_expiry', { withTimezone: true }),
});

export const contacts = pgTable('contacts', {
    id: serial('id').primaryKey(),
    firstName: varchar('first_name', { length: 256 }).notNull(),
    lastName: varchar('last_name', { length: 256 }).notNull(),
    address: text('address'),
    birthday: date('birthday'),
    notes: text('notes'),
    avatar: varchar('avatar', { length: 256 }),
    isFavorite: boolean('is_favorite').default(false).notNull(),
});

export const contactOrganizations = pgTable('contact_organizations', {
  id: serial('id').primaryKey(),
  contactId: integer('contact_id').notNull().references(() => contacts.id, { onDelete: 'cascade' }),
  organization: varchar('organization', { length: 256 }).notNull(),
  designation: varchar('designation', { length: 256 }),
  team: varchar('team', { length: 256 }).notNull(),
  department: varchar('department', { length: 256 }),
});

export const contactEmails = pgTable('contact_emails', {
  id: serial('id').primaryKey(),
  contactId: integer('contact_id').notNull().references(() => contacts.id, { onDelete: 'cascade' }),
  email: varchar('email', { length: 256 }).notNull(),
});

export const phoneTypeEnum = pgEnum('phone_type', ['Telephone', 'Mobile']);

export const contactPhones = pgTable('contact_phones', {
  id: serial('id').primaryKey(),
  contactId: integer('contact_id').notNull().references(() => contacts.id, { onDelete: 'cascade' }),
  phone: varchar('phone', { length: 50 }).notNull(),
  type: phoneTypeEnum('type').notNull(),
});

export const contactUrls = pgTable('contact_urls', {
  id: serial('id').primaryKey(),
  contactId: integer('contact_id').notNull().references(() => contacts.id, { onDelete: 'cascade' }),
  url: varchar('url', { length: 256 }).notNull(),
});

export const contactSocialLinks = pgTable('contact_social_links', {
    id: serial('id').primaryKey(),
    contactId: integer('contact_id').notNull().references(() => contacts.id, { onDelete: 'cascade' }),
    link: varchar('link', { length: 256 }).notNull(),
});

export const contactAssociatedNames = pgTable('contact_associated_names', {
    id: serial('id').primaryKey(),
    contactId: integer('contact_id').notNull().references(() => contacts.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 256 }).notNull(),
});

export const auditLogActionEnum = pgEnum('audit_log_action', ['create', 'update', 'delete']);

export const auditLogs = pgTable('audit_logs', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }),
    action: auditLogActionEnum('action').notNull(),
    entityType: varchar('entity_type', { length: 50 }).notNull(), // e.g., 'contact'
    entityId: integer('entity_id').notNull(),
    details: jsonb('details'), // To store what changed, e.g., { "contactName": "John Doe" }
    timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow().notNull(),
});


// RELATIONS

export const usersRelations = relations(users, ({ many }) => ({
    auditLogs: many(auditLogs),
}));

export const contactsRelations = relations(contacts, ({ many }) => ({
    organizations: many(contactOrganizations),
    emails: many(contactEmails),
    phones: many(contactPhones),
    urls: many(contactUrls),
    socialLinks: many(contactSocialLinks),
    associatedNames: many(contactAssociatedNames),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
    user: one(users, {
        fields: [auditLogs.userId],
        references: [users.id],
    }),
}));

export const contactOrganizationsRelations = relations(contactOrganizations, ({ one }) => ({
    contact: one(contacts, {
        fields: [contactOrganizations.contactId],
        references: [contacts.id],
    }),
}));

export const contactEmailsRelations = relations(contactEmails, ({ one }) => ({
    contact: one(contacts, {
        fields: [contactEmails.contactId],
        references: [contacts.id],
    }),
}));

export const contactPhonesRelations = relations(contactPhones, ({ one }) => ({
    contact: one(contacts, {
        fields: [contactPhones.contactId],
        references: [contacts.id],
    }),
}));

export const contactUrlsRelations = relations(contactUrls, ({ one }) => ({
    contact: one(contacts, {
        fields: [contactUrls.contactId],
        references: [contacts.id],
    }),
}));

export const contactSocialLinksRelations = relations(contactSocialLinks, ({ one }) => ({
    contact: one(contacts, {
        fields: [contactSocialLinks.contactId],
        references: [contacts.id],
    }),
}));

export const contactAssociatedNamesRelations = relations(contactAssociatedNames, ({ one }) => ({
    contact: one(contacts, {
        fields: [contactAssociatedNames.contactId],
        references: [contacts.id],
    }),
}));


export type UserSchema = InferSelectModel<typeof users>;
export type ContactSchema = InferSelectModel<typeof contacts>;
export type ContactOrganizationSchema = InferSelectModel<typeof contactOrganizations>;
export type ContactEmailSchema = InferSelectModel<typeof contactEmails>;
export type ContactPhoneSchema = InferSelectModel<typeof contactPhones>;
export type ContactUrlSchema = InferSelectModel<typeof contactUrls>;
export type ContactSocialLinkSchema = InferSelectModel<typeof contactSocialLinks>;
export type ContactAssociatedNameSchema = InferSelectModel<typeof contactAssociatedNames>;
export type AuditLogSchema = InferSelectModel<typeof auditLogs>;
