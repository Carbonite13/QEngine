export default {
    NAME_MIN: 1,
    NAME_MAX: 40,
    ADDRESS_MIN: 10,
    ADDRESS_MAX: 80,
    JOBTITLE_MAX: 60,
    MIN_AGE: 18,
    MAX_AGE: 120,

    GENDERS: {
        0: "Male",
        1: "Female",
        2: "Other",
    },

    COMMUNICATIONS: {
        0: "Email",
        1: "Phone"
    },

    DEPARTMENTS: {
        0: "Sales",
        1: "Marketing",
        2: "Human Resources",
        3: "Finance",
        4: "Engineering",
        5: "Information Technology (IT)",
        6: "Customer Support",
        7: "Design",
    },

    REGEX: {
        SSN: /^[0-9A-Za-z-]{4,20}$/,
        SSN_DISPLAY: /^\d{3}-\d{2}-\d{4}$/,
        PHONE: /^[0-9]{10}$/,
        EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        ALPHAONLY: /^[A-Za-z]+$/,
        NUMBERONLY: /^[0-9]+$/,
        ALPHANUMERIC: /^[A-Za-z0-9]+$/,
        ALPHA_EXTENDED: /^[A-Za-z\s'.-]+$/,
    }
};