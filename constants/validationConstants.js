const C = {
    NAME_MIN: 1,
    NAME_MAX: 40,
    ADDRESS_MIN: 10,
    ADDRESS_MAX: 80,
    JOBTITLE_MAX: 60,
    MIN_AGE: 18,
    MAX_AGE: 120,

    GENDERS: ["Male", "Female", "Other"],
    COMMUNICATIONS: ["Email", "Phone"],
    DEPARTMENTS: [
        "Sales",
        "Marketing",
        "Human Resources",
        "Finance",
        "Engineering",
        "Information Technology (IT)",
        "Customer Support",
        "Design",
    ],

    REGEX: {
        NAME:          /^[A-Za-z\s'.-]+$/,
        EMAIL:         /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        SSN:           /^[0-9A-Za-z-]{4,20}$/,
        SSN_DISPLAY:   /^\d{3}-\d{2}-\d{4}$/,
        PHONE:         /^[0-9]{10}$/,
        PHONE_DISPLAY: /^\d{3}-\d{3}-\d{4}$/,
        SALARY:        /^\d+(\.\d{1,2})?$/,
        STRIP_DIGITS:  /\D/g,
    },
};

if (typeof module !== "undefined" && module.exports) {
    module.exports = C;
} else if (typeof window !== "undefined") {
    window.C = C;
}