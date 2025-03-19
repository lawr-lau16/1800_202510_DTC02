window.addEventListener("DOMContentLoaded", function () {
  //   menuFunc();
  //   console.log("aaaa");
  setTimeout(menuFunc, 500);
});

const menuFunc = () => {
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  menuBtn.addEventListener("click", function () {
    mobileMenu.classList.toggle("hidden");
    mobileMenu.classList.toggle("flex");
  });
};
