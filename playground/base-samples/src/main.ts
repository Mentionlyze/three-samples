const iframe = document.querySelector("iframe");

const samples: NodeListOf<HTMLElement> = document.querySelectorAll(".sample");

for (const sample of samples) {
  const target = sample.getAttribute("target");
  if (target === localStorage.getItem("target")) {
    document.querySelector(".active")!.classList.remove("active");
    sample.classList.add("active");
  }
  sample.addEventListener("click", () => {
    localStorage.setItem("target", target!);
    window.location.hash = target!;
    iframe!.src = "./samples/" + target + "/index.html";
    document.querySelector(".active")!.classList.remove("active");
    sample.classList.add("active");
  });
}

(document.querySelector(".sample.active") as HTMLElement)!.click();
