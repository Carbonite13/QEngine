export const NAME_MIN = 1;
export const NAME_MAX = 40;
export const ADDRESS_MIN = 10;
export const ADDRESS_MAX = 80;
export const JOBTITLE_MAX = 60;
export const MIN_AGE = 18;
export const MAX_AGE = 120;

export const GENDERS = {
    0: "Male",
    1: "Female",
    2: "Other",
};

export const COMMUNICATIONS = {
    0: "Email",
    1: "Phone"
};

export const DEPARTMENTS = {
    0: "Sales",
    1: "Marketing",
    2: "Human Resources",
    3: "Finance",
    4: "Engineering",
    5: "Information Technology (IT)",
    6: "Customer Support",
    7: "Design",
};

export const REGEX = {
    SSN: /^[0-9A-Za-z-]{4,20}$/,
    SSN_DISPLAY: /^\d{3}-\d{2}-\d{4}$/,
    PHONE: /^[0-9]{10}$/,
    // EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    ALPHAONLY: /^[A-Za-z]+$/,
    NUMBERONLY: /^[0-9]+$/,
    ALPHANUMERIC: /^[A-Za-z0-9]+$/,
    ALPHA_EXTENDED: /^[A-Za-z\s'.-]+$/,
    EMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
};

// Packaged default export for backwards compatibility
export default {
    NAME_MIN, NAME_MAX, ADDRESS_MIN, ADDRESS_MAX, JOBTITLE_MAX, MIN_AGE, MAX_AGE,
    GENDERS, COMMUNICATIONS, DEPARTMENTS, REGEX
};