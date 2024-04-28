document.dispatchEvent(
  new CustomEvent("variableRetrieved", {
    detail: ENV,
  }),
);