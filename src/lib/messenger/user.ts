export interface User {
    name: {
        first: string;
        last: string;
    };
    email: string;
    dob: {
        age: number;
    };
    picture: {
        thumbnail: string;
    };
}
