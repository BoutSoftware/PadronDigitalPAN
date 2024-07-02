export interface Data {
    code: string;
    message: string;
    data: DataClass;
}

export interface DataClass {
    Coordinators: Admin[];
    Technicals: Admin[];
    Users: Admin[];
    Admins: Admin[];
}

export interface Admin {
    id: string;
    rol: string;
    active: boolean;
    title: null | string;
    User: User;
}

export interface User {
    Person: Person;
}

export interface Person {
    name: string;
    fatherLastName: string;
    motherLastName: string;
}
