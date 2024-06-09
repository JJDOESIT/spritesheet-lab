interface AlertType {
  type: string;
  message: string;
  hidden: boolean;
  maxWidth: number;
}

export default function createAlert(alertData: AlertType) {
  // Return a dict containing the error alert attributes
  if (alertData.type === "error") {
    return {
      hidden: alertData.hidden,
      message: alertData.message,
      maxWidth: alertData.maxWidth,
      borderColor: "1px solid #f5c6cb",
      backgroundColor: "#f8d7da",
      fontColor: "#721c24",
    };
  } else if (alertData.type === "success") {
    return {
      hidden: alertData.hidden,
      message: alertData.message,
      maxWidth: alertData.maxWidth,
      borderColor: "1px solid #c3e6cb",
      backgroundColor: "#d4edda",
      fontColor: "#155724",
    };
  } else {
    // This should never return lol
    return {
      hidden: true,
      message: "",
      maxWidth: 0,
      borderColor: "",
      backgroundColor: "",
      fontColor: "",
    };
  }
}
