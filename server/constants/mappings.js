const GENDER = {
    MALE: 1,
    FEMALE: 2,
    OTHER: 3
};

const GENDER_LABELS = {
    [GENDER.MALE]: 'Male',
    [GENDER.FEMALE]: 'Female',
    [GENDER.OTHER]: 'Other'
};

const COMMUNICATION = {
    EMAIL: 1,
    PHONE: 2
};

const COMMUNICATION_LABELS = {
    [COMMUNICATION.EMAIL]: 'Email',
    [COMMUNICATION.PHONE]: 'Phone'
};

const DEPARTMENT = {
    SALES: 1,
    MARKETING: 2,
    HR: 3,
    FINANCE: 4,
    ENGINEERING: 5,
    IT: 6,
    SUPPORT: 7,
    DESIGN: 8
};

const DEPARTMENT_LABELS = {
    [DEPARTMENT.SALES]: 'Sales',
    [DEPARTMENT.MARKETING]: 'Marketing',
    [DEPARTMENT.HR]: 'Human Resources',
    [DEPARTMENT.FINANCE]: 'Finance',
    [DEPARTMENT.ENGINEERING]: 'Engineering',
    [DEPARTMENT.IT]: 'Information Technology (IT)',
    [DEPARTMENT.SUPPORT]: 'Customer Support',
    [DEPARTMENT.DESIGN]: 'Design'
};

const REGEX_PATTERNS = {
    ALPHAONLY: /^[a-zA-Z]/,
    PHONE: /^\d{10}$/,
    SSN: /^\d{3}-\d{2}-\d{4}$/,
}

module.exports = {
    GENDER,
    GENDER_LABELS,
    COMMUNICATION,
    COMMUNICATION_LABELS,
    DEPARTMENT,
    DEPARTMENT_LABELS,
    REGEX_PATTERNS
};
