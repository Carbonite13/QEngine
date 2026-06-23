$.validator.addMethod(
    "regex",
    function (value, element, regexp) {
        if (regexp.constructor !== RegExp) regexp = new RegExp(regexp);
        return this.optional(element) || regexp.test(value);
    },
    "Invalid format"
);

$.validator.addMethod("adult18", function (value, element) {
    if (!value) return false;
    const dob = new Date(value);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age >= 18;
}, "Employee must be at least 18 years old");

$("#employeeForm").validate({
    rules: {
        firstName: { required: true, minlength: 1, maxlength: 40, regex: /^[A-Za-z\s'.-]+$/ },
        lastName: { required: true, minlength: 1, maxlength: 40, regex: /^[A-Za-z\s'.-]+$/ },
        dateOfBirth: { required: true, adult18: true },
        socialSecurityNumber: { required: true, regex: /^[0-9A-Za-z-]{4,20}$/ },
        gender: { required: true },
        address: { required: true, minlength: 10, maxlength: 80 },
        phoneNumber: { required: true, regex: /^[0-9]{10}$/ },
        emailAddress: { required: true, email: true },
        preferredCommunication: { required: true },
        jobTitle: { required: true, maxlength: 60 },
        department: { required: true },
        salary: { required: true, number: true, min: 0.01 },
    },
});