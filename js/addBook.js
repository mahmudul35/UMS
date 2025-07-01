// add row function
function toggleAddRowButton() {
  const lastClosing = $("#dateTable tbody tr:last .closing-date").val().trim();
  if (lastClosing === "") {
    $("#addRow").hide();
  } else {
    $("#addRow").show();
  }
}

function addNewRow() {
  const row = $(`
        <tr>
        
          <td>
          <div class=" date-container">
  <select class="form-control dropdown">
    <option value="">--select one--</option>
    <option>Chemistry Practice Book-07</option>
    <option>Chemistry Practice Book-08</option>
    <option>Chemistry Practice Book-09</option>
    <option>Chemistry Practice Book-10</option>
  </select>
   
</div>

          </td>
    
          <td>
            <div class="date-container">
              <input type="text" class="form-control rate"
                     placeholder=" Rate" >
             
            </div>
          </td>
  
          <td>
            <div class="date-container">
              <input type="text" class="form-control quantity "
                     placeholder="" >
             
            </div>
          </td>

          <td>
            <div class="date-container">
              <input type="text" class="form-control amount "
                     placeholder="Amount" readonly>
             
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
}

$(function () {
  $("#addRow").on("click", function () {
    addNewRow();
  });

  $("#dateTable").on("click", ".removeRow", function () {
    $(this).closest("tr").remove();
  });

  addNewRow();

  //   calculatioin total amount and grand Total

  $("#dateTable").on("input", ".rate, .quantity", function () {
    const row = $(this).closest("tr");
    const rate = parseFloat(row.find(".rate").val()) || 0;
    const quantity = parseFloat(row.find(".quantity").val()) || 0;
    const total = rate * quantity;
    row.find(".amount").val(total.toFixed(2));

    let totalAmount = 0;
    $("#dateTable .amount").each(function () {
      totalAmount += parseFloat($(this).val());
    });

    console.log(totalAmount);
    $("#totalAmount").val(totalAmount);
  });

  $("#dateTable").on("change", ".dropdown", function () {
    const $select = $(this);
    const selectedValue = $select.val();

    // Remove any previous error state
    $select.removeClass("dup-error");
    $select.next(".error-tip").remove();

    const allValues = $(".dropdown")
      .not(this)
      .map(function () {
        return $(this).val();
      })
      .get();

    //  duplicate
    if (selectedValue && allValues.includes(selectedValue)) {
      $select
        .addClass("dup-error")
        .after('<span class="error-tip">This item is already selected</span>');

      $select.prop("selectedIndex", 0);
    }
  });

  //   form submit
  $("#fullForm").on("submit", function (e) {
    e.preventDefault();
    const customer = $("#customer").val();
    const organization = $("#organization").val();
    const program = $("#program").val();
    const session = $("#session").val();
    const material = $("#material").val();
    // const salesDAte = $("#").val();
    const totalAmount = $("#total").val();

    const requiredFields = [
      "#customer",
      "#organization",
      "#program",
      "#session",
      "#material",
      "#salesDate",
      "#challan",
    ];

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
    const salesData = {
      customer,
      organization,
      program,
      session,
      material,
      totalAmount,
    };
    console.log(salesData);

    window.location.href = "invoice.html";
  });
  // remove error
  $("#fullForm").on("input change", "input, select", function () {
    const $input = $(this);

    if ($input.val().trim() !== "") {
      $input.closest(".form-group").removeClass("has-error");
    }
  });
});
