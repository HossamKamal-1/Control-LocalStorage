let theInput = document.getElementById("the-input"),
  localStorageActionBtns = document.querySelector(
    ".app .container .buttons"
  ).children,
  resultContainer = document.querySelector(".app .container .result span"),
  btnOperationHandlers = [
    checkLocalStorage,
    addLocalStorageItem,
    deleteLocalStorageItem,
  ];

Array.from(localStorageActionBtns).forEach((btn, index) => {
  if (localStorageActionBtns.length - 1 !== index) {
    btn.onclick = () => clickHandler(btnOperationHandlers[index]);
  } else {
    btn.onclick = showLocalStorageItems;
  }
});

function clickHandler(callBack) {
  if (theInput.value.trim() == "") {
    fireSweetAlert("Enter Valid Local Storage Item", "Error", "error");
    return;
  }
  callBack(theInput.value.trim());
}

function showLocalStorageItems() {
  if (!localStorage.length) {
    resultContainer.innerHTML = "No Items In Local Storage Found";
    return;
  }
  resultContainer.innerHTML = "";
  for (let [key, value] of Object.entries(localStorage)) {
    resultContainer.innerHTML += `<div class="entry">${key} : ${value}</div`;
  }
}

function deleteLocalStorageItem(localStorageItem) {
  if (!localStorage.getItem(localStorageItem)) {
    fireSweetAlert(
      `${localStorageItem} doesn't exists in local storage`,
      "Error",
      "error"
    );
    return;
  }
  Swal.fire({
    title: `Are you sure you want to delete ${localStorageItem}`,
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Delete it",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem(localStorageItem);
      theInput.value = "";
      fireSweetAlert("Deleted Successfully", "", "success", 1500, false);
    }
  });
}

async function addLocalStorageItem(localStorageItem) {
  if (localStorage.getItem(localStorageItem)) {
    Swal.fire({
      title: `${localStorageItem} already exists`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Update it",
    }).then((result) => {
      if (result.isConfirmed) {
        addLocalStorageHelper(localStorageItem);
      }
    });
    return;
  }
  addLocalStorageHelper(localStorageItem);
}

async function addLocalStorageHelper(localStorageItem) {
  const { value } = await Swal.fire({
    title: `Enter ${localStorageItem} Value:`,
    input: "text",
    inputLabel: "Value",
    showCancelButton: true,
    inputValidator: (value) => {
      if (!value) {
        return "You need to write something!";
      }
    },
  });
  if (value) {
    localStorage.setItem(localStorageItem, value);
    Swal.fire(`You added value of ${value}`);
  }
}

function checkLocalStorage(localStorageItem) {
  if (localStorage.getItem(localStorageItem)) {
    resultContainer.innerHTML = `Found Item Called <span>${localStorageItem}</span>`;
    return;
  }
  fireSweetAlert(
    `${localStorageItem} Not Found In Local Storage`,
    "Error",
    "error"
  );
}

function fireSweetAlert(
  text,
  title,
  icon,
  timer = 0,
  showConfirmButton = true
) {
  Swal.fire({
    icon,
    text,
    title,
    timer,
    showConfirmButton,
  });
}
