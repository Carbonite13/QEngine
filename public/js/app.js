$(document).ready(function () {
    const table = $('#employeeTable').DataTable({
        ajax: { url: '/employees/api/all', dataSrc: '' },
        columns: [
            { data: 'employeeId' },
            { data: null, render: d => `${d.firstName} ${d.lastName}` },
            { data: 'department' },
            { data: 'jobTitle' },
            { data: 'salary', render: $.fn.dataTable.render.number(',', '.', 2, '$') },
            {
                data: null, className: 'text-center', orderable: false,
                render: d => `
                    <button class="btn btn-sm btn-info edit-btn" data-id="${d.employeeId}">Edit</button>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${d.employeeId}">Delete</button>
                `
            }
        ]
    });

    // SSN Formatting
    $('#ssn').on('input', function() {
        let v = $(this).val().replace(/\D/g, '').slice(0, 9);
        if (v.length > 5) v = `${v.slice(0, 3)}-${v.slice(3, 5)}-${v.slice(5)}`;
        else if (v.length > 3) v = `${v.slice(0, 3)}-${v.slice(3)}`;
        $(this).val(v);
    });

    // Validation
    $.validator.addMethod("ageRange", function(v) {
        if (!v) return true;
        const d = new Date(v), t = new Date();
        const min = new Date(), max = new Date(), ageLimit = new Date();
        min.setFullYear(t.getFullYear() - 120);
        max.setFullYear(t.getFullYear() + 120);
        ageLimit.setFullYear(t.getFullYear() - 18);
        return d >= min && d <= max && d <= ageLimit;
    }, "Invalid age (Min 18, Range 120yrs)");

    const validator = $("#employeeForm").validate({
        rules: {
            firstName: { required: true, minlength: 1, maxlength: 40 },
            lastName: { required: true, minlength: 1, maxlength: 40 },
            dob: { required: true, ageRange: true },
            ssn: { required: true, pattern: /^\d{3}-\d{2}-\d{4}$/ },
            gender: "required",
            email: { required: true, email: true },
            phone: { required: true, digits: true, minlength: 10, maxlength: 10 },
            preferredCommunication: "required",
            jobTitle: "required",
            department: "required",
            salary: { required: true, min: 0.01 },
            address: { required: true, minlength: 10, maxlength: 80 }
        },
        errorClass: "is-invalid",
        errorElement: "span",
        errorPlacement: (e, el) => { e.addClass('invalid-feedback'); el.closest('.form-group').append(e); }
    });

    // Actions
    $('#addBtn').click(() => {
        validator.resetForm(); $('#employeeForm')[0].reset();
        $('#employeeId').val(''); $('#modalTitle').text('Add Employee');
        $('#employeeModal').modal('show');
    });

    $('#employeeTable').on('click', '.edit-btn', function () {
        const id = $(this).data('id');
        $.get(`/employees/api/${id}`, data => {
            validator.resetForm();
            Object.keys(data).forEach(k => $(`#${k}`).val(data[k]));
            $('#modalTitle').text('Edit Employee');
            $('#employeeModal').modal('show');
        });
    });

    $('#employeeForm').on('submit', function (e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (!$(this).valid()) return false;
        
        const id = $('#employeeId').val();
        const url = id ? `/employees/api/edit/${id}` : '/employees/api/create';
        
        $.ajax({
            url: url,
            method: 'POST',
            data: $(this).serialize(),
            success: function() {
                $('#employeeModal').modal('hide');
                table.ajax.reload();
                Swal.fire('Success', 'Record saved!', 'success');
            },
            error: function(xhr) {
                Swal.fire('Error', xhr.responseJSON?.error || 'Failed to save', 'error');
            }
        });
        return false;
    });

    $('#employeeTable').on('click', '.delete-btn', function () {
        const id = $(this).data('id');
        Swal.fire({
            title: 'Delete?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes'
        }).then(res => {
            if (res.isConfirmed) $.post(`/employees/api/delete/${id}`, () => {
                table.ajax.reload();
                Swal.fire('Deleted!', '', 'success');
            });
        });
    });
});
