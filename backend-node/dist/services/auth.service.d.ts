export interface AuthResponseDto {
    token: string;
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}
export declare class AuthService {
    private userRepo;
    private studentRepo;
    private simRepo;
    private districtRepo;
    private deptRepo;
    private progRepo;
    loginStudent(cnic: string, pass: string): Promise<AuthResponseDto>;
    loginAdmin(email: string, pass: string): Promise<AuthResponseDto>;
    registerStudent(data: {
        cnic: string;
        registrationNumber: string;
        email: string;
        password: string;
        phoneNumber?: string;
        firstName?: string;
        lastName?: string;
        gender?: string;
        dateOfBirth?: string;
    }): Promise<AuthResponseDto>;
}
//# sourceMappingURL=auth.service.d.ts.map