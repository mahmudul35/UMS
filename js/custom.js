/*Add‑Row button based  Closing Date */
function toggleAddRowButton() {
  const lastClosing = $("#dateTable tbody tr:last .closing-date").val().trim();
  if (lastClosing === "") {
    $("#addRow").hide();
  } else {
    $("#addRow").show();
  }
}

function updateSerialNumbers() {
  $("#dateTable tbody tr").each(function (index) {
    $(this)
      .find("td:first")
      .text(index + 1);
  });
}

function addNewRow() {
  const row = $(`
      <tr>
        <td></td> 

        <td>
          <div class="date-container">
            <input type="text" class="form-control datepicker effective-date"
                   placeholder="Effective Date">
            <span class="calendar-icon">
              <i class="glyphicon glyphicon-calendar"></i>
            </span>
          </div>
          <div class="error-message" style="color:red; font-size:0.9em;"></div>
        </td>

        <td>
          <div class="date-container">
            <input type="text" class="form-control datepicker closing-date"
                   placeholder="Closing Date">
            <span class="calendar-icon">
              <i class="glyphicon glyphicon-calendar"></i>
            </span>
          </div>
          <div class="error-message" style="color:red; font-size:0.9em;"></div>
        </td>

        <td>
          <div class="date-container">
            <input type="" class="form-control percentage"
                   placeholder="" disabled>
          </div>
        </td>

        <td>
          <button type="button" class="btn btn-danger btn-sm removeRow">
            -
          </button>
        </td>
      </tr>
    `);

  $("#dateTable tbody").append(row);

  // Initialize datepicker
  row.find(".datepicker").datepicker({
    todayBtn: "linked",
    format: "yyyy-mm-dd",
    autoclose: true,
    todayHighlight: true,
  });

  // Handle Effective Date change
  row.find(".effective-date").on("change", function () {
    const $percentage = row.find(".percentage");
    const hasEff = $(this).val().trim() !== "";

    $percentage.prop({ disabled: !hasEff, required: hasEff });

    const needError = hasEff && $percentage.val().trim() === "";
    if (needError) {
      $percentage.addClass("has-error");
    }

    // Remove error on input
    $percentage.off("input").on("input", function () {
      $(this).removeClass("has-error");
      if (isNaN($(this).val().trim()) || $(this).val().trim() === "") {
        $(this).addClass("has-error");
        $(this).val("");
      }
    });
  });

  // Validate Closing Date >= Effective Date
  function validateDates(effectiveInput, closingInput, errorDiv) {
    const effectiveDateStr = effectiveInput.val().trim();
    const closingDateStr = closingInput.val().trim();

    if (!effectiveDateStr || !closingDateStr) return;

    const effectiveDate = new Date(effectiveDateStr);
    const closingDate = new Date(closingDateStr);

    if (closingDate < effectiveDate) {
      closingInput.val("");
      return false;
    } else if (effectiveDate > closingDate) {
      // errorDiv.text("Effective date must be before or same as Closing date.");
      effectiveInput.val("");
      return false;
    }
  }

  // Handle Closing Date change
  row.find(".closing-date").on("change", function () {
    const effectiveInput = row.find(".effective-date");
    const closingInput = $(this);
    const errorDiv = row.find(".error-message").eq(1); // second error div

    validateDates(effectiveInput, closingInput, errorDiv);
    toggleAddRowButton();
  });

  // Handle Effective Date change (re-check Closing Date)
  row.find(".effective-date").on("change", function () {
    const effectiveInput = $(this);
    const closingInput = row.find(".closing-date");
    const errorDiv = row.find(".error-message").eq(1);

    validateDates(effectiveInput, closingInput, errorDiv);
  });

  // Remove Row functionality
  row.on("click", ".removeRow", function () {
    if ($("#dateTable tbody tr").length === 1) {
      $("#addRow").show();
    }
    $(this).closest("tr").remove();
    updateSerialNumbers();
  });

  updateSerialNumbers();
  toggleAddRowButton();
}
$(document).ready(function () {
  $("#addRow").on("click", function () {
    addNewRow();
  });

  // initial row
  // addNewRow();

  $("#mobile").on("input", function () {
    const value = $(this).val();
    const bdPhonePattern = /^(?:\+88|88)?01[3-9]\d{8}$/;
    if (!bdPhonePattern.test(value)) {
      $(this).closest(".form-group").addClass("has-error");
    } else {
      $(this).closest(".form-group").removeClass("has-error");
    }
  });

  // Form submission
  $("#fullForm").on("submit", function (e) {
    e.preventDefault();

    // required input selectors
    const requiredFields = ["#name", "#tin", "#bin"];
    const bdPhonePattern = /^(?:\+88|88)?01[3-9]\d{8}$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let isValid = true;
    $("#mobile").siblings("span").hide();
    //check bd phone number
    if (!bdPhonePattern.test($("#mobile").val())) {
      $("#mobile").closest(".form-group").addClass("has-error");
      $("#mobile").siblings("span").show();
      isValid = false;
    }
    //check valid email
    if (!emailPattern.test($("#email").val())) {
      $("#email").closest(".form-group").addClass("has-error");
      isValid = false;
    }

    // Check each required field
    requiredFields.forEach(function (selector) {
      const $input = $(selector);
      const value = $input.val().trim();

      if (value === "") {
        $input.closest(".form-group").addClass("has-error");
        isValid = false;
      } else {
        $input.closest(".form-group").removeClass("has-error");
      }
    });

    //date select logic
    $("#dateTable tbody tr").each(function () {
      const effectiveDate = $(this).find(".effective-date").val().trim();
      const percentage = $(this).find(".percentage").val().trim();

      if (effectiveDate !== "" && percentage === "") {
        $(this).find(".percentage").addClass("has-error");
        isValid = false;
      } else {
        $(this).find(".percentage").removeClass("has-error");
      }
    });

    if (!isValid) {
      return;
    }

    let customer = [];

    const existingValue = JSON.parse(sessionStorage.getItem("customer"));
    if (existingValue) {
      customer.push(existingValue);
    }

    console.log(customer);

    const customerData = {
      name: $("#name").val(),
      mobile: $("#mobile").val(),
      tin: $("#tin").val(),
      bin: $("#bin").val(),
      email: $("#email").val(),
      address: $("#address").val(),
      status: $("#status").val(),
      effDate: $(".effective-date").val(),
      closeDate: $(".closing-date").val(),
    };
    customer.push(customerData);
    const data = sessionStorage.setItem("customer", JSON.stringify(customer));

    window.location.href = "index.html";
  });
  //  error removal
  $("#fullForm  input").on("input", function () {
    const $input = $(this);
    if ($input.val().trim() !== "") {
      $input.closest(".form-group").removeClass("has-error");
    }
  });
});
