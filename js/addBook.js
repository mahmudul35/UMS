function addNewRow() {
  const row = $(`
         <tr>
                    <td>
                      <div class="date-container">
                        <select id="program" class="form-control dropdown">
                          <option value="">--select Program--</option>
                          <option>Engineering admission</option>
                          <option>Varsity Ka admission</option>
                          <option>JSC Model Test</option>
                          <option>SSC Model Test</option>
                        </select>
                      </div>
                    </td>

                    <td>
                      <div class="date-container">
                        <select class="form-control dropdown">
                          <option value="">--select Session--</option>
                          <option>2022</option>
                          <option>2023</option>
                          <option>2024</option>
                          <option>2025</option>
                        </select>
                      </div>
                    </td>

                    <td>
                      <div class="date-container">
                        <select class="form-control dropdown">
                          <option value="">--select type--</option>
                          <option>Engineering course er guide</option>
                          <option>unmesh biology course er guide</option>
                          <option>varsity ka course er guide</option>
                        </select>
                      </div>
                    </td>

                    <td>
                      <div class="date-container">
                        <select class="form-control dropdown">
                          <option value="">--Materials--</option>
                          <option rate="160">Chemistry Practice Book-07</option>
                          <option rate="200">Chemistry Practice Book-08</option>
                          <option rate="300">Chemistry Practice Book-09</option>
                          <option rate="350">Chemistry Practice Book-10</option>
                        </select>
                      </div>
                    </td>

                    <td>
                      <div class="date-container">
                        <input
                          type="number"
                          class="form-control rate"
                          placeholder=" Rate"
                          readonly
                        />
                      </div>
                    </td>
                    <td>
                      <div class="date-container">
                        <input
                          type="text"
                          class="form-control quantity"
                          placeholder="Quantity"
                        />
                      </div>
                    </td>

                    <td>
                      <div class="date-container">
                        <input
                          type="text"
                          class="form-control amount"
                          placeholder="Amount"
                          readonly
                        />
                      </div>
                    </td>

                    <td>
                      <div class="date-container">
                        <input
                          type="text"
                          class="form-control regular"
                          placeholder="Regular (%)"
                        />
                      </div>
                    </td>

                    <td>
                      <div class="date-container">
                        <input
                          type="text"
                          class="form-control special"
                          placeholder="Special (BDT)"
                        />
                      </div>
                    </td>

                    <td>
                      <div class="date-container">
                        <input
                          type="text"
                          class="form-control netAmount"
                          placeholder="Net Amount"
                          readonly
                        />
                      </div>
                    </td>

                    <td>
                      <button
                        type="button"
                        class="btn btn-danger btn-sm removeRow"
                      >
                        -
                      </button>
                    </td>
                  </tr>
      `);

  $("#dateTable tbody").append(row);
}

