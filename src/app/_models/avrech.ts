import { MonthlyRecord } from "./MonthlyRecord";

export interface Avrech{
    id: number,
    firstName: string,
    lastName: string,
    status: string,
    datot: string,
    isPresent: string    
    teudatZeut: string,
    dateOfBirth?: Date | null,
    phone: string,
    cellPhone: string,
    cellPhone2: string,
    street: string,
    houseNumber: string,
    bank: string,
    branch: string,
    accountNumber: string,
    isSuspended: boolean; 
}