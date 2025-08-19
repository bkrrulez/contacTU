import type { 
    ContactSchema, 
    UserSchema,
    ContactOrganizationSchema,
    ContactEmailSchema,
    ContactPhoneSchema,
    ContactUrlSchema,
    ContactSocialLinkSchema,
    ContactAssociatedNameSchema
} from './db/schema';

export type User = UserSchema;

export type Contact = ContactSchema & {
    organizations?: ContactOrganizationSchema[];
    emails?: ContactEmailSchema[];
    phones?: ContactPhoneSchema[];
    urls?: ContactUrlSchema[];
    socialLinks?: ContactSocialLinkSchema[];
    associatedNames?: ContactAssociatedNameSchema[];
};
