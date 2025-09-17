import type { 
    ContactSchema, 
    UserSchema,
    ContactOrganizationSchema,
    ContactEmailSchema,
    ContactPhoneSchema,
    ContactUrlSchema,
    ContactSocialLinkSchema,
    ContactAssociatedNameSchema,
    OrganizationSchema,
    TeamSchema
} from './db/schema';

export type User = UserSchema & {
    organizations?: { organization: OrganizationSchema }[];
};

export type ContactOrganization = ContactOrganizationSchema & {
    organization: OrganizationSchema;
    team: TeamSchema | null;
}

export type Contact = ContactSchema & {
    organizations?: ContactOrganization[];
    emails?: ContactEmailSchema[];
    phones?: ContactPhoneSchema[];
    urls?: ContactUrlSchema[];
    socialLinks?: ContactSocialLinkSchema[];
    associatedNames?: ContactAssociatedNameSchema[];
};
