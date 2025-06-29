// function initializeDatepicker(element) {
//   element.datepicker({
//     format: "mm/dd/yyyy",
//     autoclose: true,
//     todayHighlight: true,
//   });
// }

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
                   placeholder="Effective Date" readonly>
            <span class="calendar-icon">
              <i class="glyphicon glyphicon-calendar"></i>
            </span>
          </div>
        </td>
  
        <td>
          <div class="date-container">
            <input type="text" class="form-control datepicker closing-date"
                   placeholder="Closing Date" readonly>
            <span class="calendar-icon">
              <i class="glyphicon glyphicon-calendar"></i>
            </span>
          </div>
        </td>

        <td>
          <div class="date-container">
            <input type="text" class="form-control  "
                   placeholder="" readonly>
           
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

  // Initialise datepicker on the inputs
  // row.find(".datepicker").datepicker({
  //   format: "mm/dd/yyyy",
  //   autoclose: true,
  //   todayHighlight: true,
  // });

  // Clicking the icon shows the picker for the sibling input
  row.find(".calendar-icon").on("click", function () {
    $(this).siblings(".datepicker").datepicker("show");
  });

  // initializeDatepicker(row.find(".datepicker"));
  updateSerialNumbers();
}

$(document).ready(function () {
  $("#addRow").on("click", function () {
    addNewRow();
  });

  $("#dateTable").on("click", ".removeRow", function () {
    $(this).closest("tr").remove();
    updateSerialNumbers();
  });

  // Add one initial row
  addNewRow();

  // Optional: Form submission handler
  $("#fullForm").on("submit", function (e) {
    e.preventDefault();

    // required input selectors
    const requiredFields = ["#name", "#mobile", "#tin", "#bin"];
    let isValid = true;

    //  error message
    $("#formError").hide();

    // Check each required field
    requiredFields.forEach(function (selector) {
      const $input = $(selector);
      const value = $input.val().trim();

      if (value === "") {
        // Add red border (Bootstrap way)
        $input.closest(".form-group").addClass("has-error");
        isValid = false;
      } else {
        // Remove error style if filled
        $input.closest(".form-group").removeClass("has-error");
      }
    });

    if (!isValid) {
      $("#formError").fadeIn();
      return; // Stop submission
    }

    alert("Form submitted successfully!");
    // Continue with AJAX or actual form submission...
  });

  // Optional: live error removal on typing
  $("#fullForm input").on("input", function () {
    const $input = $(this);
    if ($input.val().trim() !== "") {
      $input.closest(".form-group").removeClass("has-error");
    }
  });
});

//custom function
