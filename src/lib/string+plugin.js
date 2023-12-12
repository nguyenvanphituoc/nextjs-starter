Object.defineProperty(String.prototype, "capitalizeWords", {
  value: function capitalizeWords() {
    return this.split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  },
  writable: true,
  configurable: true,
});

export function capitalizeWords() {
  return this.split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