$(function () {
  //search select2 plugin
  $("#customer").select2({
    placeholder: "Select customer",
    allowClear: true,
    width: "100%",

    minimumResultsForSearch: 0,
  });

  $("#addRow").on("click", function () {
    addNewRow();
  });

  $("#customer").on("select2:select", function (e) {
    const $opt = $(this).find(":selected");
    const discount = $opt.data("discount");
    if (discount) {
      $(".regular").val(discount);
    } else {
      $(".regular").val("");
    }
  });

  //remove row and update total calculation

  $("#dateTable").on("click", ".removeRow", function () {
    $(this).closest("tr").remove();

    let totalAmount = 0;
    $("#dateTable .amount").each(function () {
      totalAmount += parseInt($(this).val()) || 0;
    });
    $("#totalAmount").val(totalAmount);
    $("#totalAmount").trigger("input");

    //calculate regular discount
    let totalRegularDiscount = 0;
    $("#dateTable .regular").each(function () {
      const regularValue = parseInt($(this).val()) || 0;
      if (regularValue > 0) {
        const amount =
          parseInt($(this).closest("tr").find(".amount").val()) || 0;
        totalRegularDiscount += (amount * regularValue) / 100;
      }
    });
    $("#discount").val(totalRegularDiscount);
    $("#discount").trigger("input");

    //calculate special discount
    let totalSpecialDiscount = 0;
    $("#dateTable .special").each(function () {
      const specialValue = parseInt($(this).val()) || 0;
      if (specialValue > 0) {
        totalSpecialDiscount += specialValue;
      }
    });
    $("#specialTotal").val(totalSpecialDiscount);
    $("#specialTotal").trigger("input");
    //grand total calculation
    let grandTotal = 0;
    $("#dateTable .netAmount").each(function () {
      grandTotal += parseInt($(this).val()) || 0;
    });
    $("#grandTotal").val(grandTotal);
    $("#grandTotal").trigger("input");
  });

  //select datatable find  rate attribute to input field
  $("#dateTable").on("change", ".dropdown", function () {
    const $select = $(this);
    const selectedOption = $select.find("option:selected");
    const rate = selectedOption.attr("rate");

    // Set the rate input
    const row = $select.closest("tr");
    row.find(".rate").val(parseInt(rate));

    // Clear the quantity and amount
    row.find(".quantity").val("");
    row.find(".amount").val("");
  });

  //   calculatioin
  $("#dateTable").on(
    "input",
    ".rate, .quantity,.regular,.special",
    function () {
      const row = $(this).closest("tr");

      const value = $(this).val();
      if (isNaN(value) || value < 0) {
        $(this).val("");
      }

      const rate = parseInt(row.find(".rate").val()) || 0;
      const quantity = parseInt(row.find(".quantity").val()) || 0;
      const regular = parseInt(row.find(".regular").val()) || 0;
      const special = parseInt(row.find(".special").val()) || 0;
      const total = rate * quantity;
      row.find(".amount").val(total);
      const netAmount = total - (total * regular) / 100 - special;
      row.find(".netAmount").val(netAmount);

      // Calculate total amount
      let totalAmount = 0;
      $("#dateTable .amount").each(function () {
        totalAmount += parseInt($(this).val()) || 0;
      });
      console.log(totalAmount);
      $("#totalAmount").val(totalAmount);

      //calculate regular discount
      let totalRegularDiscount = 0;
      $("#dateTable .regular").each(function () {
        const regularValue = parseInt($(this).val()) || 0;
        if (regularValue > 0) {
          const amount =
            parseInt($(this).closest("tr").find(".amount").val()) || 0;
          totalRegularDiscount += (amount * regularValue) / 100;
        }
      });
      $("#discount").val(totalRegularDiscount);

      //calculate special discount
      let totalSpecialDiscount = 0;
      $("#dateTable .special").each(function () {
        const specialValue = parseInt($(this).val()) || 0;
        if (specialValue > 0) {
          // const amount =parseInt($(this).closest("tr").find(".amount").val()) || 0;
          totalSpecialDiscount += specialValue;
        }
      });
      $("#specialTotal").val(totalSpecialDiscount);

      //grand total calculation
      let grandTotal = 0;
      $("#dateTable .netAmount").each(function () {
        grandTotal += parseInt($(this).val()) || 0;
      });
      $("#grandTotal").val(grandTotal);
      $("#total").val(grandTotal);
      $("#total").trigger("input");
    }
  );

  $("#dateTable").on("change", ".dropdown", function () {
    const $row = $(this).closest("tr");

    const curVals = $row
      .find(".dropdown")
      .map(function () {
        return $(this).val();
      })
      .get();

    if (curVals.includes("")) return;

    let duplicateFound = false;

    $("#dateTable tbody tr")
      .not($row)
      .each(function () {
        const otherVals = $(this)
          .find(".dropdown")
          .map(function () {
            return $(this).val();
          })
          .get();

        // Simple array‑to‑string comparison
        if (JSON.stringify(otherVals) === JSON.stringify(curVals)) {
          duplicateFound = true;
          return false;
        }
      });

    // If duplicate warn the user and undo their last choice.
    if (duplicateFound) {
      const errorMessage = `<div class="error-message" style="color: red; margin-top: 5px;">This combination already exists. Please select a different option.</div>`;
      $row.find(".error-message").remove();
      $row.after(errorMessage);
      $("#dateTable .error-message").delay(3000).fadeOut(500);

      $row.find(".dropdown").each(function () {
        $(this).val("");
      });
      $(this).closest("tr").find(".quantity").val("");
      $(this).closest("tr").find(".amount").val("");
      $(this).closest("tr").find(".netAmount").val("");
      $(this).closest("tr").find(".rate").val("");

      $(this).closest("tr").find(".special").val("");
    }
    $row.find(".error-message").remove();
  });

  // Handle dropdown change to make quantity required
  $("#dateTable").on("change", ".dropdown", function () {
    const $select = $(this);
    // console.log($select);
    const quantityInput = $select.closest("tr").find(".quantity");

    if ($select.val()) {
      quantityInput.prop("required", true).addClass("has-error");
    } else {
      quantityInput.prop("required", false).removeClass("has-error");
    }
  });

  //   form submit
  $("#fullForm").on("submit", function (e) {
    e.preventDefault();

    const requiredFields = [
      "#customer",
      "#organization",
      "#session",
      "#material",
      "#challan",
    ];

    $("#dateTable .dropdown").each(function () {
      const $dropdown = $(this);
      if ($dropdown.val() === "") {
        $dropdown.closest("tr").find(".error-message").remove();
        // $dropdown.addClass("has-error");
        const errorMessage = `<div class="error-message" style="color: red; margin-top: 5px;">This field is required.</div>`;
        $dropdown.after(errorMessage);
      } else {
        $dropdown.removeClass("has-error");
        $dropdown.closest("tr").find(".error-message").remove();
      }
    });

    requiredFields.forEach(function (selector) {
      const $input = $(selector);
      const value = $input.val();

      if (value === "") {
        $input.closest(".form-group").addClass("has-error");
        isValid = false;
        const errorMessage = `<div class="error-message" style="color: red; margin-top: 5px;">This field is required.</div>`;
        $input.append(errorMessage);
      } else {
        $input.closest(".form-group").removeClass("has-error");
        const salesData = {
          // customer,
          // organization,
          // session,
          // material,
          // totalAmount,
        };
        console.log(salesData);
      }
    });

    // window.location.href = "invoice.html";
  });
  // remove error
  $("#fullForm").on("input change", "input, select", function () {
    const $input = $(this);

    if ($input.val().trim() !== "") {
      $input.closest(".form-group").removeClass("has-error");
    }
    if ($input.val().trim() === "") {
      $input.closest(".form-group").addClass("has-error");
    }
  });

  //remove error on input change
  $("#dateTable").on("input", ".rate, .quantity, .dropdown", function () {
    const $input = $(this);
    $input.removeClass("has-error");

    if ($input.val().trim() === "") {
      $input.addClass("has-error");
    }
  });

  //remove error when not duplicate in dropdown
  $("#dateTable").on("change", ".dropdown", function () {
    const $row = $(this).closest("tr");
    $row.find(".error-message").remove();
    $row.find(".dropdown").removeClass("has-error");
  });
});
