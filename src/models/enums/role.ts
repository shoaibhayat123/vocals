export enum Role {
    SuperAdmin = 'super admin',
    Admin = 'admin',
    User = 'user'
};
export const RoleValues = Object.keys(Role).map((k: any) => Role[k]);
